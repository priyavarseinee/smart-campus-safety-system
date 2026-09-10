import React, { useState } from 'react';
import { AlertTriangle, Info, CheckCircle2, ShieldAlert, ChevronDown, ChevronUp, Cpu, Calculator } from 'lucide-react';

export default function StressGauge({ score, alertState, modelType, formulaFactors }) {
  const [showFormula, setShowFormula] = useState(false);

  // Gauge calculations
  // Semi-circle arc: angle from -90 to +90 degrees (180 deg sweep)
  const radius = 80;
  const strokeWidth = 14;
  const normalizedScore = Math.min(Math.max(score, 0), 100);
  const strokeDasharray = Math.PI * radius;
  const strokeDashoffset = strokeDasharray - (strokeDasharray * normalizedScore) / 100;

  const getTheme = () => {
    if (alertState === 'High') {
      return {
        stroke: '#ef4444',
        text: 'text-rose-400',
        bg: 'bg-rose-950/60 border-rose-500/40',
        badge: 'bg-rose-600 text-white',
        label: 'Higher Concern',
        desc: 'Persistent elevated arousal & high self-report risk.'
      };
    }
    if (alertState === 'Moderate') {
      return {
        stroke: '#f59e0b',
        text: 'text-amber-400',
        bg: 'bg-amber-950/60 border-amber-500/40',
        badge: 'bg-amber-600 text-white',
        label: 'Moderate Pattern',
        desc: 'Elevated physiological markers detected.'
      };
    }
    return {
      stroke: '#10b981',
      text: 'text-emerald-400',
      bg: 'bg-emerald-950/60 border-emerald-500/40',
      badge: 'bg-emerald-600 text-white',
      label: 'Low Concern',
      desc: 'Physiological signals within calibrated baseline.'
    };
  };

  const theme = getTheme();

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            Stress Index Arc Gauge
          </h3>
          <p className="text-xs text-slate-500">Real-Time Risk Calculation (0–100 Clamped)</p>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide shadow ${theme.badge}`}>
          {theme.label}
        </span>
      </div>

      {/* Arc Gauge Visualizer */}
      <div className="relative flex flex-col items-center justify-center my-2">
        <svg className="w-56 h-32 overflow-visible">
          {/* Background Arc */}
          <path
            d="M 28,110 A 80,80 0 0,1 196,110"
            fill="none"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Color Gradient Track Glow */}
          <path
            d="M 28,110 A 80,80 0 0,1 196,110"
            fill="none"
            stroke={theme.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
            style={{
              filter: `drop-shadow(0px 0px 8px ${theme.stroke})`
            }}
          />
        </svg>

        {/* Center Score & Label */}
        <div className="absolute top-12 text-center">
          <span className="text-5xl font-black font-mono tracking-tight text-white block drop-shadow-md">
            {Math.round(normalizedScore)}
          </span>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block -mt-1">
            Out of 100
          </span>
        </div>
      </div>

      {/* Description & Model Info */}
      <div className="mt-2 text-center border-t border-slate-800/80 pt-4">
        <p className="text-xs text-slate-300 font-medium mb-3">{theme.desc}</p>

        {/* Formula Accordion Toggle */}
        <button
          onClick={() => setShowFormula(!showFormula)}
          className="w-full px-3 py-2 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-xl text-xs font-mono text-cyan-300 flex items-center justify-between transition"
        >
          <span className="flex items-center gap-1.5 font-semibold">
            <Calculator className="w-3.5 h-3.5 text-cyan-400" />
            {modelType === 'xgboost' ? 'Kaggle XGBoost Inference Formula' : 'Technical Doc Exact Scoring Formula'}
          </span>
          {showFormula ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showFormula && (
          <div className="mt-3 p-3 bg-slate-950 border border-slate-800 rounded-xl text-left text-[11px] font-mono text-slate-300 space-y-1.5 animate-fadeIn">
            <p className="text-cyan-400 font-semibold border-b border-slate-800 pb-1">
              Exact Technical Formula (Page 8 Doc):
            </p>
            <p className="text-slate-400">
              <code className="text-emerald-400">score = clamp(20 + ΔHR×1.0 + ΔGSR×8 + |ΔTemp|×10 + SelfReport, 0, 100)</code>
            </p>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1 text-slate-400 text-[10px]">
              <div>Base score: <strong className="text-white">+20.0</strong></div>
              <div>HR Dev ({formulaFactors?.hrDev}): <strong className="text-cyan-300">+{(formulaFactors?.hrDev * 1.0).toFixed(1)}</strong></div>
              <div>GSR ({formulaFactors?.gsrDev}): <strong className="text-amber-300">+{(formulaFactors?.gsrDev * 8.0).toFixed(1)}</strong></div>
              <div>Temp Dev ({formulaFactors?.tempDev}): <strong className="text-emerald-300">+{(formulaFactors?.tempDev * 10.0).toFixed(1)}</strong></div>
              <div>Self-Report Weight: <strong className="text-purple-300">+{(formulaFactors?.selfReportWeight || 0).toFixed(1)}</strong></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
