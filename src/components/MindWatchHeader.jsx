import React from 'react';
import { Activity, Cpu, HardDrive, Pause, Play, AlertTriangle, Wind, ClipboardList, ShieldAlert, CheckCircle2, Zap } from 'lucide-react';

export default function MindWatchHeader({
  mode,
  onToggleMode,
  modelType,
  onToggleModel,
  isPaused,
  onTogglePause,
  uptime,
  stressScore,
  alertState,
  onOpenBreathing,
  onOpenClinical,
  hardwareConnected
}) {
  const formatUptime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[#070814]/90 border-b border-slate-800/80 shadow-2xl">
      {/* Top Banner for High/Elevated Stress Alert */}
      {alertState === 'High' && (
        <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-red-950 border-b border-rose-500/40 px-4 py-2 text-xs md:text-sm text-rose-200 flex flex-wrap items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-2 font-medium">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
            <span>
              <strong className="text-white">ELEVATED STRESS DETECTED (Score: {stressScore}/100)</strong> — Physiological arousal & self-report thresholds exceeded.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenBreathing}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-md shadow flex items-center gap-1.5 transition text-xs"
            >
              <Wind className="w-3.5 h-3.5" /> Start 4-7-8 Breathing
            </button>
            <button
              onClick={onOpenClinical}
              className="px-3 py-1 bg-rose-900/60 hover:bg-rose-800/80 text-rose-100 border border-rose-500/40 rounded-md transition text-xs flex items-center gap-1.5"
            >
              <ClipboardList className="w-3.5 h-3.5" /> Clinical Questionnaire
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 shadow-lg shadow-cyan-500/20 text-white">
            <Activity className="w-6 h-6 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#070814]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                MIND<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">WATCH</span>
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                AI MVP v2.0
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">AI-Assisted Stress & Physiological Wellbeing Monitoring</p>
          </div>
        </div>

        {/* Status Indicators & Mode Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Dashboard Mode Selector */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-1 flex items-center text-xs font-semibold">
            <button
              onClick={() => onToggleMode('simulated')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition ${
                mode === 'simulated'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" /> ⚡ Web Simulation
            </button>
            <button
              onClick={() => onToggleMode('hardware')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition ${
                mode === 'hardware'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5" /> 🔌 Hardware Dashboard
            </button>
          </div>

          {/* Model Engine Selector */}
          <button
            onClick={onToggleModel}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg text-xs font-medium text-slate-300 hover:text-white flex items-center gap-2 transition shadow-sm"
            title="Click to switch ML model source"
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              Engine: <strong className="text-cyan-300">{modelType === 'xgboost' ? 'Trained Kaggle XGBoost (97.4%)' : 'Doc Formula Heuristic'}</strong>
            </span>
          </button>

          {/* Pause / Resume Control */}
          <button
            onClick={onTogglePause}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition ${
              isPaused
                ? 'bg-amber-950/60 border-amber-500/50 text-amber-300 hover:bg-amber-900/60'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 fill-current text-amber-400" /> : <Pause className="w-3.5 h-3.5 text-slate-400" />}
            {isPaused ? 'RESUMED' : 'PAUSE'}
          </button>

          {/* Uptime / Connection Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded-lg text-xs font-mono text-slate-400">
            <span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-ping'}`} />
            <span>{isPaused ? 'PAUSED' : `LIVE ${formatUptime(uptime)}`}</span>
          </div>

          {/* Quick Action Modals Trigger */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenBreathing}
              className="p-2 bg-slate-900 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/40 rounded-lg text-cyan-400 transition"
              title="Open 4-7-8 Breathing Modal"
            >
              <Wind className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenClinical}
              className="p-2 bg-slate-900 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500/40 rounded-lg text-indigo-400 transition"
              title="Open In-Depth Clinical Evaluation"
            >
              <ClipboardList className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
