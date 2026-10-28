import React, { useState } from 'react';
import { Movie, Showtime } from '../../types';
import { INITIAL_SHOWTIMES, THEATRES_LIST } from '../../data/moviesData';
import { X, Star, Clock, Calendar, MapPin, Play, CheckCircle2, Ticket } from 'lucide-react';

interface MovieDetailModalProps {
  movie: Movie;
  onClose: () => void;
  onSelectShowtime: (showtime: Showtime) => void;
}

export const MovieDetailModal: React.FC<MovieDetailModalProps> = ({
  movie,
  onClose,
  onSelectShowtime
}) => {
  const [selectedTheatreId, setSelectedTheatreId] = useState<string>('all');
  const [isPlayingTrailer, setIsPlayingTrailer] = useState<boolean>(false);

  const availableShowtimes = INITIAL_SHOWTIMES.filter(
    (st) => st.movieId === movie.id && (selectedTheatreId === 'all' || st.theatreId === selectedTheatreId)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0e1420] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header / Backdrop Image */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-950">
          <img
            src={movie.backdropUrl || movie.posterUrl}
            alt={movie.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-40 filter brightness-75 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1420] via-[#0e1420]/60 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-full transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Overlay Trailer Simulation */}
          {isPlayingTrailer ? (
            <div className="absolute inset-0 bg-black z-10 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center mb-4 animate-pulse">
                <Play className="w-8 h-8 text-amber-400 fill-amber-400" />
              </div>
              <p className="text-sm font-semibold text-white">Streaming 4K Theatrical Teaser</p>
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                Playing high-bitrate preview stream for {movie.title} encoded in Dolby Atmos 7.1.
              </p>
              <button
                onClick={() => setIsPlayingTrailer(false)}
                className="mt-4 px-4 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg"
              >
                Exit Preview
              </button>
            </div>
          ) : (
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  referrerPolicy="no-referrer"
                  className="w-20 sm:w-24 aspect-[3/4] object-cover rounded-lg border-2 border-slate-700 shadow-xl hidden sm:block shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
                    <span>{movie.certification}</span>
                    <span aria-hidden="true">·</span>
                    <span>{movie.duration} MIN</span>
                    <span aria-hidden="true">·</span>
                    <span>{movie.releaseDate}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {movie.title}
                  </h2>
                  <p className="text-xs text-slate-400 italic mt-0.5">{movie.tagline}</p>
                </div>
              </div>

              <button
                onClick={() => setIsPlayingTrailer(true)}
                className="px-4 py-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 rounded-lg flex items-center gap-2 shrink-0 transition-colors"
              >
                <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Watch Teaser</span>
              </button>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Synopsis & Key Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div>
                <h4 className="text-xs font-mono tracking-wider text-slate-400 uppercase mb-2">
                  Storyline
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed">{movie.synopsis}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800/80 text-xs">
                <div>
                  <span className="text-slate-500 block">Director</span>
                  <span className="text-slate-200 font-medium">{movie.director}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Languages</span>
                  <span className="text-slate-200 font-medium">{movie.languages.join(', ')}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 block">Starring Cast</span>
                  <span className="text-slate-200 font-medium">{movie.cast.join(' · ')}</span>
                </div>
              </div>
            </div>

            {/* Side Card: Ratings & Features */}
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-4 h-fit">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Audience Score</span>
                <div className="flex items-center gap-1 text-sm font-bold text-amber-400 font-mono">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{movie.rating} / 10</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
                <span className="text-slate-400 block mb-1">Available Formats</span>
                <div className="flex flex-wrap gap-1.5">
                  {movie.formats.map((fmt) => (
                    <span
                      key={fmt}
                      className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-[11px] text-slate-200"
                    >
                      {fmt}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Showtimes & Multiplex Filter */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Select Showtime & Auditorium</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time seating availability synchronized with the Express backend.
                </p>
              </div>

              {/* Theatre Filter */}
              <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 self-start sm:self-auto">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <select
                  value={selectedTheatreId}
                  onChange={(e) => setSelectedTheatreId(e.target.value)}
                  className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="all" className="bg-slate-900 text-slate-200">All Multiplexes</option>
                  {THEATRES_LIST.map((th) => (
                    <option key={th.id} value={th.id} className="bg-slate-900 text-slate-200">
                      {th.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Showtime Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {availableShowtimes.map((st) => (
                <div
                  key={st.id}
                  className="p-4 bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/60 rounded-xl transition-all duration-150 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-200 truncate">
                        {st.theatreName}
                      </span>
                      <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                        {st.screenType}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{st.screenName}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                    <div>
                      <span className="text-lg font-bold font-mono text-white tracking-tight">
                        {st.time}
                      </span>
                      <span className="text-[11px] text-slate-500 block">Today</span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-semibold text-slate-200 block">
                        ${st.basePrice.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono">
                        {st.availableSeatsCount} seats left
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectShowtime(st)}
                    className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>Choose Seats</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
