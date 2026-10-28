import React from 'react';
import { Booking } from '../../types';
import { X, Ticket, Trash2, ExternalLink, Calendar, MapPin, AlertCircle } from 'lucide-react';

interface MyBookingsModalProps {
  bookings: Booking[];
  onClose: () => void;
  onViewTicket: (booking: Booking) => void;
  onCancelBooking: (bookingId: string) => void;
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({
  bookings,
  onClose,
  onViewTicket,
  onCancelBooking
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0e1420] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">My Cinema Reservations</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bookings List */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {bookings.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Ticket className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-slate-400 text-sm">You haven't reserved any cinema tickets yet.</p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors"
              >
                Browse Now Playing Movies
              </button>
            </div>
          ) : (
            bookings.map((booking) => {
              const isCancelled = booking.bookingStatus === 'cancelled';
              return (
                <div
                  key={booking.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isCancelled
                      ? 'bg-slate-950/40 border-slate-800/50 opacity-60'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex gap-4">
                    <img
                      src={booking.moviePoster}
                      alt={booking.movieTitle}
                      referrerPolicy="no-referrer"
                      className="w-16 aspect-[3/4] object-cover rounded-md border border-slate-800 shrink-0"
                    />

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-amber-400">
                          {booking.bookingReference}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                            isCancelled
                              ? 'bg-rose-950/50 text-rose-400 border border-rose-900/40'
                              : 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/40'
                          }`}
                        >
                          {isCancelled ? 'CANCELLED & REFUNDED' : 'CONFIRMED PASS'}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-white">{booking.movieTitle}</h3>
                      <p className="text-xs text-slate-400">
                        {booking.theatreName} · {booking.screenName}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 font-mono pt-1">
                        <span>{booking.showdate} {booking.showtime}</span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span>Seats: {booking.seats.map((s) => `${s.row}${s.col}`).join(', ')}</span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span className="text-emerald-400 font-semibold">${booking.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {!isCancelled && (
                    <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-slate-800/80">
                      <button
                        onClick={() => onViewTicket(booking)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View Boarding Pass</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Cancel reservation ${booking.bookingReference} and release seats?`)) {
                            onCancelBooking(booking.id);
                          }
                        }}
                        className="px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-xs font-medium text-rose-300 border border-rose-900/40 rounded-lg flex items-center gap-1.5 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Cancel Booking</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
