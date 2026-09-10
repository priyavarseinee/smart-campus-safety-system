import React from 'react';
import { Cloud, X, ShieldCheck, Database, Lock, Server, Bell, Cpu, HardDrive } from 'lucide-react';

export default function CloudSummaryModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const cloudServices = [
    {
      title: "Cloud Database (Cloud Firestore)",
      icon: Database,
      badge: "Firestore NoSQL",
      desc: "Serves as the central real-time database storing incidents, status logs, location metrics, and user profiles. Uses Firestore web sockets for instantaneous sub-second dashboard updates."
    },
    {
      title: "Authentication as a Service (Firebase Auth)",
      icon: Lock,
      badge: "Auth SDK",
      desc: "Manages encrypted user authentication and token verification across Student, Security Guard, and Administrator roles with automated password hashing and session tokens."
    },
    {
      title: "Cloud Evidence Storage (Firebase Storage)",
      icon: HardDrive,
      badge: "Cloud Storage",
      desc: "Stores user-uploaded photo and live video evidence files with automatic MIME-type verification, CDN edge hosting, and public metadata linking."
    },
    {
      title: "Serverless Compute (Firebase Cloud Functions)",
      icon: Server,
      badge: "Node.js Serverless",
      desc: "Triggers automated backend event handlers upon incident creation to auto-calculate priority, route alerts to nearest guard, and log timestamps."
    },
    {
      title: "Cloud Push Notifications (Firebase FCM)",
      icon: Bell,
      badge: "FCM Push",
      desc: "Delivers immediate high-priority push notifications to security personnel devices whenever a Medical, Fire, or Security Threat incident is reported."
    },
    {
      title: "Cloud Security Rules & App Check",
      icon: ShieldCheck,
      badge: "App Check & Rules",
      desc: "Enforces strict row-level authorization rules (e.g. students can only create and read own incidents; guards can update status to Approved/Declined; admins manage users)."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0e1126] border border-purple-500/40 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border-b border-purple-500/20 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-600/30 text-purple-300 rounded-xl border border-purple-500/40">
              <Cloud size={26} />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                Cloud Computing Integration Architecture
              </h2>
              <p className="text-xs text-purple-300/80">Google Firebase Cloud Infrastructure & Viva Technical Summary</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          <div className="p-4 bg-purple-950/30 border border-purple-500/20 rounded-xl text-xs leading-relaxed text-purple-200">
            <span className="font-bold text-purple-300 text-sm block mb-1">☁️ Academic & Viva Explanation:</span>
            This Smart Campus Safety System leverages Google Firebase serverless cloud architecture. Rather than relying on traditional monolithic servers, all backend workflows—from sub-second incident dispatch to proof storage and access control—are handled natively by managed cloud microservices.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cloudServices.map((svc, i) => {
              const IconComp = svc.icon;
              return (
                <div key={i} className="p-4 bg-[#070814] border border-slate-800 hover:border-purple-500/40 rounded-xl transition duration-200 group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-purple-400 group-hover:text-purple-300">
                      <IconComp size={18} />
                      <h4 className="font-bold text-sm text-white">{svc.title}</h4>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 font-mono">
                      {svc.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{svc.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Cloud Quotas & Viva Specs */}
          <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Cpu size={16} className="text-cyan-400" /> Free Quotas & Infrastructure Performance Metrics
            </h4>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-[#070814] rounded-lg border border-slate-800">
                <p className="text-[11px] text-slate-400">Firestore Storage</p>
                <p className="text-sm font-bold text-emerald-400">1 GiB / 50K Reads/Day</p>
              </div>
              <div className="p-3 bg-[#070814] rounded-lg border border-slate-800">
                <p className="text-[11px] text-slate-400">Cloud Storage CDN</p>
                <p className="text-sm font-bold text-cyan-400">5 GiB No-Cost</p>
              </div>
              <div className="p-3 bg-[#070814] rounded-lg border border-slate-800">
                <p className="text-[11px] text-slate-400">Real-time Latency</p>
                <p className="text-sm font-bold text-purple-400">&lt; 180 ms Latency</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-purple-600/30"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
}
