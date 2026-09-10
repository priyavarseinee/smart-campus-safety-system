import React, { useState } from 'react';
import { HardDrive, Wifi, Radio, Terminal, CheckCircle, AlertCircle, RefreshCw, Zap, ShieldCheck } from 'lucide-react';

export default function HardwareConnectBar({
  isConnected,
  onConnect,
  onDisconnect,
  lastPacket,
  baudRate,
  setBaudRate,
  portName
}) {
  const [showTerminal, setShowTerminal] = useState(false);

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-4 mb-6 shadow-xl relative overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left Status & Title */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white transition ${
            isConnected ? 'bg-emerald-600 shadow-lg shadow-emerald-500/30' : 'bg-indigo-900/60 border border-indigo-500/40'
          }`}>
            <HardDrive className={`w-5 h-5 ${isConnected ? 'animate-pulse' : ''}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Physical Hardware Interface
              </h3>
              <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-bold border ${
                isConnected
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40'
                  : 'bg-amber-950 text-amber-400 border-amber-500/40'
              }`}>
                {isConnected ? 'Hardware Linked' : 'Awaiting Connection'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Web Serial / Bluetooth Bridge for ESP32 & Arduino (BP, HR, GSR, Temp Sensors)
            </p>
          </div>
        </div>

        {/* Center Controls & Connection Trigger */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono">
            <span className="text-slate-500">Baud:</span>
            <select
              value={baudRate}
              onChange={(e) => setBaudRate(Number(e.target.value))}
              disabled={isConnected}
              className="bg-transparent text-cyan-300 font-semibold focus:outline-none cursor-pointer"
            >
              <option value={115200} className="bg-slate-900">115200 Baud</option>
              <option value={9600} className="bg-slate-900">9600 Baud</option>
              <option value={57600} className="bg-slate-900">57600 Baud</option>
            </select>
          </div>

          {!isConnected ? (
            <button
              onClick={onConnect}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition"
            >
              <Wifi className="w-4 h-4" /> Pair ESP32 / Arduino Device
            </button>
          ) : (
            <button
              onClick={onDisconnect}
              className="px-4 py-2 bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-semibold text-xs rounded-xl flex items-center gap-2 transition"
            >
              <AlertCircle className="w-4 h-4" /> Disconnect Hardware ({portName || 'COM4'})
            </button>
          )}

          <button
            onClick={() => setShowTerminal(!showTerminal)}
            className={`px-3 py-2 border rounded-xl text-xs font-mono flex items-center gap-1.5 transition ${
              showTerminal ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50' : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            {showTerminal ? 'Hide Serial Stream' : 'Inspect JSON Stream'}
          </button>
        </div>
      </div>

      {/* Embedded Serial Stream Inspector */}
      {showTerminal && (
        <div className="mt-4 pt-3 border-t border-slate-800 animate-fadeIn">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" /> Web Serial Data Receiver: 1.0 Hz Monotonic Stream
            </span>
            <span>Device ID: MW-ESP32-S3-BP</span>
          </div>
          <pre className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-32 shadow-inner">
            {JSON.stringify(lastPacket, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
