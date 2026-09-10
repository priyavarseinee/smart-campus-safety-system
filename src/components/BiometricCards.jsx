import React from 'react';
import { Heart, Activity, Thermometer, Droplets, TrendingUp, TrendingDown, Minus, ShieldCheck, Zap } from 'lucide-react';

export default function BiometricCards({ telemetry, isHardwareMode }) {
  const { hr, bpSystolic, bpDiastolic, gsr, temp, signalQuality } = telemetry;

  // Baseline deviations
  const hrDelta = (hr - 70).toFixed(1);
  const gsrDelta = (gsr - 1.5).toFixed(2);
  const tempDelta = (temp - 33.8).toFixed(1);
  const mapValue = Math.round((bpSystolic + 2 * bpDiastolic) / 3);

  const getDeltaBadge = (delta, unit = '') => {
    const num = parseFloat(delta);
    if (num > 0) {
      return (
        <span className="text-rose-400 font-mono text-xs flex items-center gap-0.5">
          <TrendingUp className="w-3 h-3" /> +{delta}{unit}
        </span>
      );
    }
    if (num < 0) {
      return (
        <span className="text-cyan-400 font-mono text-xs flex items-center gap-0.5">
          <TrendingDown className="w-3 h-3" /> {delta}{unit}
        </span>
      );
    }
    return (
      <span className="text-slate-400 font-mono text-xs flex items-center gap-0.5">
        <Minus className="w-3 h-3" /> 0.0{unit}
      </span>
    );
  };

  const getQualityMeter = (qualityVal) => {
    const pct = Math.round(qualityVal * 100);
    let color = 'bg-emerald-500';
    if (pct < 80) color = 'bg-amber-500';
    if (pct < 60) color = 'bg-rose-500';

    return (
      <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden flex items-center border border-slate-800">
        <div className={`h-full ${color} transition-all duration-500 rounded-full`} style={{ width: `${pct}%` }} />
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Heart Rate (PPG) Card */}
      <div className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-4 transition shadow-lg relative group">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
              <Heart className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Heart Rate</h3>
              <p className="text-[10px] text-slate-500 font-mono">MAX30102 PPG Waveform</p>
            </div>
          </div>
          {getDeltaBadge(hrDelta, ' bpm')}
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <div className="text-3xl font-extrabold font-mono text-white tracking-tight">
            {hr.toFixed(1)} <span className="text-sm font-semibold text-slate-400">BPM</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-mono">Ref Baseline</span>
            <span className="text-xs font-mono font-bold text-slate-300">70.0 BPM</span>
          </div>
        </div>

        {/* Signal Quality Bar */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> PPG Signal Quality
            </span>
            <span className="text-cyan-300 font-bold">{Math.round(signalQuality.ppg * 100)}%</span>
          </div>
          {getQualityMeter(signalQuality.ppg)}
        </div>
      </div>

      {/* 2. Blood Pressure Card */}
      <div className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-4 transition shadow-lg relative group">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-indigo-950/80 text-indigo-400 border border-indigo-800/50">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Blood Pressure</h3>
              <p className="text-[10px] text-slate-500 font-mono">Systolic / Diastolic</p>
            </div>
          </div>
          <span className="text-xs font-mono text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800/60">
            MAP: {mapValue} mmHg
          </span>
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <div className="text-3xl font-extrabold font-mono text-white tracking-tight">
            {Math.round(bpSystolic)}<span className="text-indigo-400 text-xl font-bold">/</span>{Math.round(bpDiastolic)}
            <span className="text-sm font-semibold text-slate-400 ml-1">mmHg</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-mono">Normal Ref</span>
            <span className="text-xs font-mono font-bold text-slate-300">120/80</span>
          </div>
        </div>

        {/* Signal Quality Bar */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> BP Pulse Wave Quality
            </span>
            <span className="text-indigo-300 font-bold">{Math.round(signalQuality.bp * 100)}%</span>
          </div>
          {getQualityMeter(signalQuality.bp)}
        </div>
      </div>

      {/* 3. Galvanic Skin Response (GSR) Card */}
      <div className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-4 transition shadow-lg relative group">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-800/50">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">GSR (Skin Conductance)</h3>
              <p className="text-[10px] text-slate-500 font-mono">Electrodermal Arousal</p>
            </div>
          </div>
          {getDeltaBadge(gsrDelta, ' µS')}
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <div className="text-3xl font-extrabold font-mono text-white tracking-tight">
            {gsr.toFixed(2)} <span className="text-sm font-semibold text-slate-400">µS</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-mono">Ref Baseline</span>
            <span className="text-xs font-mono font-bold text-slate-300">1.50 µS</span>
          </div>
        </div>

        {/* Signal Quality Bar */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> GSR Electrode Quality
            </span>
            <span className="text-amber-300 font-bold">{Math.round(signalQuality.gsr * 100)}%</span>
          </div>
          {getQualityMeter(signalQuality.gsr)}
        </div>
      </div>

      {/* 4. Skin Temperature Card */}
      <div className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-4 transition shadow-lg relative group">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
              <Thermometer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Skin Temperature</h3>
              <p className="text-[10px] text-slate-500 font-mono">Peripheral Thermal Drift</p>
            </div>
          </div>
          {getDeltaBadge(tempDelta, ' °C')}
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <div className="text-3xl font-extrabold font-mono text-white tracking-tight">
            {temp.toFixed(2)} <span className="text-sm font-semibold text-slate-400">°C</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-mono">Ref Baseline</span>
            <span className="text-xs font-mono font-bold text-slate-300">33.80 °C</span>
          </div>
        </div>

        {/* Signal Quality Bar */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Thermal Sensor Quality
            </span>
            <span className="text-emerald-300 font-bold">{Math.round(signalQuality.temp * 100)}%</span>
          </div>
          {getQualityMeter(signalQuality.temp)}
        </div>
      </div>
    </div>
  );
}
