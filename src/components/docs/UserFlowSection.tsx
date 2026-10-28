import React, { useState, useEffect } from 'react';
import { USER_FLOW_STEPS, UserFlowStep } from '../../data/documentationData';
import { ArrowRight, Play, Pause, RotateCcw, CheckCircle, Database, Server, Smartphone, Check } from 'lucide-react';

export const UserFlowSection: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAutoPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= USER_FLOW_STEPS.length - 1) {
            setIsAutoPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const activeStep = USER_FLOW_STEPS[currentStepIndex];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
          <span>USER EXPERIENCE & TRANSACTION LIFECYCLE</span>
          <span aria-hidden="true">·</span>
          <span>END-TO-END TICKETING & SEAT RESERVATION FLOW</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          User Journey & System State Flow
        </h2>
        <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          The moviegoer flow is orchestrated to maximize speed and clarity while maintaining strict data consistency across concurrent users. Step through each phase below to observe the client events, backend endpoints, and MongoDB transactional mutations triggered in real time.
        </p>
      </div>

      {/* Interactive Simulator Controller */}
      <div className="p-6 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase text-slate-400">
              Interactive Step Simulator
            </span>
            <span className="text-xs font-mono text-amber-400 font-bold">
              Step {currentStepIndex + 1} of {USER_FLOW_STEPS.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              {isAutoPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pause Journey</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>Auto-Play Journey</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentStepIndex(0);
              }}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
              title="Reset to Step 1"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {USER_FLOW_STEPS.map((step, idx) => {
            const isCurrent = idx === currentStepIndex;
            const isCompleted = idx < currentStepIndex;
            return (
              <button
                key={step.stepNumber}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentStepIndex(idx);
                }}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  isCurrent
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/20'
                    : isCompleted
                    ? 'bg-slate-900 border-slate-700 text-slate-200'
                    : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span>Phase {step.stepNumber}</span>
                  {isCompleted && <Check className="w-3 h-3 text-emerald-400" />}
                </div>
                <div className="text-xs truncate font-medium">{step.phase}</div>
              </button>
            );
          })}
        </div>

        {/* Active Step Deep-Dive Breakdown */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono uppercase text-amber-400 font-semibold">
                Phase {activeStep.stepNumber}: {activeStep.phase}
              </span>
              <h3 className="text-lg font-bold text-white mt-1">{activeStep.action}</h3>
            </div>
            <span className="text-xs font-mono bg-slate-950 px-3 py-1 rounded-full text-slate-400 border border-slate-800 self-start sm:self-auto">
              System Invariant: Verified
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Client Event */}
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
                <Smartphone className="w-4 h-4" />
                <span>Client React Event</span>
              </div>
              <p className="text-xs text-slate-300 font-medium">{activeStep.clientEvent}</p>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                UI Feedback: {activeStep.uiState}
              </div>
            </div>

            {/* Backend Endpoint */}
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                <Server className="w-4 h-4" />
                <span>Express API Route</span>
              </div>
              <code className="text-xs font-mono text-amber-300 bg-slate-900 px-2 py-1 rounded block overflow-x-auto">
                {activeStep.backendEndpoint}
              </code>
              <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                Authenticated via Bearer JWT with optimistic concurrency validation.
              </p>
            </div>

            {/* Database Transaction */}
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <Database className="w-4 h-4" />
                <span>MongoDB Persistence</span>
              </div>
              <p className="text-xs text-slate-300 font-medium">{activeStep.databaseChange}</p>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                Guaranteed by MongoDB multi-document ACID transactions.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
