import React, { useState, useEffect } from 'react';
import { Movie, Showtime, Seat, SnackItem, Booking } from '../../types';
import { SNACKS_MENU } from '../../data/moviesData';
import { X, Lock, Check, Clock, AlertTriangle, ShieldCheck, ShoppingBag, Plus, Minus, CreditCard } from 'lucide-react';

interface SeatReservationModalProps {
  movie: Movie;
  showtime: Showtime;
  onClose: () => void;
  onBookingComplete: (booking: Booking) => void;
}

export const SeatReservationModal: React.FC<SeatReservationModalProps> = ({
  movie,
  showtime,
  onClose,
  onBookingComplete
}) => {
  // Generate realistic auditorium seating grid (8 rows: A-H, 10 columns: 1-10)
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const cols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Initialize seat state with realistic occupied distribution
  const [seats, setSeats] = useState<Seat[]>(() => {
    const list: Seat[] = [];
    rows.forEach((row) => {
      cols.forEach((col) => {
        let tier: 'standard' | 'premium' | 'vip' = 'standard';
        let priceMultiplier = 1.0;

        if (row === 'A' || row === 'B') {
          tier = 'standard';
          priceMultiplier = 1.0;
        } else if (row === 'C' || row === 'D' || row === 'E' || row === 'F') {
          tier = 'premium';
          priceMultiplier = 1.25;
        } else {
          tier = 'vip';
          priceMultiplier = 1.5;
        }

        const seatId = `${row}-${col}`;
        // Deterministic pseudo-random occupied seats based on showtime ID and seat coordinate
        const charCode = (row.charCodeAt(0) * 17 + col * 31 + showtime.id.charCodeAt(3)) % 100;
        let status: 'available' | 'reserved' | 'locked' = 'available';

        if (charCode < 22) {
          status = 'reserved';
        } else if (charCode >= 88 && charCode <= 92) {
          status = 'locked';
        }

        list.push({
          id: seatId,
          row,
          col,
          tier,
          price: Number((showtime.basePrice * priceMultiplier).toFixed(2)),
          status
        });
      });
    });
    return list;
  });

  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [lockSecondsLeft, setLockSecondsLeft] = useState<number>(300); // 5 minutes
  const [selectedSnacks, setSelectedSnacks] = useState<{ [snackId: string]: number }>({});
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [step, setStep] = useState<'seats' | 'snacks' | 'checkout'>('seats');

  // Concurrency Lock countdown timer
  useEffect(() => {
    if (selectedSeatIds.length === 0) return;

    const timer = setInterval(() => {
      setLockSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto release on timeout
          setSelectedSeatIds([]);
          return 300;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedSeatIds.length]);

  const handleToggleSeat = (seat: Seat) => {
    if (seat.status === 'reserved' || seat.status === 'locked') return;

    if (selectedSeatIds.includes(seat.id)) {
      setSelectedSeatIds((prev) => prev.filter((id) => id !== seat.id));
    } else {
      if (selectedSeatIds.length >= 8) {
        alert('Maximum of 8 seats can be reserved in a single transaction.');
        return;
      }
      setSelectedSeatIds((prev) => [...prev, seat.id]);
    }
  };

  const selectedSeats = seats.filter((s) => selectedSeatIds.includes(s.id));

  const seatsSubtotal = selectedSeats.reduce((acc, s) => acc + s.price, 0);

  const snacksSubtotal = Object.entries(selectedSnacks).reduce((acc, [snackId, qty]) => {
    const item = SNACKS_MENU.find((s) => s.id === snackId);
    return acc + (item ? item.price * qty : 0);
  }, 0);

  const bookingFee = selectedSeats.length > 0 ? 2.5 : 0;
  const tax = Number(((seatsSubtotal + snacksSubtotal) * 0.08).toFixed(2));
  const grandTotal = Number((seatsSubtotal + snacksSubtotal + bookingFee + tax).toFixed(2));

  const handleSnackQtyChange = (snackId: string, delta: number) => {
    setSelectedSnacks((prev) => {
      const current = prev[snackId] || 0;
      const nextVal = Math.max(0, current + delta);
      if (nextVal === 0) {
        const copy = { ...prev };
        delete copy[snackId];
        return copy;
      }
      return { ...prev, [snackId]: nextVal };
    });
  };

  const handleConfirmReservation = () => {
    if (selectedSeats.length === 0) return;

    setIsProcessing(true);

    // Simulate backend ACID commit in Express & MongoDB
    setTimeout(() => {
      const bookingRef = `IM-${Math.floor(10000 + Math.random() * 90000)}`;
      const qrToken = `IMV-${bookingRef}-${Date.now().toString(36).toUpperCase()}-SECURE`;

      const finalBooking: Booking = {
        id: `bk-${Date.now()}`,
        bookingReference: bookingRef,
        movieId: movie.id,
        movieTitle: movie.title,
        moviePoster: movie.posterUrl,
        theatreName: showtime.theatreName,
        screenName: showtime.screenName,
        screenType: showtime.screenType,
        showtime: showtime.time,
        showdate: showtime.date,
        seats: selectedSeats.map((s) => ({
          id: s.id,
          row: s.row,
          col: s.col,
          tier: s.tier,
          price: s.price
        })),
        snacks: Object.entries(selectedSnacks).map(([snackId, qty]) => {
          const item = SNACKS_MENU.find((s) => s.id === snackId)!;
          return {
            id: item.id,
            name: item.name,
            quantity: qty,
            price: item.price
          };
        }),
        subtotal: seatsSubtotal + snacksSubtotal,
        bookingFee,
        tax,
        totalAmount: grandTotal,
        paymentMethod: 'Credit Card (Stripe Secured)',
        paymentStatus: 'paid',
        bookingStatus: 'confirmed',
        qrCodeToken: qrToken,
        createdAt: new Date().toISOString(),
        userEmail: 'customer@imovies.io'
      };

      setIsProcessing(false);
      onBookingComplete(finalBooking);
    }, 1200);
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#0b0f17] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-4">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <span>{showtime.theatreName}</span>
              <span aria-hidden="true">·</span>
              <span>{showtime.screenName}</span>
              <span aria-hidden="true">·</span>
              <span>{showtime.time}</span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">{movie.title}</h2>
          </div>

          <div className="flex items-center gap-3">
            {selectedSeatIds.length > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs font-mono text-amber-400">
                <Clock className="w-3.5 h-3.5" />
                <span>Lock: {formatTimer(lockSecondsLeft)}</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Steps Navigation */}
        <div className="flex items-center border-b border-slate-800 text-xs font-medium bg-slate-950/60">
          <button
            onClick={() => setStep('seats')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              step === 'seats'
                ? 'border-amber-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Select Seats ({selectedSeatIds.length})
          </button>
          <button
            onClick={() => selectedSeatIds.length > 0 && setStep('snacks')}
            disabled={selectedSeatIds.length === 0}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              step === 'snacks'
                ? 'border-amber-500 text-white font-semibold'
                : selectedSeatIds.length > 0
                ? 'border-transparent text-slate-400 hover:text-slate-200'
                : 'border-transparent text-slate-600 cursor-not-allowed'
            }`}
          >
            2. Gourmet Concessions
          </button>
          <button
            onClick={() => selectedSeatIds.length > 0 && setStep('checkout')}
            disabled={selectedSeatIds.length === 0}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              step === 'checkout'
                ? 'border-amber-500 text-white font-semibold'
                : selectedSeatIds.length > 0
                ? 'border-transparent text-slate-400 hover:text-slate-200'
                : 'border-transparent text-slate-600 cursor-not-allowed'
            }`}
          >
            3. Instant Checkout
          </button>
        </div>

        {/* Modal Main Area */}
        <div className="p-6">
          {step === 'seats' && (
            <div className="space-y-8 flex flex-col items-center">
              {/* Curved Cinema Screen */}
              <div className="w-full max-w-xl flex flex-col items-center pt-2">
                <div className="w-full h-3 rounded-full bg-gradient-to-r from-transparent via-amber-400/80 to-transparent shadow-[0_4px_30px_rgba(245,158,11,0.5)]" />
                <span className="text-[11px] font-mono tracking-widest text-slate-400 mt-2 uppercase">
                  Auditorium Curved Screen
                </span>
              </div>

              {/* Seating Grid */}
              <div className="space-y-2.5 overflow-x-auto max-w-full pb-4">
                {rows.map((row) => (
                  <div key={row} className="flex items-center gap-2 justify-center">
                    <span className="w-4 text-xs font-mono font-bold text-slate-500 text-right">
                      {row}
                    </span>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {cols.map((col) => {
                        const seat = seats.find((s) => s.row === row && s.col === col)!;
                        const isSelected = selectedSeatIds.includes(seat.id);
                        const isReserved = seat.status === 'reserved';
                        const isLocked = seat.status === 'locked';

                        return (
                          <button
                            key={seat.id}
                            disabled={isReserved || isLocked}
                            onClick={() => handleToggleSeat(seat)}
                            title={`${seat.tier.toUpperCase()} Seat ${seat.id} - $${seat.price}`}
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md text-[10px] sm:text-xs font-mono font-medium transition-all duration-150 flex items-center justify-center relative
                              ${
                                isReserved
                                  ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-800/80'
                                  : isLocked
                                  ? 'bg-rose-950/40 text-rose-500/80 cursor-not-allowed border border-rose-900/50'
                                  : isSelected
                                  ? 'bg-amber-500 text-slate-950 font-bold scale-110 shadow-lg shadow-amber-500/40 border border-amber-400'
                                  : seat.tier === 'vip'
                                  ? 'bg-indigo-950/60 text-indigo-300 hover:bg-indigo-900 border border-indigo-700/60'
                                  : seat.tier === 'premium'
                                  ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
                                  : 'bg-slate-850 text-slate-400 hover:bg-slate-750 border border-slate-800'
                              }
                            `}
                          >
                            {isSelected ? <Check className="w-3.5 h-3.5" /> : `${col}`}
                          </button>
                        );
                      })}
                    </div>
                    <span className="w-4 text-xs font-mono font-bold text-slate-500 text-left">
                      {row}
                    </span>
                  </div>
                ))}
              </div>

              {/* Legend & Seat Tiers */}
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-400 pt-4 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-slate-850 border border-slate-800" />
                  <span>Standard (${showtime.basePrice.toFixed(2)})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-slate-800 border border-slate-700" />
                  <span>Premium Club (${(showtime.basePrice * 1.25).toFixed(2)})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-indigo-950/60 border border-indigo-700/60" />
                  <span>VIP Recliner (${(showtime.basePrice * 1.5).toFixed(2)})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-amber-500 border border-amber-400 text-slate-950 font-bold flex items-center justify-center text-[10px]">✓</span>
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-slate-800 border border-slate-800 text-slate-600 flex items-center justify-center text-[10px]">✕</span>
                  <span>Occupied</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-rose-950/40 border border-rose-900/50 text-rose-500/80 flex items-center justify-center text-[10px]">
                    <Lock className="w-2.5 h-2.5" />
                  </span>
                  <span>Locked (5m Mutex)</span>
                </div>
              </div>
            </div>
          )}

          {step === 'snacks' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <span>Enhance Your Cinema Experience</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Pre-ordered concessions will be waiting warm & fresh at the express pickup counter.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {SNACKS_MENU.map((snack) => {
                  const qty = selectedSnacks[snack.id] || 0;
                  return (
                    <div
                      key={snack.id}
                      className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-2xl mb-1 block">{snack.icon}</span>
                          <h4 className="text-sm font-semibold text-white">{snack.name}</h4>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{snack.description}</p>
                        </div>
                        <span className="text-xs font-mono font-bold text-amber-400 shrink-0">
                          ${snack.price.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                        <span className="text-xs text-slate-400">Quantity</span>
                        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg p-1">
                          <button
                            onClick={() => handleSnackQtyChange(snack.id, -1)}
                            disabled={qty === 0}
                            className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-mono font-bold text-white">
                            {qty}
                          </span>
                          <button
                            onClick={() => handleSnackQtyChange(snack.id, 1)}
                            className="p-1 text-slate-400 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === 'checkout' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Selected Seats & Screen Summary</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-500 block">Film</span>
                      <span className="text-slate-200 font-semibold">{movie.title}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Auditorium</span>
                      <span className="text-slate-200 font-semibold">{showtime.screenName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Screening Schedule</span>
                      <span className="text-slate-200 font-mono">{showtime.date} · {showtime.time}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Reserved Seats</span>
                      <span className="text-amber-400 font-mono font-bold">
                        {selectedSeats.map((s) => `${s.row}${s.col} (${s.tier})`).join(', ')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Simulated Payment Card Form */}
                <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-amber-400" />
                    <span>Payment Method (Stripe 256-Bit SSL)</span>
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-slate-400 block mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        defaultValue="Sarah Connor"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <label className="text-slate-400 block mb-1">Card Number</label>
                        <input
                          type="text"
                          defaultValue="•••• •••• •••• 4242"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 font-mono text-slate-200 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">Expiry / CVC</label>
                        <input
                          type="text"
                          defaultValue="10/28 · 882"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 font-mono text-slate-200 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Breakdown Sidebar */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4 h-fit">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Billing Reconciliation
                </h4>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Seats ({selectedSeats.length})</span>
                    <span className="font-mono tabular-nums">${seatsSubtotal.toFixed(2)}</span>
                  </div>

                  {snacksSubtotal > 0 && (
                    <div className="flex justify-between">
                      <span>Concessions</span>
                      <span className="font-mono tabular-nums">${snacksSubtotal.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Convenience Booking Fee</span>
                    <span className="font-mono tabular-nums">${bookingFee.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Estimated Tax (8%)</span>
                    <span className="font-mono tabular-nums">${tax.toFixed(2)}</span>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex justify-between text-sm font-bold text-white">
                    <span>Total Amount</span>
                    <span className="font-mono text-amber-400 tabular-nums">
                      ${grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 leading-tight">
                  Tickets will be issued with instant QR boarding passes and added to your active bookings.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="px-6 py-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[11px] text-slate-400 block">Total Due</span>
              <span className="text-lg font-bold font-mono text-amber-400 tabular-nums">
                ${grandTotal.toFixed(2)}
              </span>
            </div>
            {selectedSeats.length > 0 && (
              <span className="text-xs text-slate-400 hidden sm:inline">
                ({selectedSeats.length} {selectedSeats.length === 1 ? 'seat' : 'seats'} selected)
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {step === 'seats' && (
              <button
                disabled={selectedSeats.length === 0}
                onClick={() => setStep('snacks')}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-slate-950 font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-md"
              >
                <span>Continue to Concessions</span>
              </button>
            )}

            {step === 'snacks' && (
              <>
                <button
                  onClick={() => setStep('seats')}
                  className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white"
                >
                  Back to Seats
                </button>
                <button
                  onClick={() => setStep('checkout')}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-md"
                >
                  <span>Review & Pay (${grandTotal.toFixed(2)})</span>
                </button>
              </>
            )}

            {step === 'checkout' && (
              <>
                <button
                  onClick={() => setStep('snacks')}
                  className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white"
                >
                  Back
                </button>
                <button
                  disabled={isProcessing}
                  onClick={handleConfirmReservation}
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Committing ACID Transaction...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Authorize & Generate Ticket</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
