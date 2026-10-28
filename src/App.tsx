/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ActiveTab, UserRole, Movie, Showtime, Booking } from './types';
import { MOVIES_DATA, INITIAL_SHOWTIMES } from './data/moviesData';
import { TopBar } from './components/navigation/TopBar';
import { MovieCatalog } from './components/cinema/MovieCatalog';
import { MovieDetailModal } from './components/cinema/MovieDetailModal';
import { SeatReservationModal } from './components/cinema/SeatReservationModal';
import { TicketModal } from './components/cinema/TicketModal';
import { MyBookingsModal } from './components/cinema/MyBookingsModal';
import { ManagerViewModal } from './components/cinema/ManagerViewModal';

import { ArchitectureSection } from './components/docs/ArchitectureSection';
import { ERDiagramSection } from './components/docs/ERDiagramSection';
import { MvcPatternSection } from './components/docs/MvcPatternSection';
import { UserFlowSection } from './components/docs/UserFlowSection';
import { RolesAndFeaturesSection } from './components/docs/RolesAndFeaturesSection';
import { DemoVideoPlayer } from './components/docs/DemoVideoPlayer';
import { SetupGuideSection } from './components/docs/SetupGuideSection';
import { ShieldAlert, Film, Terminal } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('movies');
  const [currentRole, setCurrentRole] = useState<UserRole>('customer');

  // Seeded sample initial booking so user can test ticket pass right away
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 'bk-seed-1',
      bookingReference: 'IM-91823',
      movieId: 'mov-1',
      movieTitle: 'Interstellar Odyssey',
      moviePoster: '/src/assets/images/poster_interstellar_odyssey_1793178099661.jpg',
      theatreName: 'IMovies Cineplex Grand',
      screenName: 'Auditorium 1 (Laser IMAX)',
      screenType: 'IMAX Laser',
      showtime: '18:15',
      showdate: 'Today',
      seats: [
        { id: 'D-5', row: 'D', col: 5, tier: 'premium', price: 26.25 },
        { id: 'D-6', row: 'D', col: 6, tier: 'premium', price: 26.25 }
      ],
      snacks: [
        { id: 'snk-1', name: 'Artisan Truffle & Butter Popcorn', quantity: 1, price: 8.5 }
      ],
      subtotal: 61.0,
      bookingFee: 2.5,
      tax: 4.88,
      totalAmount: 68.38,
      paymentMethod: 'Credit Card (Stripe Secured)',
      paymentStatus: 'paid',
      bookingStatus: 'confirmed',
      qrCodeToken: 'IMV-IM91823-7F9A2C-SECURE',
      createdAt: new Date().toISOString(),
      userEmail: 'sarah.connor@example.com'
    }
  ]);

  // Modal states
  const [selectedMovieForDetail, setSelectedMovieForDetail] = useState<Movie | null>(null);
  const [reservationSession, setReservationSession] = useState<{
    movie: Movie;
    showtime: Showtime;
  } | null>(null);
  const [viewingTicketBooking, setViewingTicketBooking] = useState<Booking | null>(null);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState<boolean>(false);
  const [isManagerConsoleOpen, setIsManagerConsoleOpen] = useState<boolean>(false);

  const handleStartBooking = (movie: Movie, showtime?: Showtime) => {
    setSelectedMovieForDetail(null);
    const targetShowtime =
      showtime ||
      INITIAL_SHOWTIMES.find((st) => st.movieId === movie.id) ||
      INITIAL_SHOWTIMES[0];

    setReservationSession({
      movie,
      showtime: targetShowtime
    });
  };

  const handleBookingCompleted = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    setReservationSession(null);
    setViewingTicketBooking(newBooking);
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, bookingStatus: 'cancelled' } : b))
    );
  };

  const handleNavigateToFeatureFromVideo = (featureKey: string) => {
    if (featureKey === 'movies') {
      setActiveTab('movies');
    } else if (featureKey === 'showtimes') {
      setActiveTab('movies');
      setSelectedMovieForDetail(MOVIES_DATA[0]);
    } else if (featureKey === 'seat_selection') {
      setActiveTab('movies');
      handleStartBooking(MOVIES_DATA[0]);
    } else if (featureKey === 'checkout') {
      if (bookings.length > 0) {
        setViewingTicketBooking(bookings[0]);
      } else {
        handleStartBooking(MOVIES_DATA[0]);
      }
    } else if (featureKey === 'roles') {
      setActiveTab('roles');
    } else if (featureKey === 'setup_deployment') {
      setActiveTab('setup_deployment');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-200 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navigation Bar */}
      <TopBar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        bookingsCount={bookings.filter((b) => b.bookingStatus === 'confirmed').length}
        onOpenBookings={() => setIsMyBookingsOpen(true)}
        currentRole={currentRole}
        onChangeRole={(role) => setCurrentRole(role)}
      />

      {/* Role Manager Strip if Manager or Admin is active */}
      {currentRole !== 'customer' && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>
              Operating in <strong>{currentRole === 'super_admin' ? 'Super Admin' : 'Theatre Manager'}</strong> mode with box-office overrides and turnstile scanner permissions.
            </span>
          </div>

          <button
            onClick={() => setIsManagerConsoleOpen(true)}
            className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs transition-colors shadow-sm"
          >
            Open Operations Console
          </button>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTab === 'movies' && (
          <MovieCatalog
            onSelectMovie={(movie) => setSelectedMovieForDetail(movie)}
            onBookShowtime={(movie, showtime) => handleStartBooking(movie, showtime)}
            userRole={currentRole}
            onOpenDemoVideo={() => setActiveTab('demo_video')}
            onOpenArchitecture={() => setActiveTab('architecture')}
          />
        )}

        {activeTab === 'architecture' && <ArchitectureSection />}

        {activeTab === 'er_diagram' && <ERDiagramSection />}

        {activeTab === 'mvc_pattern' && <MvcPatternSection />}

        {activeTab === 'user_flow' && <UserFlowSection />}

        {(activeTab === 'roles' || activeTab === 'features') && (
          <RolesAndFeaturesSection
            currentRole={currentRole}
            onChangeRole={(role) => setCurrentRole(role)}
          />
        )}

        {activeTab === 'demo_video' && (
          <DemoVideoPlayer onNavigateToFeature={handleNavigateToFeatureFromVideo} />
        )}

        {activeTab === 'setup_deployment' && <SetupGuideSection />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#070b10] text-slate-400 text-xs py-8 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-medium">
            <Film className="w-4 h-4 text-amber-500" />
            <span>The IMovies Cinema Platform & Technical Documentation</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>Express.js 4.21</span>
            <span aria-hidden="true">·</span>
            <span>MongoDB 7.0 Atlas</span>
            <span aria-hidden="true">·</span>
            <span>React 19 SPA</span>
            <span aria-hidden="true">·</span>
            <span>Distributed Mutex Locking</span>
          </div>

          <div className="text-slate-500">
            © 2026 The IMovies Project. Complete Architectural Reference.
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* Movie Details Modal */}
      {selectedMovieForDetail && (
        <MovieDetailModal
          movie={selectedMovieForDetail}
          onClose={() => setSelectedMovieForDetail(null)}
          onSelectShowtime={(st) => handleStartBooking(selectedMovieForDetail, st)}
        />
      )}

      {/* Real-Time Seat Reservation Modal */}
      {reservationSession && (
        <SeatReservationModal
          movie={reservationSession.movie}
          showtime={reservationSession.showtime}
          onClose={() => setReservationSession(null)}
          onBookingComplete={handleBookingCompleted}
        />
      )}

      {/* E-Ticket Boarding Pass Modal */}
      {viewingTicketBooking && (
        <TicketModal
          booking={viewingTicketBooking}
          onClose={() => setViewingTicketBooking(null)}
        />
      )}

      {/* My Bookings List Modal */}
      {isMyBookingsOpen && (
        <MyBookingsModal
          bookings={bookings}
          onClose={() => setIsMyBookingsOpen(false)}
          onViewTicket={(b) => {
            setIsMyBookingsOpen(false);
            setViewingTicketBooking(b);
          }}
          onCancelBooking={handleCancelBooking}
        />
      )}

      {/* Manager Operations Console Modal */}
      {isManagerConsoleOpen && (
        <ManagerViewModal
          userRole={currentRole}
          bookings={bookings}
          onClose={() => setIsManagerConsoleOpen(false)}
        />
      )}
    </div>
  );
}
