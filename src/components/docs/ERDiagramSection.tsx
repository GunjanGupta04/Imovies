import React, { useState } from 'react';
import { ER_COLLECTIONS, ERCollection } from '../../data/documentationData';
import { Database, Key, Link2, Copy, Check, Table, Code2, ArrowRight } from 'lucide-react';

export const ERDiagramSection: React.FC = () => {
  const [selectedCollection, setSelectedCollection] = useState<ERCollection>(ER_COLLECTIONS[4]); // Bookings as default
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(selectedCollection.sampleDocument);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
          <span>DATA MODELING</span>
          <span aria-hidden="true">·</span>
          <span>MONGODB ATLAS DOCUMENT SCHEMAS & RELATIONSHIPS</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Entity-Relationship (ER) Architecture
        </h2>
        <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          The IMovies data model strikes a balance between relational document normalization and high-speed read performance. Reference ObjectIds establish parent-child associations while embedded subdocuments allow atomic updates on seat allocations and concession orders.
        </p>
      </div>

      {/* Relational Entity Connection Graph */}
      <div className="p-6 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Schema Entities & Cross-Collection Relationships
          </span>
          <span className="text-xs font-mono text-slate-400">
            6 Normalized Collections
          </span>
        </div>

        {/* ER Visual Connector Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ER_COLLECTIONS.map((col) => {
            const isSelected = selectedCollection.name === col.name;
            return (
              <div
                key={col.name}
                onClick={() => setSelectedCollection(col)}
                className={`p-5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-900 border-amber-500 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold text-white font-mono">{col.name}</h3>
                  </div>
                  <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-400 border border-slate-700">
                    {col.fields.length} Fields
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {col.description}
                </p>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-500 truncate">
                    {col.indexes.length} Indexes Defined
                  </span>
                  <span className={`font-semibold ${isSelected ? 'text-amber-400' : 'text-slate-400'}`}>
                    Inspect Schema →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Relational Flow Legend */}
        <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl text-xs space-y-2">
          <span className="font-mono text-slate-400 font-semibold block mb-1">
            Foreign Key References & Cardinalities:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-slate-300 font-mono text-[11px]">
            <div className="p-2 bg-slate-950 rounded border border-slate-800">
              <span className="text-amber-400 block font-bold">Users (1) → (N) Bookings</span>
              <span className="text-slate-500 text-[10px]">via userId (ObjectId)</span>
            </div>
            <div className="p-2 bg-slate-950 rounded border border-slate-800">
              <span className="text-amber-400 block font-bold">Movies (1) → (N) Showtimes</span>
              <span className="text-slate-500 text-[10px]">via movieId (ObjectId)</span>
            </div>
            <div className="p-2 bg-slate-950 rounded border border-slate-800">
              <span className="text-amber-400 block font-bold">Theatres (1) → (N) Showtimes</span>
              <span className="text-slate-500 text-[10px]">via theatreId (ObjectId)</span>
            </div>
            <div className="p-2 bg-slate-950 rounded border border-slate-800">
              <span className="text-amber-400 block font-bold">Showtimes (1) → (N) SeatLocks</span>
              <span className="text-slate-500 text-[10px]">via showtimeId (TTL Index)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Collection Schema Inspector */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden space-y-6 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <Database className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white font-mono">{selectedCollection.name}</h3>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  MongoDB Collection
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{selectedCollection.description}</p>
            </div>
          </div>

          <button
            onClick={handleCopyJson}
            className="self-start sm:self-auto px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-mono flex items-center gap-2 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied Document</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Sample JSON</span>
              </>
            )}
          </button>
        </div>

        {/* Fields Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                <th className="pb-3 font-semibold">Field Name</th>
                <th className="pb-3 font-semibold">Data Type</th>
                <th className="pb-3 font-semibold">Constraints / Indexing</th>
                <th className="pb-3 font-semibold">Functional Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {selectedCollection.fields.map((field) => (
                <tr key={field.name} className="hover:bg-slate-850/40">
                  <td className="py-2.5 text-amber-300 font-semibold">{field.name}</td>
                  <td className="py-2.5 text-slate-300">{field.type}</td>
                  <td className="py-2.5 text-slate-400 font-sans">{field.constraints}</td>
                  <td className="py-2.5 text-slate-400 font-sans">{field.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Index Strategy & Sample JSON Side-by-Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Configured MongoDB Indexes
            </h4>
            <div className="space-y-1.5">
              {selectedCollection.indexes.map((idx, i) => (
                <div
                  key={i}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 flex items-center justify-between"
                >
                  <span>db.{selectedCollection.name.toLowerCase()}.createIndex({idx})</span>
                  <Key className="w-3.5 h-3.5 text-slate-500" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Sample Document Preview
              </h4>
              <span className="text-[10px] font-mono text-slate-500">BSON / JSON</span>
            </div>
            <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-48">
              {selectedCollection.sampleDocument}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
