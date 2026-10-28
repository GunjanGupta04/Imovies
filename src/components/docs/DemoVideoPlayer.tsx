import React, { useState, useEffect, useRef } from 'react';
import { DEMO_VIDEO_CHAPTERS, VideoChapter } from '../../data/documentationData';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize2, SkipForward, Sparkles, ExternalLink, Film } from 'lucide-react';

interface DemoVideoPlayerProps {
  onNavigateToFeature: (featureKey: string) => void;
}

export const DemoVideoPlayer: React.FC<DemoVideoPlayerProps> = ({ onNavigateToFeature }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0); // in seconds
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);

  const totalDuration = 270; // 4 minutes 30 seconds

  // Video progress animation timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1 * playbackSpeed;
          if (next >= totalDuration) {
            setIsPlaying(false);
            return totalDuration;
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  // Sync active chapter with current time
  useEffect(() => {
    for (let i = DEMO_VIDEO_CHAPTERS.length - 1; i >= 0; i--) {
      if (currentTime >= DEMO_VIDEO_CHAPTERS[i].seconds) {
        setActiveChapterIndex(i);
        break;
      }
    }
  }, [currentTime]);

  const activeChapter = DEMO_VIDEO_CHAPTERS[activeChapterIndex] || DEMO_VIDEO_CHAPTERS[0];

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
  };

  const handleSelectChapter = (chapter: VideoChapter, index: number) => {
    setCurrentTime(chapter.seconds);
    setActiveChapterIndex(index);
    setIsPlaying(true);
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
          <span>INTERACTIVE PRODUCT WALKTHROUGH</span>
          <span aria-hidden="true">·</span>
          <span>SYSTEM DEMONSTRATION & ARCHITECTURAL VIDEO TOUR</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          The IMovies Platform Demo Walkthrough
        </h2>
        <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          Watch this synchronized video tour highlighting the end-to-end customer booking journey, real-time MongoDB concurrency locks, Express controller pipelines, and theatre manager operations.
        </p>
      </div>

      {/* Main Video Player Container */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Video Screen Frame */}
        <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center">
          {/* Synchronized Screen Capture Image */}
          <img
            src={activeChapter.previewImage}
            alt={activeChapter.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter brightness-90 transition-all duration-700"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40" />

          {/* Active Overlay Header & Badge */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs z-10">
            <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/80 text-white font-mono">
              <Film className="w-3.5 h-3.5 text-amber-400" />
              <span>THE IMOVIES · DEMO TOUR (4K 60FPS)</span>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/80 text-amber-400 font-mono text-[11px]">
              Chapter {activeChapterIndex + 1}/{DEMO_VIDEO_CHAPTERS.length}
            </div>
          </div>

          {/* Center Play Button Overlay when paused */}
          {!isPlaying && (
            <button
              onClick={() => setIsPlaying(true)}
              className="absolute z-20 p-5 rounded-full bg-amber-500/90 hover:bg-amber-400 text-slate-950 shadow-2xl hover:scale-110 transition-transform"
            >
              <Play className="w-8 h-8 fill-slate-950 ml-1" />
            </button>
          )}

          {/* Bottom On-Screen Caption & Feature Jump */}
          <div className="absolute bottom-16 left-6 right-6 z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="max-w-2xl bg-black/70 backdrop-blur-md p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
                {activeChapter.timestamp} · {activeChapter.title}
              </span>
              <p className="text-white text-xs sm:text-sm font-medium mt-1 leading-snug">
                {activeChapter.caption}
              </p>
            </div>

            <button
              onClick={() => onNavigateToFeature(activeChapter.featureKey)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg shadow-lg flex items-center gap-1.5 shrink-0 transition-colors self-start sm:self-auto"
            >
              <span>Try This Live in App</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Custom Video Controls Bar */}
          <div className="absolute bottom-0 inset-x-0 h-14 bg-gradient-to-t from-black via-black/90 to-transparent px-4 sm:px-6 flex items-center justify-between gap-4 z-20">
            {/* Play/Pause & Time */}
            <div className="flex items-center gap-3 text-xs font-mono text-white">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 hover:text-amber-400 transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              </button>

              <button
                onClick={() => {
                  setCurrentTime(0);
                  setIsPlaying(false);
                }}
                className="p-1.5 hover:text-amber-400 transition-colors"
                title="Restart"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <span className="tabular-nums">
                {formatSeconds(currentTime)} / {formatSeconds(totalDuration)}
              </span>
            </div>

            {/* Scrub Slider */}
            <div className="flex-1 max-w-xl mx-2">
              <input
                type="range"
                min={0}
                max={totalDuration}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Speed, Volume, Fullscreen */}
            <div className="flex items-center gap-3 text-xs text-white">
              {/* Playback speed selector */}
              <div className="flex items-center gap-1 text-[11px] font-mono bg-slate-900 border border-slate-700 px-2 py-0.5 rounded">
                <button
                  onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 1.5 : playbackSpeed === 1.5 ? 2 : 1)}
                  className="hover:text-amber-400 font-semibold"
                >
                  {playbackSpeed}x
                </button>
              </div>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 hover:text-amber-400 transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Video Chapters List & Voiceover Transcript */}
        <div className="p-6 bg-slate-900/90 border-t border-slate-800 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chapter Selector */}
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold block">
              Timestamped Chapters
            </span>

            <div className="space-y-2">
              {DEMO_VIDEO_CHAPTERS.map((chap, i) => {
                const isSelected = activeChapterIndex === i;
                return (
                  <button
                    key={chap.id}
                    onClick={() => handleSelectChapter(chap, i)}
                    className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-center justify-between text-xs ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/80 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-amber-400 font-semibold">{chap.timestamp}</span>
                      <span className="truncate font-medium">{chap.title}</span>
                    </div>
                    {isSelected && (
                      <span className="text-[10px] font-mono text-amber-400 shrink-0">Playing</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Synchronized Voiceover Transcript */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Synchronized Narration Transcript
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/40">
                Audio Stream: Active
              </span>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                <span>Presenter: System Lead Engineer</span>
                <span aria-hidden="true">·</span>
                <span>Segment: {activeChapter.title}</span>
              </div>

              <blockquote className="text-xs sm:text-sm text-slate-200 italic leading-relaxed border-l-2 border-amber-500 pl-3">
                "{activeChapter.transcript}"
              </blockquote>

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>IMovies Architecture Tour · Recorded for v1.0.0 Release</span>
                <button
                  onClick={() => onNavigateToFeature(activeChapter.featureKey)}
                  className="text-amber-400 hover:underline flex items-center gap-1"
                >
                  <span>Open Interactive Demo</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
