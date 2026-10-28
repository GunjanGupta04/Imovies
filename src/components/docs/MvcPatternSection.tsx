import React, { useState } from 'react';
import { MVC_COMPONENTS, MvcComponent } from '../../data/documentationData';
import { Layers, Code2, FileCode, Check, Copy, ShieldCheck, Database, Layout } from 'lucide-react';

export const MvcPatternSection: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<MvcComponent>(MVC_COMPONENTS[0]);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeComponent.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
          <span>SOFTWARE DESIGN PATTERNS</span>
          <span aria-hidden="true">·</span>
          <span>MODEL-VIEW-CONTROLLER IN EXPRESS.JS & REACT</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          MVC Pattern Implementation
        </h2>
        <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          The IMovies codebase strictly enforces the Model-View-Controller design pattern. This separation decouples MongoDB database models from the Express business logic controllers and React client views, ensuring high testability, modularity, and rapid feature iteration.
        </p>
      </div>

      {/* Conceptual MVC Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <Database className="w-4 h-4" />
            <span>MODEL</span>
          </div>
          <h4 className="text-sm font-bold text-white">Mongoose Schemas</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Encapsulates MongoDB documents, data types, validators, lifecycle hooks, and compound indexes.
          </p>
        </div>

        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <Layout className="w-4 h-4" />
            <span>VIEW</span>
          </div>
          <h4 className="text-sm font-bold text-white">React Client SPA</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Renders interactive UI state, curved auditorium seat maps, live countdowns, and captures user mutations.
          </p>
        </div>

        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <Code2 className="w-4 h-4" />
            <span>CONTROLLER</span>
          </div>
          <h4 className="text-sm font-bold text-white">Express Handlers</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Coordinates business workflows: mutex seat locking, subtotal math, payment processing, and error handling.
          </p>
        </div>

        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <ShieldCheck className="w-4 h-4" />
            <span>ROUTES & GUARDS</span>
          </div>
          <h4 className="text-sm font-bold text-white">Security Middleware</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Enforces JWT token decoding, role-based access control (RBAC), and sanitizes inbound request parameters.
          </p>
        </div>
      </div>

      {/* Interactive Code Switcher & Inspector */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Component Tabs */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 bg-slate-950 px-4 py-2 gap-2">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {MVC_COMPONENTS.map((comp) => {
              const isSelected = activeComponent.id === comp.id;
              return (
                <button
                  key={comp.id}
                  onClick={() => setActiveComponent(comp)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    isSelected
                      ? 'bg-slate-800 text-amber-400 border border-slate-700'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>{comp.filename}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleCopyCode}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md text-xs font-mono flex items-center gap-1.5 transition-colors shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* Component Description Band */}
        <div className="p-5 bg-slate-900/60 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase text-amber-400 font-semibold block">
              {activeComponent.title}
            </span>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-2xl">
              {activeComponent.explanation}
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 self-start md:self-auto shrink-0">
            Pattern Role: <span className="text-slate-200">{activeComponent.id.toUpperCase()}</span>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 bg-[#080d14] overflow-x-auto">
          <pre className="font-mono text-xs text-slate-200 leading-relaxed">
            <code>{activeComponent.code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
