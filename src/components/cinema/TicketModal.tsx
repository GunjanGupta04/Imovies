import React from 'react';
import { Booking } from '../../types';
import { X, CheckCircle, Download, Printer, Share2, Film, QrCode } from 'lucide-react';

interface TicketModalProps {
  booking: Booking;
  onClose: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({ booking, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0e1420] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header Notification */}
        <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <CheckCircle className="w-4 h-4" />
            <span>Reservation Confirmed & Secured</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Boarding Pass Body */}
        <div className="p-6 space-y-6">
          {/* Main Cinema Pass Card */}
          <div className="relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            {/* Top Film Strip */}
            <div className="p-5 flex gap-4 border-b border-dashed border-slate-700/80">
              <img
                src={booking.moviePoster}
                alt={booking.movieTitle}
                referrerPolicy="no-referrer"
                className="w-20 aspect-[3/4] object-cover rounded-md border border-slate-700 shrink-0"
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400">
                    Official E-Pass
                  </span>
                  <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
                    {booking.movieTitle}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{booking.theatreName}</p>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-300">
                  <span className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-400">
                    {booking.screenType}
                  </span>
                  <span>{booking.screenName}</span>
                </div>
              </div>
            </div>

            {/* Middle Grid */}
            <div className="p-5 grid grid-cols-2 gap-4 text-xs bg-slate-950/40 border-b border-dashed border-slate-700/80">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Date & Time</span>
                <span className="text-slate-200 font-bold font-mono">
                  {booking.showdate} · {booking.showtime}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Booking Reference</span>
                <span className="text-amber-400 font-bold font-mono tracking-wider">
                  {booking.bookingReference}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Allocated Seats</span>
                <span className="text-slate-200 font-bold font-mono">
                  {booking.seats.map((s) => `${s.row}${s.col}`).join(', ')} ({booking.seats[0]?.tier.toUpperCase()})
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Amount Paid</span>
                <span className="text-emerald-400 font-bold font-mono">
                  ${booking.totalAmount.toFixed(2)} (Tax Inc.)
                </span>
              </div>
            </div>

            {/* Snacks if any */}
            {booking.snacks.length > 0 && (
              <div className="px-5 py-3 bg-slate-900/60 border-b border-dashed border-slate-700/80 text-xs">
                <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">
                  Express Concessions Pickup
                </span>
                <div className="flex flex-wrap gap-2 text-slate-300 font-medium">
                  {booking.snacks.map((snk) => (
                    <span key={snk.id} className="bg-slate-800 px-2 py-0.5 rounded text-[11px]">
                      {snk.quantity}x {snk.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom QR Section */}
            <div className="p-5 flex items-center justify-between gap-4 bg-slate-950">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">
                  Scan at Auditorium Turnstile
                </span>
                <span className="text-xs font-mono text-slate-400 break-all">
                  {booking.qrCodeToken.slice(0, 24)}...
                </span>
                <span className="text-[10px] text-emerald-400 font-medium block">
                  Cryptographically Verified
                </span>
              </div>

              {/* Realistic QR Matrix Representation */}
              <div className="p-2 bg-white rounded-lg shrink-0 shadow">
                <div className="w-20 h-20 grid grid-cols-6 grid-rows-6 gap-0.5 bg-black p-1">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-full h-full ${
                        i % 2 === 0 || i % 5 === 0 || i === 0 || i === 5 || i === 30 || i === 35
                          ? 'bg-black'
                          : 'bg-white'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2 border border-slate-700"
            >
              <Printer className="w-4 h-4 text-slate-400" />
              <span>Print Boarding Pass</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <span>Back to Movies</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
