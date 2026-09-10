import React, { useState, useEffect, useRef } from 'react';
import { Activity, Heart, Droplets, Thermometer, Radio, Eye } from 'lucide-react';

export default function SignalChart({ history, isPaused }) {
  const [activeTab, setActiveTab] = useState('hr'); // 'hr' | 'bp' | 'gsr' | 'temp'
  const canvasRef = useRef(null);

  // Tab config
  const tabConfig = {
    hr: {
      label: 'Heart Rate (PPG)',
      unit: 'BPM',
      color: '#06b6d4',
      baseline: 70,
      minY: 50,
      maxY: 120,
      icon: Heart
    },
    bp: {
      label: 'Blood Pressure',
      unit: 'mmHg',
      color: '#818cf8',
      baseline: 120,
      minY: 70,
      maxY: 160,
      icon: Activity
    },
    gsr: {
      label: 'GSR (Skin Conductance)',
      unit: 'µS',
      color: '#f59e0b',
      baseline: 1.5,
      minY: 0.5,
      maxY: 6.0,
      icon: Droplets
    },
    temp: {
      label: 'Skin Temperature',
      unit: '°C',
      color: '#10b981',
      baseline: 33.8,
      minY: 30.0,
      maxY: 38.0,
      icon: Thermometer
    }
  };

  const currentTab = tabConfig[activeTab];

  // Draw chart on canvas whenever history or activeTab updates
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw Grid Lines & Baseline
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;

    // Horizontal Grid Lines
    const gridRows = 5;
    for (let i = 1; i < gridRows; i++) {
      const y = (height / gridRows) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Dashed Reference Baseline Line
    const baselineY =
      height -
      ((currentTab.baseline - currentTab.minY) / (currentTab.maxY - currentTab.minY)) * height;

    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(0, baselineY);
    ctx.lineTo(width, baselineY);
    ctx.stroke();
    ctx.restore();

    // Baseline Label
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillText(`Baseline: ${currentTab.baseline} ${currentTab.unit}`, 10, baselineY - 4);

    if (!history || history.length < 2) return;

    // Extract values based on active tab
    const points = history.map((item) => {
      if (activeTab === 'hr') return item.hr;
      if (activeTab === 'bp') return item.bpSystolic;
      if (activeTab === 'gsr') return item.gsr;
      return item.temp;
    });

    // Calculate (x, y) coordinates
    const stepX = width / Math.max(points.length - 1, 1);
    const coords = points.map((val, idx) => {
      const clampedVal = Math.min(Math.max(val, currentTab.minY), currentTab.maxY);
      const y = height - ((clampedVal - currentTab.minY) / (currentTab.maxY - currentTab.minY)) * height;
      return { x: idx * stepX, y };
    });

    // Fill Gradient under line
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, `${currentTab.color}40`);
    gradient.addColorStop(1, `${currentTab.color}00`);

    ctx.beginPath();
    ctx.moveTo(coords[0].x, height);
    coords.forEach((pt) => ctx.lineTo(pt.x, pt.y));
    ctx.lineTo(coords[coords.length - 1].x, height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw Main Trace Line with Neon Glow
    ctx.save();
    ctx.shadowColor = currentTab.color;
    ctx.shadowBlur = 10;
    ctx.strokeStyle = currentTab.color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    coords.forEach((pt, i) => {
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.stroke();
    ctx.restore();

    // Draw Glowing Tip Point on Latest Sample
    const latestPt = coords[coords.length - 1];
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(latestPt.x, latestPt.y, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = currentTab.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(latestPt.x, latestPt.y, 7, 0, Math.PI * 2);
    ctx.stroke();
  }, [history, activeTab, currentTab]);

  // Compute stats
  const getStats = () => {
    if (!history || history.length === 0) return { min: 0, max: 0, avg: 0 };
    const vals = history.map((item) => {
      if (activeTab === 'hr') return item.hr;
      if (activeTab === 'bp') return item.bpSystolic;
      if (activeTab === 'gsr') return item.gsr;
      return item.temp;
    });
    const min = Math.min(...vals).toFixed(1);
    const max = Math.max(...vals).toFixed(1);
    const avg = (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
    return { min, max, avg };
  };

  const stats = getStats();

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
      {/* Header & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" /> Live Telemetry Trace Chart
          </h3>
          <p className="text-xs text-slate-500">60-Second Continuous Physiological Window</p>
        </div>

        {/* Tab Buttons */}
        <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1 text-xs">
          {Object.entries(tabConfig).map(([key, config]) => {
            const Icon = config.icon;
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition ${
                  isActive
                    ? 'bg-slate-800 text-white shadow border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                style={{ color: isActive ? config.color : undefined }}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{key.toUpperCase()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Canvas Container */}
      <div className="relative bg-slate-950 border border-slate-800/80 rounded-xl p-2 mb-3">
        <canvas
          ref={canvasRef}
          width={650}
          height={200}
          className="w-full h-48 block"
        />
        {isPaused && (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs rounded-xl flex items-center justify-center text-xs font-mono text-amber-300 font-bold uppercase tracking-widest">
            Chart Paused
          </div>
        )}
      </div>

      {/* Footer Stats Summary */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono border-t border-slate-800/80 pt-3">
        <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-500 block">WINDOW MIN</span>
          <span className="text-white font-bold">{stats.min} {currentTab.unit}</span>
        </div>
        <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-500 block">WINDOW AVG</span>
          <span className="text-cyan-400 font-bold">{stats.avg} {currentTab.unit}</span>
        </div>
        <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-500 block">WINDOW MAX</span>
          <span className="text-white font-bold">{stats.max} {currentTab.unit}</span>
        </div>
      </div>
    </div>
  );
}
