import React, { useState } from 'react';
import { Movie, Showtime, UserRole } from '../../types';
import { MOVIES_DATA, HERO_BANNER_IMG } from '../../data/moviesData';
import { Star, Clock, Sparkles, Search, Layers, PlayCircle, Eye, Calendar } from 'lucide-react';

interface MovieCatalogProps {
  onSelectMovie: (movie: Movie) => void;
  onBookShowtime: (movie: Movie, showtime?: Showtime) => void;
  userRole: UserRole;
  onOpenDemoVideo: () => void;
  onOpenArchitecture: () => void;
}

export const MovieCatalog: React.FC<MovieCatalogProps> = ({
  onSelectMovie,
  onBookShowtime,
  userRole,
  onOpenDemoVideo,
  onOpenArchitecture
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedFormat, setSelectedFormat] = useState<string>('All');

  const genres = ['All', 'Sci-Fi', 'Action', 'Adventure', 'Fantasy', 'Thriller'];
  const formats = ['All', 'IMAX 3D', 'Dolby Atmos', '4DX'];

  const filteredMovies = MOVIES_DATA.filter((movie) => {
    const matchesSearch =
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.genres.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesGenre = selectedGenre === 'All' || movie.genres.includes(selectedGenre);
    const matchesFormat =
      selectedFormat === 'All' || movie.formats.some((f) => f.includes(selectedFormat));

    return matchesSearch && matchesGenre && matchesFormat;
  });

  const featuredMovie = MOVIES_DATA[0];

  return (
    <div className="w-full space-y-12">
      {/* Cinematic Hero Section */}
      <section className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_BANNER_IMG}
            alt="IMAX Auditorium Showcase"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-35 filter brightness-75 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-[#0b0f17]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f17] via-[#0b0f17]/80 to-transparent" />
        </div>

        <div className="relative z-10 px-6 sm:px-10 lg:px-12 py-12 sm:py-16 max-w-4xl">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-3">
            <span>PREMIERE SEASON 2026</span>
            <span aria-hidden="true">·</span>
            <span>EXPRESS.JS & MONGODB CLOUD STACK</span>
            <span aria-hidden="true">·</span>
            <span>REAL-TIME SEAT LOCKING</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-4 text-balance">
            {featuredMovie.title}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-3 mb-6 max-w-2xl">
            {featuredMovie.synopsis}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mb-8">
            <span className="flex items-center gap-1 font-semibold text-amber-400">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-mono tabular-nums">{featuredMovie.rating}/10</span>
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{featuredMovie.duration} mins</span>
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{featuredMovie.certification}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{featuredMovie.genres.join(', ')}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onBookShowtime(featuredMovie)}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-lg text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Reserve Seats Now</span>
            </button>

            <button
              onClick={() => onSelectMovie(featuredMovie)}
              className="px-5 py-3 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-medium rounded-lg text-sm transition-colors flex items-center gap-2"
            >
              <Eye className="w-4 h-4 text-slate-400" />
              <span>Movie Details & Cast</span>
            </button>

            <button
              onClick={onOpenDemoVideo}
              className="px-5 py-3 bg-slate-900/60 hover:bg-slate-800/90 text-slate-300 border border-slate-800 font-medium rounded-lg text-sm transition-colors flex items-center gap-2"
            >
              <PlayCircle className="w-4 h-4 text-amber-400" />
              <span>Watch Demo Walkthrough</span>
            </button>
          </div>
        </div>

        {/* Bottom Metadata Band */}
        <div className="relative z-10 border-t border-slate-800/80 bg-slate-950/80 px-6 sm:px-10 py-3 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span className="text-slate-300 font-medium">Supported Formats:</span>
            <span>IMAX Laser 3D</span>
            <span aria-hidden="true">·</span>
            <span>Dolby Cinema 4K</span>
            <span aria-hidden="true">·</span>
            <span>4DX Dynamic Motion</span>
          </div>
          <button
            onClick={onOpenArchitecture}
            className="text-amber-400 hover:underline flex items-center gap-1.5 transition-colors font-mono"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Inspect System Architecture</span>
          </button>
        </div>
      </section>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-slate-900/60 rounded-xl border border-slate-800/80">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by title, director, or cast..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/80 transition-colors"
          />
        </div>

        {/* Filter Buttons / Segmented Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Genre Filters */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  selectedGenre === genre
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* Format Selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5">
            <span className="text-slate-500">Format:</span>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              {formats.map((fmt) => (
                <option key={fmt} value={fmt} className="bg-slate-950 text-slate-200">
                  {fmt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Now Playing in Theatres</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select any title to view available auditoriums, showtimes, and live seat reservations.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {filteredMovies.length} {filteredMovies.length === 1 ? 'Film' : 'Films'} Available
          </span>
        </div>

        {filteredMovies.length === 0 ? (
          <div className="py-16 text-center bg-slate-900/40 rounded-xl border border-slate-800">
            <p className="text-slate-400 text-sm">No movies match your filter criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedGenre('All');
                setSelectedFormat('All');
              }}
              className="mt-3 px-4 py-2 text-xs font-medium text-amber-400 bg-slate-800 rounded-lg hover:bg-slate-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMovies.map((movie) => (
              <div
                key={movie.id}
                className="group flex flex-col bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden hover:border-slate-700 transition-all hover:-translate-y-1 duration-200 shadow-md"
              >
                {/* Poster Container with Fallback */}
                <div className="relative aspect-[3/4] bg-slate-950 overflow-hidden">
                  <img
                    src={movie.posterUrl}
                    alt={`${movie.title} Poster`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />

                  {/* Rating Tag */}
                  <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md border border-slate-700/80 rounded px-2 py-0.5 flex items-center gap-1 text-[11px] font-mono font-semibold text-amber-400">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{movie.rating}</span>
                  </div>

                  {/* Certification Kicker */}
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md border border-slate-700/80 rounded px-2 py-0.5 text-[10px] font-mono text-slate-300">
                    {movie.certification}
                  </div>

                  {/* Quick Preview Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-[2px]">
                    <button
                      onClick={() => onSelectMovie(movie)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-medium flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                    <button
                      onClick={() => onBookShowtime(movie)}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded text-xs font-semibold flex items-center gap-1"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book</span>
                    </button>
                  </div>
                </div>

                {/* Movie Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                      {movie.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {movie.synopsis}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800/60">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>{movie.duration} min</span>
                      <span>{movie.genres[0]}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 text-[10px] text-slate-400">
                      {movie.formats.slice(0, 2).map((fmt) => (
                        <span key={fmt} className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                          {fmt}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => onBookShowtime(movie)}
                      className="w-full mt-2 py-2 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Select Showtime</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
