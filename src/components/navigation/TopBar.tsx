import React from 'react';
import { ActiveTab, UserRole } from '../../types';
import { Film, Ticket, ShieldAlert } from 'lucide-react';

interface TopBarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  bookingsCount: number;
  onOpenBookings: () => void;
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  onOpenQuickBook?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onSelectTab,
  bookingsCount,
  onOpenBookings,
  currentRole,
  onChangeRole,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b0f17]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element, no pills, no subtitles) */}
        <button
          onClick={() => onSelectTab('movies')}
          className="text-lg font-bold tracking-tight text-white flex items-center gap-2 whitespace-nowrap shrink-0 hover:text-amber-400 transition-colors"
        >
          <Film className="w-5 h-5 text-amber-500" />
          <span>The IMovies</span>
        </button>

        {/* Zone 2: Concise Single-Line Navigation Links with subtle hover underlines */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onSelectTab('movies')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'movies'
                ? 'text-white border-b-2 border-amber-500 py-1 font-semibold'
                : 'hover:text-white py-1'
            }`}
          >
            Cinema Movies
          </button>
          <button
            onClick={() => onSelectTab('architecture')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'architecture'
                ? 'text-white border-b-2 border-amber-500 py-1 font-semibold'
                : 'hover:text-white py-1'
            }`}
          >
            Architecture
          </button>
          <button
            onClick={() => onSelectTab('er_diagram')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'er_diagram'
                ? 'text-white border-b-2 border-amber-500 py-1 font-semibold'
                : 'hover:text-white py-1'
            }`}
          >
            ER Diagram
          </button>
          <button
            onClick={() => onSelectTab('mvc_pattern')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'mvc_pattern'
                ? 'text-white border-b-2 border-amber-500 py-1 font-semibold'
                : 'hover:text-white py-1'
            }`}
          >
            MVC Pattern
          </button>
          <button
            onClick={() => onSelectTab('user_flow')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'user_flow'
                ? 'text-white border-b-2 border-amber-500 py-1 font-semibold'
                : 'hover:text-white py-1'
            }`}
          >
            User Flow
          </button>
          <button
            onClick={() => onSelectTab('roles')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'roles' || activeTab === 'features'
                ? 'text-white border-b-2 border-amber-500 py-1 font-semibold'
                : 'hover:text-white py-1'
            }`}
          >
            Roles & Features
          </button>
          <button
            onClick={() => onSelectTab('demo_video')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'demo_video'
                ? 'text-white border-b-2 border-amber-500 py-1 font-semibold'
                : 'hover:text-white py-1'
            }`}
          >
            Demo Video
          </button>
          <button
            onClick={() => onSelectTab('setup_deployment')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'setup_deployment'
                ? 'text-white border-b-2 border-amber-500 py-1 font-semibold'
                : 'hover:text-white py-1'
            }`}
          >
            Setup & Deployment
          </button>
        </nav>

        {/* Zone 3: Primary Action & Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Active Role Selector dropdown */}
          <div className="relative flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5">
            <span className="text-slate-500 hidden sm:inline">Role:</span>
            <select
              value={currentRole}
              onChange={(e) => onChangeRole(e.target.value as UserRole)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer font-medium"
            >
              <option value="customer" className="bg-slate-900 text-slate-200">Customer</option>
              <option value="theatre_manager" className="bg-slate-900 text-slate-200">Theatre Manager</option>
              <option value="super_admin" className="bg-slate-900 text-slate-200">Super Admin</option>
            </select>
          </div>

          {/* Bookings / Tickets Access */}
          <button
            onClick={onOpenBookings}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <Ticket className="w-3.5 h-3.5 text-amber-400" />
            <span>My Tickets</span>
            {bookingsCount > 0 && (
              <span className="text-[11px] font-mono font-semibold text-amber-400 ml-0.5">
                ({bookingsCount})
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Secondary Scrollable Sub-bar */}
      <div className="lg:hidden flex items-center gap-4 px-4 py-2 overflow-x-auto border-t border-slate-800/80 text-xs text-slate-400 bg-slate-950/60 no-scrollbar">
        <button
          onClick={() => onSelectTab('movies')}
          className={`whitespace-nowrap shrink-0 ${activeTab === 'movies' ? 'text-amber-400 font-semibold' : ''}`}
        >
          Cinema
        </button>
        <button
          onClick={() => onSelectTab('architecture')}
          className={`whitespace-nowrap shrink-0 ${activeTab === 'architecture' ? 'text-amber-400 font-semibold' : ''}`}
        >
          Architecture
        </button>
        <button
          onClick={() => onSelectTab('er_diagram')}
          className={`whitespace-nowrap shrink-0 ${activeTab === 'er_diagram' ? 'text-amber-400 font-semibold' : ''}`}
        >
          ER Diagram
        </button>
        <button
          onClick={() => onSelectTab('mvc_pattern')}
          className={`whitespace-nowrap shrink-0 ${activeTab === 'mvc_pattern' ? 'text-amber-400 font-semibold' : ''}`}
        >
          MVC Pattern
        </button>
        <button
          onClick={() => onSelectTab('user_flow')}
          className={`whitespace-nowrap shrink-0 ${activeTab === 'user_flow' ? 'text-amber-400 font-semibold' : ''}`}
        >
          User Flow
        </button>
        <button
          onClick={() => onSelectTab('roles')}
          className={`whitespace-nowrap shrink-0 ${activeTab === 'roles' ? 'text-amber-400 font-semibold' : ''}`}
        >
          Roles
        </button>
        <button
          onClick={() => onSelectTab('demo_video')}
          className={`whitespace-nowrap shrink-0 ${activeTab === 'demo_video' ? 'text-amber-400 font-semibold' : ''}`}
        >
          Demo Video
        </button>
        <button
          onClick={() => onSelectTab('setup_deployment')}
          className={`whitespace-nowrap shrink-0 ${activeTab === 'setup_deployment' ? 'text-amber-400 font-semibold' : ''}`}
        >
          Setup
        </button>
      </div>
    </header>
  );
};
