import React, { useState } from 'react';
import { ROLES_RESPONSIBILITIES, RoleDetail } from '../../data/documentationData';
import { UserRole } from '../../types';
import { Users, ShieldCheck, Check, Sparkles, Zap, Lock, QrCode, TrendingUp, MonitorPlay } from 'lucide-react';

interface RolesAndFeaturesSectionProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
}

export const RolesAndFeaturesSection: React.FC<RolesAndFeaturesSectionProps> = ({
  currentRole,
  onChangeRole
}) => {
  const [selectedRoleIndex, setSelectedRoleIndex] = useState<number>(0);

  const roleMap: Record<number, UserRole> = {
    0: 'customer',
    1: 'theatre_manager',
    2: 'super_admin'
  };

  const activeRoleData = ROLES_RESPONSIBILITIES[selectedRoleIndex];

  return (
    <div className="space-y-16">
      {/* SECTION 1: ROLES & RESPONSIBILITIES */}
      <section className="space-y-8">
        <div className="border-b border-slate-800 pb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
            <span>ACCESS CONTROL & SECURITY</span>
            <span aria-hidden="true">·</span>
            <span>ROLE-BASED ACCESS CONTROL (RBAC) GOVERNANCE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Roles and Responsibilities Matrix
          </h2>
          <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
            The IMovies platform enforces fine-grained authorization policies. System privileges are categorized into three distinct roles to segregate customer booking workflows from theatre floor operations and global administrative controls.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {ROLES_RESPONSIBILITIES.map((r, idx) => {
            const isSelected = selectedRoleIndex === idx;
            return (
              <button
                key={r.role}
                onClick={() => {
                  setSelectedRoleIndex(idx);
                  onChangeRole(roleMap[idx]);
                }}
                className={`p-5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-slate-900 border-amber-500 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase bg-slate-800 px-2 py-0.5 rounded text-amber-400 border border-slate-700">
                    {r.badge}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                      Active In App
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-white">{r.role}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{r.description}</p>
              </button>
            );
          })}
        </div>

        {/* Selected Role Detailed Specifications */}
        <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-mono uppercase text-amber-400 font-semibold">
                Authorization Scope
              </span>
              <h4 className="text-lg font-bold text-white mt-0.5">
                {activeRoleData.role} Privileges
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Representative Persona: {activeRoleData.samplePersona}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-slate-500 block">
                Permitted System Operations
              </span>
              <ul className="space-y-2 text-xs text-slate-300">
                {activeRoleData.permissions.map((perm, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="p-0.5 bg-emerald-500/10 text-emerald-400 rounded mt-0.5">
                      <Check className="w-3 h-3" />
                    </span>
                    <span>{perm}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-mono uppercase text-slate-500 font-semibold">
                Client Interface Capabilities
              </span>
              <h4 className="text-lg font-bold text-white mt-0.5">
                Exposed Views & Component Access
              </h4>
            </div>

            <div className="space-y-2.5">
              {activeRoleData.uiCapabilities.map((cap, i) => (
                <div
                  key={i}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 flex items-center justify-between"
                >
                  <span>{cap}</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/40">
                    Granted
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-slate-300">
              <span className="font-semibold text-amber-400 block mb-1">
                Live Simulator Active:
              </span>
              You can experience the app with this role right now by selecting showtimes in the Cinema Movies tab or switching roles in the header.
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: SYSTEM FEATURES DEEP-DIVE */}
      <section className="space-y-8 pt-8 border-t border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
            <span>PLATFORM CAPABILITIES</span>
            <span aria-hidden="true">·</span>
            <span>ENGINEERED FOR SCALE, CONCURRENCY & RELIABILITY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Key Architectural Features
          </h2>
          <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
            Every feature in The IMovies platform is backed by production-grade software engineering patterns, from distributed mutex locks to cryptographic ticket signing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 w-fit">
              <Lock className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-base font-bold text-white">
              Real-Time Concurrency & Mutex Locks
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Eliminates seat collision race conditions via atomic MongoDB sessions and Redis TTL keys. Seats are temporarily locked for 5 minutes during customer review, auto-releasing if checkout is abandoned.
            </p>
            <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-500">
              Tech: MongoDB Session Transactions · Redis TTL
            </div>
          </div>

          {/* Feature 2 */}
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 w-fit">
              <MonitorPlay className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-base font-bold text-white">
              Dynamic Tiered Seat Matrix
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Interactive SVG curved cinema auditorium projection rendering VIP Recliners, Premium Club, and Standard seats with real-time price calculations and live occupancy updates.
            </p>
            <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-500">
              Tech: React 19 Virtualized Seating · Dynamic Multipliers
            </div>
          </div>

          {/* Feature 3 */}
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 w-fit">
              <QrCode className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-base font-bold text-white">
              Cryptographic QR Boarding Passes
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every confirmed ticket generates an immutable digital boarding pass with an HMAC-SHA256 signed QR code token for instant gate turnstile verification and offline validation.
            </p>
            <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-500">
              Tech: Node.js Crypto · Base64 QR Matrix Renderer
            </div>
          </div>

          {/* Feature 4 */}
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 w-fit">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-base font-bold text-white">
              JWT Authentication & RBAC
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Stateless JWT token verification with encrypted role claims. Protects sensitive management routes and ensures customers can only cancel or inspect their own bookings.
            </p>
            <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-500">
              Tech: jsonwebtoken · Express Middleware Pipeline
            </div>
          </div>

          {/* Feature 5 */}
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 w-fit">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-base font-bold text-white">
              Gourmet Concessions Engine
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pre-ordering basket for artisan popcorn, craft beverages, and VIP snack bundles with real-time tax computation (8%) and express pickup coordination.
            </p>
            <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-500">
              Tech: Embedded Mongoose Subdocuments · Stock Sync
            </div>
          </div>

          {/* Feature 6 */}
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 w-fit">
              <TrendingUp className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-base font-bold text-white">
              Box-Office Telemetry & Occupancy
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time reporting dashboards for cinema managers showing screening occupancy percentage, gross ticket revenue, concession sales, and seat maintenance status.
            </p>
            <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-500">
              Tech: MongoDB Aggregation Pipeline · Group By Screen
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
