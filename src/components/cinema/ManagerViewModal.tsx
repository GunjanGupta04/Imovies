import React, { useState } from 'react';
import { INITIAL_SHOWTIMES, THEATRES_LIST } from '../../data/moviesData';
import { Booking, UserRole } from '../../types';
import { ShieldAlert, BarChart3, Users, QrCode, CheckCircle2, AlertTriangle, X } from 'lucide-react';

interface ManagerViewModalProps {
  userRole: UserRole;
  bookings: Booking[];
  onClose: () => void;
}

export const ManagerViewModal: React.FC<ManagerViewModalProps> = ({
  userRole,
  bookings,
  onClose
}) => {
  const [ticketQuery, setTicketQuery] = useState('');
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string; booking?: Booking } | null>(null);

  const handleScanTicket = () => {
    if (!ticketQuery.trim()) return;

    const found = bookings.find(
      (b) =>
        b.bookingReference.toLowerCase() === ticketQuery.trim().toLowerCase() ||
        b.qrCodeToken.toLowerCase().includes(ticketQuery.trim().toLowerCase())
    );

    if (found) {
      if (found.bookingStatus === 'cancelled') {
        setScanResult({
          success: false,
          message: `Ticket ${found.bookingReference} was CANCELLED & REFUNDED. Access Denied.`,
          booking: found
        });
      } else {
        setScanResult({
          success: true,
          message: `Valid Boarding Pass verified for ${found.movieTitle}. Grant Entry.`,
          booking: found
        });
      }
    } else {
      setScanResult({
        success: false,
        message: `No active reservation found matching reference "${ticketQuery}".`
      });
    }
  };

  const totalRevenue = bookings
    .filter((b) => b.bookingStatus === 'confirmed')
    .reduce((acc, b) => acc + b.totalAmount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0e1420] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6 space-y-6">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  {userRole === 'super_admin' ? 'Super Admin System Console' : 'Theatre Operations Console'}
                </h2>
                <span className="text-[10px] font-mono uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded">
                  {userRole.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time auditorium capacity, box-office revenue, and gate QR check-in verification.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-8">
          {/* Key Metrics Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
              <span className="text-xs text-slate-400 font-mono">Gross Ticket Sales</span>
              <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                ${totalRevenue.toFixed(2)}
              </div>
              <span className="text-[11px] text-slate-500">Live reconciled revenue</span>
            </div>

            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
              <span className="text-xs text-slate-400 font-mono">Active Confirmed Bookings</span>
              <div className="text-2xl font-bold font-mono text-white tabular-nums">
                {bookings.filter((b) => b.bookingStatus === 'confirmed').length}
              </div>
              <span className="text-[11px] text-slate-500">Customer reservations stored</span>
            </div>

            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
              <span className="text-xs text-slate-400 font-mono">Average Auditorium Occupancy</span>
              <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
                68.4%
              </div>
              <span className="text-[11px] text-slate-500">Across 8 active screens</span>
            </div>
          </div>

          {/* Turnstile Gate Ticket Scanner Simulator */}
          <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>Turnstile Gate Pass Validator</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Booking Reference (e.g. IM-91823) or paste QR token..."
                value={ticketQuery}
                onChange={(e) => setTicketQuery(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none"
              />
              <button
                onClick={handleScanTicket}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
              >
                Verify Pass
              </button>
            </div>

            {scanResult && (
              <div
                className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                  scanResult.success
                    ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
                }`}
              >
                {scanResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-semibold">{scanResult.message}</span>
                  {scanResult.booking && (
                    <div className="mt-1 text-[11px] text-slate-400 font-mono">
                      Guest: {scanResult.booking.userEmail} · Seats: {scanResult.booking.seats.map((s) => `${s.row}${s.col}`).join(', ')} · Total: ${scanResult.booking.totalAmount.toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Active Screen Schedules Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Live Auditoriums & Scheduled Screenings
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 text-[11px] uppercase">
                    <th className="pb-2">Auditorium Screen</th>
                    <th className="pb-2">Screen Format</th>
                    <th className="pb-2">Showtime</th>
                    <th className="pb-2">Capacity</th>
                    <th className="pb-2">Remaining</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {INITIAL_SHOWTIMES.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-850/50">
                      <td className="py-2.5 font-sans font-medium text-white">{st.screenName}</td>
                      <td className="py-2.5 text-amber-400">{st.screenType}</td>
                      <td className="py-2.5">{st.time}</td>
                      <td className="py-2.5">{st.totalSeatsCount}</td>
                      <td className="py-2.5 text-emerald-400">{st.availableSeatsCount}</td>
                      <td className="py-2.5 text-right">
                        <span className="text-[10px] bg-emerald-950/40 text-emerald-400 border border-emerald-900/40 px-2 py-0.5 rounded">
                          Active Screening
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
