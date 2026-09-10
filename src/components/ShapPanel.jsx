import React from 'react';
import { ArrowUpRight, ArrowDownRight, Info, ShieldCheck, Sparkles, Sliders } from 'lucide-react';

export default function ShapPanel({ shapData, modelType }) {
  // Sort features by absolute contribution magnitude
  const sortedFeatures = [...shapData].sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
  const maxAbsValue = Math.max(...sortedFeatures.map((f) => Math.abs(f.value)), 0.01);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              SHAP Explainability Panel
            </h3>
          </div>
          <p className="text-xs text-slate-500">Feature Contribution & Attribution Analysis</p>
        </div>
        <span className="px-2.5 py-1 bg-cyan-950 text-cyan-400 border border-cyan-800/60 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
          {modelType === 'xgboost' ? 'XGBoost TreeSHAP' : 'Heuristic SHAP Proxies'}
        </span>
      </div>

      {/* Feature Contributions List */}
      <div className="space-y-3 mb-4">
        {sortedFeatures.map((item, idx) => {
          const isPositive = item.value >= 0;
          const barWidth = Math.min((Math.abs(item.value) / maxAbsValue) * 100, 100);

          return (
            <div key={idx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
              <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  {isPositive ? (
                    <ArrowUpRight className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  )}
                  {item.featureName}
                </span>
                <span
                  className={`font-bold ${isPositive ? 'text-rose-400' : 'text-emerald-400'}`}
                >
                  {isPositive ? `+${item.value.toFixed(2)}` : item.value.toFixed(2)} SHAP
                </span>
              </div>

              {/* Bar visualization */}
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden flex items-center border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isPositive
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500 shadow-sm shadow-rose-500/40'
                      : 'bg-gradient-to-r from-teal-500 to-emerald-500 shadow-sm shadow-emerald-500/40'
                  }`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>{item.description}</span>
                <span>{item.impactPercent}% Weight</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Context / Non-Diagnostic Safety Boundary */}
      <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-[11px] text-slate-400 space-y-1">
        <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
          <Info className="w-3.5 h-3.5" /> Explainability Context
        </div>
        <p>
          SHAP values quantify how much each biometric or self-report feature pushes the stress score above (+) or below (-) baseline. These represent associations, not clinical diagnoses.
        </p>
      </div>
    </div>
  );
}
