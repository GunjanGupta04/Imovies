import React, { useState } from 'react';
import { ARCHITECTURE_NODES, ArchitectureNode } from '../../data/documentationData';
import { Server, Database, Layers, ShieldCheck, Zap, Globe, Cpu, RefreshCw, Activity, ArrowRight } from 'lucide-react';

export const ArchitectureSection: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode>(ARCHITECTURE_NODES[0]);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
          <span>SYSTEM ARCHITECTURE</span>
          <span aria-hidden="true">·</span>
          <span>CLIENT-SERVER MONOLITH & DISTRIBUTED DATA LAYER</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          The IMovies Technical Architecture
        </h2>
        <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          IMovies is engineered around an asynchronous, high-concurrency client-server architecture. An Express.js application server orchestrates request pipelines, while MongoDB provides persistent document storage and a high-throughput Redis layer handles transient 5-minute seat locks to eliminate race conditions.
        </p>
      </div>

      {/* Interactive Architecture Flow Diagram */}
      <div className="p-6 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Interactive Topology Explorer (Click any tier to inspect)
          </span>
          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Client-Server Pipeline
          </span>
        </div>

        {/* Multi-Tier Visual Map */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {ARCHITECTURE_NODES.map((node) => {
            const isSelected = selectedNode.id === node.id;
            return (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`p-4 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between h-36 ${
                  isSelected
                    ? 'bg-slate-900 border-amber-500 shadow-lg shadow-amber-500/10 -translate-y-1'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 block truncate">
                    {node.layer}
                  </span>
                  <h4 className="text-xs font-bold text-white mt-1 line-clamp-2">{node.name}</h4>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400 truncate">{node.protocols[0]}</span>
                  {isSelected && <span className="text-amber-400 font-bold">Active</span>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Tier Deep-Dive Details */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-amber-400 tracking-wider">
                  {selectedNode.layer}
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">{selectedNode.name}</h3>
              </div>
              <span className="text-xs font-mono bg-slate-800 px-2.5 py-1 rounded text-slate-300 border border-slate-700">
                {selectedNode.tech}
              </span>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">{selectedNode.description}</p>

            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                Core Architectural Responsibilities
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {selectedNode.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">›</span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4 space-y-4 text-xs h-fit">
            <div>
              <span className="text-slate-500 block font-mono">Communication Protocols</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {selectedNode.protocols.map((p) => (
                  <span key={p} className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono text-[11px]">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <span className="text-slate-500 block font-mono">Performance SLA / Metrics</span>
              <span className="text-emerald-400 font-mono font-medium block mt-1">
                {selectedNode.specs}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Concurrency & Seat Locking Data Flow Sequence */}
      <section className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white">
            Distributed Concurrency & Seat Lock Flow Sequence
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            How The IMovies prevents double-booking when hundreds of moviegoers simultaneously select premiere seats.
          </p>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                <span>01. Seat Selection</span>
              </div>
              <h4 className="text-sm font-semibold text-white">Client Mutex Request</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                User taps seats A1, A2. Client fires <code className="text-amber-300">POST /api/bookings/lock-seats</code> with auth bearer header and seat coordinates.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                <span>02. Atomic Lock</span>
              </div>
              <h4 className="text-sm font-semibold text-white">MongoDB / Redis TTL Check</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Backend initiates MongoDB multi-document session transaction. Verifies that no other active lock exists. Inserts 5-min TTL lock doc.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                <span>03. WebSocket Broadcast</span>
              </div>
              <h4 className="text-sm font-semibold text-white">Real-Time Sync</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                SSE / WebSocket bus emits <code className="text-amber-300">SEAT_LOCKED</code> event to all other clients connected to the same showtime, disabling those buttons.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                <span>04. ACID Finalize</span>
              </div>
              <h4 className="text-sm font-semibold text-white">Checkout or Auto-Release</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upon Stripe payment confirmation, seats become permanently reserved in Bookings collection. If user leaves, TTL index automatically cleans locks.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
