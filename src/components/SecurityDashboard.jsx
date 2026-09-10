import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, Clock, MapPin, Phone, 
  X, Filter, LogOut, ShieldAlert, Award, FileSpreadsheet, Play, Check, ChevronRight, User, PhoneCall, QrCode, Smartphone, AlertOctagon, Ban, Users, Search, ArrowRight
} from 'lucide-react';
import { getIncidents, updateIncidentStatus, getSOSLogs, verifySOSIncident, getStoredStudents, saveStoredStudents, syncCloudIncidents, syncCloudStudents } from '../services/firebaseConfig';
import { CATEGORY_PROGRESS_UPDATES, INCIDENT_CATEGORIES } from '../services/mockData';

export default function SecurityDashboard({ user, onLogout }) {
  const [incidents, setIncidents] = useState([]);
  const [sosLogs, setSosLogs] = useState([]);
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState('INCIDENTS'); // 'INCIDENTS', 'SOS_LOGS', 'PENALTIES'
  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL', 'REPORTED', 'RESOLVED'
  const [sosFilter, setSosFilter] = useState('ALL'); // 'ALL', 'PENDING', 'GENUINE', 'PRANK'
  const [studentSearch, setStudentSearch] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [selectedStudentHistory, setSelectedStudentHistory] = useState(null);
  const [expandedEvidenceId, setExpandedEvidenceId] = useState(null);
  const [previewStepMap, setPreviewStepMap] = useState({});

  useEffect(() => {
    loadAllData();
    const interval = setInterval(loadAllData, 1500); // 1.5s Rapid Sync
    return () => clearInterval(interval);
  }, []);

  const loadAllData = () => {
    setIncidents(getIncidents());
    setSosLogs(getSOSLogs());
    setStudents(getStoredStudents());
    syncCloudIncidents().then(() => {
      setIncidents(getIncidents());
    });
    syncCloudStudents().then(() => {
      setStudents(getStoredStudents());
    });
  };

  const handleAdvanceStep = (incident, targetStepIndex) => {
    const stepsList = incident.updatesList || CATEGORY_PROGRESS_UPDATES[incident.type] || CATEGORY_PROGRESS_UPDATES.other;
    const noteText = stepsList[targetStepIndex] || `Step ${targetStepIndex + 1} progress updated.`;
    
    // Status changes to RESOLVED when case is completed on Step 4
    const isFinalStep = targetStepIndex === 3 && incident.currentStepIndex === 3;
    const newStatus = isFinalStep ? 'RESOLVED' : 'SECURITY APPROVED';

    updateIncidentStatus(incident.id, newStatus, {
      currentStepIndex: targetStepIndex,
      note: noteText,
      assignedTo: user.name
    });

    loadAllData();
  };

  const handleAccept = (incident) => {
    updateIncidentStatus(incident.id, 'SECURITY APPROVED', {
      currentStepIndex: 0,
      note: 'Incident accepted as genuine emergency. Security officer dispatched & 4-step progress unlocked.',
      assignedTo: user.name
    });
    loadAllData();
  };

  const handleDecline = (incidentId) => {
    updateIncidentStatus(incidentId, 'DECLINED', {
      note: 'Incident report reviewed and declined by Security Officer.'
    });
    loadAllData();
  };

  const handleMarkPrank = (incident) => {
    const students = getStoredStudents();
    const sIdx = students.findIndex(s => s.regNo === incident.regNo);
    if (sIdx !== -1) {
      const student = students[sIdx];
      const newCount = (student.prankMarkCount || 0) + 1;
      student.prankMarkCount = newCount;
      if (newCount >= 4) {
        student.accountStatus = 'DETAINED / ACCESS BLOCKED';
        student.detentionStatus = 'Detained for 1 Year';
      }
      saveStoredStudents(students);
    }

    updateIncidentStatus(incident.id, 'DECLINED', {
      note: '⚠️ Verified Prank / False Incident Report. +1 Disciplinary Prank Mark added to student.'
    });
    loadAllData();
  };

  const handleVerifySOS = (sosLogId, verificationType) => {
    const res = verifySOSIncident(sosLogId, verificationType, user.name || 'Security Guard NNP');
    if (res.success) {
      loadAllData();
    }
  };

  const getHelplineForCategory = (type) => {
    const cat = INCIDENT_CATEGORIES.find(c => c.id === type);
    return cat ? cat.helpline : '+91 9442868933';
  };

  const cleanSearch = studentSearch.trim().toLowerCase();

  const filteredIncidents = incidents.filter(i => {
    const matchesFilter = activeFilter === 'ALL' || (activeFilter === 'REPORTED' && i.status !== 'RESOLVED') || (activeFilter === 'RESOLVED' && i.status === 'RESOLVED');
    const matchesQuery = !cleanSearch || 
      (i.reportedBy && i.reportedBy.toLowerCase().includes(cleanSearch)) || 
      (i.regNo && i.regNo.toLowerCase().includes(cleanSearch)) || 
      (i.id && i.id.toLowerCase().includes(cleanSearch)) ||
      (i.categoryLabel && i.categoryLabel.toLowerCase().includes(cleanSearch)) ||
      (i.location && i.location.toLowerCase().includes(cleanSearch));
    return matchesFilter && matchesQuery;
  });

  const filteredSosLogs = sosLogs.filter(l => {
    const matchesFilter = sosFilter === 'ALL' || (sosFilter === 'PENDING' && l.status === 'Pending Verification') || (sosFilter === 'GENUINE' && l.status === 'Genuine Emergency') || (sosFilter === 'PRANK' && l.status === 'Prank/False SOS');
    const matchesQuery = !cleanSearch || 
      (l.studentName && l.studentName.toLowerCase().includes(cleanSearch)) || 
      (l.regNo && l.regNo.toLowerCase().includes(cleanSearch)) || 
      (l.sosLogId && l.sosLogId.toLowerCase().includes(cleanSearch)) ||
      (l.phone && l.phone.includes(cleanSearch));
    return matchesFilter && matchesQuery;
  });

  const filteredStudents = students.filter(s => 
    !cleanSearch ||
    (s.name && s.name.toLowerCase().includes(cleanSearch)) || 
    (s.regNo && s.regNo.toLowerCase().includes(cleanSearch)) ||
    (s.phone && s.phone.includes(cleanSearch))
  );

  return (
    <div className="min-h-screen bg-[#070814] text-slate-100 pb-12 antialiased">
      {/* Top Header */}
      <header className="bg-[#0e1126]/90 border-b border-blue-500/20 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl text-white shadow-lg shadow-blue-600/30">
              <ShieldCheck size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-white text-base sm:text-lg tracking-tight">SECURITY CONTROL DESK</h1>
                <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded-full border border-blue-800 font-semibold hidden sm:inline-block">CHRIST UNIVERSITY KENGERI</span>
              </div>
              <p className="text-xs text-blue-300/80">Officer: {user.name} • Badge: {user.badgeNo || 'SEC-101'}</p>
            </div>
          </div>

          {/* Hotline Display */}
          <div className="flex items-center gap-3">
            <a
              href="tel:+918639527123"
              className="px-3.5 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40 rounded-full text-xs font-black flex items-center gap-1.5 shadow"
            >
              <PhoneCall size={14} className="text-rose-400 animate-pulse" /> Hotline: +91 8639527123
            </a>

            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl transition border border-transparent hover:border-rose-500/30"
              title="Sign Out"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pt-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="bg-[#0e1126] border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {[
              { id: 'INCIDENTS', label: 'Incident Response & Progress' },
              { id: 'SOS_LOGS', label: `Dedicated SOS Log (${sosLogs.length})` },
              { id: 'PENALTIES', label: `Student Prank Mark Penalty (${students.filter(s => s.prankMarkCount > 0).length})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-[#070814] text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400" />
              <input
                type="text"
                placeholder="Search logs, student, reg no..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full pl-9 pr-7 py-1.5 bg-[#070814] border border-blue-500/40 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-400"
              />
              {studentSearch && (
                <button onClick={() => setStudentSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  <X size={14} />
                </button>
              )}
            </div>
            <span className="text-xs font-mono text-blue-300 font-bold bg-blue-950 px-3 py-1 rounded-xl border border-blue-800 shrink-0">
              Officer Active: {user.name}
            </span>
          </div>
        </div>

        {/* TAB 1: INCIDENT RESPONSE & PROGRESS */}
        {activeTab === 'INCIDENTS' && (
          <div className="space-y-4">
            <div className="bg-[#0e1126] border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {[
                  { id: 'ALL', label: 'All Cases' },
                  { id: 'REPORTED', label: 'Pending Review' },
                  { id: 'RESOLVED', label: 'Resolved Cases' }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setActiveFilter(f.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      activeFilter === f.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-[#070814] text-slate-400 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <span className="text-xs text-slate-400 font-mono">{filteredIncidents.length} Incident Records</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredIncidents.map((inc) => {
                const isSOS = inc.isSOS || inc.categoryLabel === 'SOS QUICK EMERGENCY';
                const completedStepIndex = inc.currentStepIndex !== undefined ? Math.max(0, inc.currentStepIndex) : 0;
                const stepsList = inc.updatesList || CATEGORY_PROGRESS_UPDATES[inc.type] || CATEGORY_PROGRESS_UPDATES.other;
                const totalSteps = stepsList.length;
                const helplineNum = getHelplineForCategory(inc.type);

                // Precise 0 -> 1 -> 2 -> 3 Step Advancement & Resolution
                const isResolved = inc.status === 'RESOLVED' || completedStepIndex >= 3;
                const isDeclined = inc.status === 'DECLINED';
                const activePreviewStep = previewStepMap[inc.id] !== undefined ? previewStepMap[inc.id] : completedStepIndex;

                return (
                  <div
                    key={inc.id}
                    className="bg-[#0e1126] border border-slate-800 hover:border-blue-500/40 rounded-2xl p-5 shadow-lg space-y-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-mono text-blue-300 font-bold bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                          {inc.id}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          inc.priority === 'HIGH' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}>
                          {inc.priority} PRIORITY
                        </span>
                      </div>

                      <h4 className="font-bold text-white text-base">{inc.categoryLabel}</h4>
                      <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed">{inc.description}</p>

                      <div className="mt-3 flex items-center gap-1.5 text-xs text-purple-300 bg-[#070814] p-2.5 rounded-xl border border-slate-800">
                        <MapPin size={14} className="text-purple-400 shrink-0" />
                        <span className="truncate font-semibold">{inc.location}</span>
                      </div>

                      {/* Direct Click-to-Call Emergency Response Expert Button */}
                      <div className="mt-3">
                        <a
                          href={`tel:${helplineNum.replace(/\s+/g, '')}`}
                          className="w-full py-2 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow transition"
                        >
                          <Phone size={14} className="text-emerald-400 animate-pulse" />
                          📞 Call Emergency Expert ({helplineNum})
                        </a>
                      </div>

                      {/* Evidence Proof Toggle (ONLY if evidence exists) */}
                      {inc.evidenceUrl && (
                        <div className="mt-3">
                          <button
                            type="button"
                            onClick={() => setExpandedEvidenceId(expandedEvidenceId === inc.id ? null : inc.id)}
                            className="w-full py-1.5 bg-[#070814] hover:bg-slate-900 text-purple-300 border border-purple-500/30 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition"
                          >
                            📷 {expandedEvidenceId === inc.id ? 'Hide Evidence' : 'View Camera Proof'}
                          </button>
                          {expandedEvidenceId === inc.id && (
                            <div className="mt-2 p-2 bg-black rounded-xl border border-purple-500/40">
                              {inc.evidenceType === 'video' ? (
                                <video controls src={inc.evidenceUrl} className="rounded-lg w-full max-h-48 bg-black" />
                              ) : (
                                <img src={inc.evidenceUrl} alt="Evidence" className="rounded-lg w-full max-h-48 object-cover" />
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* SOS CALL CARD DISPLAY (NO 4-STEPS FOR SOS CALLS) */}
                      {isSOS ? (
                        <div className="mt-3 p-3.5 bg-rose-950/40 border border-rose-500/30 rounded-xl space-y-2 text-xs">
                          <div className="flex items-center justify-between font-bold text-rose-300">
                            <span className="flex items-center gap-1.5">
                              <AlertOctagon size={15} className="text-rose-400 animate-pulse" /> Quick SOS Emergency Call
                            </span>
                            <span className="font-mono text-[10px] bg-rose-900 px-2 py-0.5 rounded border border-rose-700">Direct Panic Alert</span>
                          </div>
                          <p className="text-slate-300 text-[11px]">
                            Registered Phone: <strong className="text-emerald-300">{inc.phone}</strong> • Go to <strong>Dedicated SOS Log</strong> tab to verify Genuine / Prank status.
                          </p>
                          <button
                            onClick={() => setActiveTab('SOS_LOGS')}
                            className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-extrabold rounded-lg text-xs shadow mt-1"
                          >
                            Go to Dedicated SOS Verification Desk ➔
                          </button>
                        </div>
                      ) : (
                        /* REGULAR INCIDENTS 2-PHASE WORKFLOW */
                        <div>
                          {/* PHASE 1: UNREVIEWED INCIDENT REPORT (3 DECISION OPTIONS) */}
                          {inc.status === 'REPORTED' && !isDeclined && !isResolved && (
                            <div className="mt-3 p-3.5 bg-purple-950/40 border border-purple-500/40 rounded-xl space-y-3">
                              <div className="flex items-center justify-between text-xs font-extrabold text-purple-200">
                                <span className="flex items-center gap-1.5">
                                  <ShieldAlert size={15} className="text-amber-400 animate-pulse" /> Initial Security Review Required
                                </span>
                                <span className="font-mono text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800 font-bold">
                                  UNVERIFIED
                                </span>
                              </div>

                              <p className="text-[11px] text-slate-300">
                                Select an initial decision to authorize or decline this report:
                              </p>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() => handleAccept(inc)}
                                  className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-[11px] shadow flex items-center justify-center gap-1.5 uppercase tracking-wider transition"
                                >
                                  <CheckCircle2 size={14} /> Accept (Genuine)
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDecline(inc.id)}
                                  className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-[11px] flex items-center justify-center gap-1.5 transition"
                                >
                                  <X size={14} /> Decline Report
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleMarkPrank(inc)}
                                  className="py-2.5 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-500/50 font-extrabold rounded-xl text-[11px] flex items-center justify-center gap-1.5 transition shadow"
                                >
                                  <AlertTriangle size={14} className="text-rose-400" /> Mark as Prank
                                </button>
                              </div>
                            </div>
                          )}

                          {/* PHASE 2: ACCEPTED / IN-PROGRESS INCIDENT REPORT (4-STEP PROGRESSION) */}
                          {inc.status !== 'REPORTED' && (
                            <div className="mt-3 p-3 bg-blue-950/30 border border-blue-500/30 rounded-xl space-y-2.5">
                              <div className="flex items-center justify-between text-[11px] font-bold text-blue-200">
                                <span>Sequential 4-Step Progress:</span>
                                <span className="font-mono text-purple-300">
                                  {isDeclined ? 'DECLINED' : `Step ${completedStepIndex + 1} of ${totalSteps}`}
                                </span>
                              </div>

                              <div className="grid grid-cols-4 gap-1">
                                {[0, 1, 2, 3].map((stepIdx) => {
                                  const isStepDone = isResolved || stepIdx <= completedStepIndex;
                                  const isPreviewing = stepIdx === activePreviewStep;
                                  return (
                                    <button
                                      key={stepIdx}
                                      type="button"
                                      onClick={() => setPreviewStepMap(prev => ({ ...prev, [inc.id]: stepIdx }))}
                                      className={`py-1.5 rounded text-[10px] font-bold transition border ${
                                        isResolved
                                          ? 'bg-emerald-600 text-white border-emerald-400 shadow'
                                          : isPreviewing
                                          ? 'bg-blue-600 text-white border-blue-400 shadow'
                                          : isStepDone
                                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                                          : 'bg-[#070814] text-slate-500 border-slate-800 hover:text-white'
                                      }`}
                                      title={stepsList[stepIdx]}
                                    >
                                      Step {stepIdx + 1}
                                    </button>
                                  );
                                })}
                              </div>

                              <p className="text-[11px] text-white font-medium italic pt-1 line-clamp-2">
                                "{isDeclined ? 'Incident report declined by Security Officer.' : stepsList[activePreviewStep] || stepsList[0]}"
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* DYNAMIC REVISED STEP ACTION BUTTON directly on Card for Regular Incidents */}
                      {!isSOS && inc.status !== 'REPORTED' && (
                        <div className="mt-3">
                          {!isDeclined && !isResolved && (
                            <button
                              type="button"
                              onClick={() => {
                                if (completedStepIndex < 3) {
                                  const nextStep = completedStepIndex + 1;
                                  handleAdvanceStep(inc, nextStep);
                                  setPreviewStepMap(prev => ({ ...prev, [inc.id]: nextStep }));
                                } else {
                                  handleAdvanceStep(inc, 3);
                                }
                              }}
                              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold rounded-xl shadow-lg flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition border border-blue-400/40"
                            >
                              {completedStepIndex === 0 && <>ADVANCE TO STEP 2 <ArrowRight size={15} /></>}
                              {completedStepIndex === 1 && <>ADVANCE TO STEP 3 <ArrowRight size={15} /></>}
                              {completedStepIndex === 2 && <>ADVANCE TO STEP 4 <ArrowRight size={15} /></>}
                              {completedStepIndex === 3 && <>COMPLETE & RESOLVE CASE <CheckCircle2 size={15} /></>}
                            </button>
                          )}

                          {isResolved && (
                            <div className="w-full py-2.5 bg-emerald-950 text-emerald-300 border border-emerald-500/50 rounded-xl text-xs font-black text-center flex items-center justify-center gap-2 shadow">
                              <CheckCircle2 size={16} className="text-emerald-400" /> ✓ Case Fully Resolved (4 of 4 Steps Completed)
                            </div>
                          )}

                          {isDeclined && (
                            <div className="w-full py-2.5 bg-rose-950 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-bold text-center">
                              ❌ Incident Report Declined
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-slate-400 font-mono">By {inc.reportedBy} ({inc.regNo})</span>
                      {!isSOS && !isDeclined && !isResolved && (
                        <button
                          onClick={() => handleDecline(inc.id)}
                          className="px-3 py-1 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40 rounded-lg text-[10px] font-bold"
                        >
                          Decline Report
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: DEDICATED SOS LOG MANAGEMENT & PRANK VERIFICATION */}
        {activeTab === 'SOS_LOGS' && (
          <div className="bg-[#0e1126] border border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <AlertOctagon className="text-rose-500" size={20} /> Dedicated SOS Call Log & Verification Desk
                </h3>
                <p className="text-xs text-slate-400">
                  Every SOS emergency call automatically retrieves registered student details (Name, Reg No, Class, Registered Phone) and logs an entry.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {[
                  { id: 'ALL', label: 'All SOS Logs' },
                  { id: 'PENDING', label: 'Pending Verification' },
                  { id: 'GENUINE', label: 'Genuine' },
                  { id: 'PRANK', label: 'Prank / False SOS' }
                ].map(sf => (
                  <button
                    key={sf.id}
                    onClick={() => setSosFilter(sf.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      sosFilter === sf.id
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'bg-[#070814] text-slate-400 hover:text-white'
                    }`}
                  >
                    {sf.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#070814] text-rose-300 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-3">SOS Log ID</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Reg No</th>
                    <th className="p-3">Class</th>
                    <th className="p-3">Registered Phone</th>
                    <th className="p-3">Date & Time</th>
                    <th className="p-3">Officer</th>
                    <th className="p-3">Verification Status</th>
                    <th className="p-3">Penalty Status</th>
                    <th className="p-3">Security Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {filteredSosLogs.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="p-8 text-center text-slate-500">
                        No SOS call logs matching selected filter.
                      </td>
                    </tr>
                  ) : (
                    filteredSosLogs.map((log) => (
                      <tr key={log.sosLogId} className="hover:bg-slate-900/50">
                        <td className="p-3 font-mono font-bold text-purple-300">{log.sosLogId}</td>
                        <td className="p-3 font-bold text-white">{log.studentName}</td>
                        <td className="p-3 font-mono text-purple-300">{log.regNo}</td>
                        <td className="p-3 font-semibold text-slate-300">{log.className}</td>
                        <td className="p-3 font-mono text-emerald-400">{log.phone}</td>
                        <td className="p-3 text-slate-400 font-mono text-[11px]">{log.date} {log.time}</td>
                        <td className="p-3 text-slate-300 text-[11px]">{log.securityPersonnel}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                            log.status === 'Genuine Emergency' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                            log.status === 'Prank/False SOS' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                            'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="p-3 text-xs font-semibold text-slate-300">
                          {log.penaltyStatus || 'None'}
                        </td>
                        <td className="p-3">
                          {!log.penaltyApplied ? (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleVerifySOS(log.sosLogId, 'Genuine')}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-extrabold text-[10px] shadow"
                              >
                                ✓ Mark Genuine
                              </button>
                              <button
                                onClick={() => handleVerifySOS(log.sosLogId, 'Prank')}
                                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-extrabold text-[10px] shadow"
                              >
                                ⚠️ Mark Prank SOS (+1 Mark)
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] font-mono text-slate-500 font-bold">✓ Verified</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: STUDENT PENALTY MANAGEMENT & DETENTION CONTROL */}
        {activeTab === 'PENALTIES' && (
          <div className="bg-[#0e1126] border border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Ban className="text-rose-500" size={20} /> Student Prank Mark Penalty & 4-Mark Detention Registry ({students.length})
                </h3>
                <p className="text-xs text-slate-400">
                  Strict 4-Mark Threshold: Every verified prank adds +1 mark. 4 Marks triggers automatic 1-Year Detention & website blocking.
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by student name or reg no..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#070814] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#070814] text-blue-300 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-3">Sl.No</th>
                    <th className="p-3">Reg No</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Class</th>
                    <th className="p-3">Registered Phone</th>
                    <th className="p-3">Official Email</th>
                    <th className="p-3">Prank Marks</th>
                    <th className="p-3">Account Status</th>
                    <th className="p-3">Detention Status</th>
                    <th className="p-3">Warning History</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {filteredStudents.map((s) => {
                    const marks = s.prankMarkCount || 0;
                    const isDetained = marks >= 4 || s.accountStatus === 'DETAINED / ACCESS BLOCKED';

                    return (
                      <tr key={s.regNo} className={`hover:bg-slate-900/50 ${isDetained ? 'bg-rose-950/20' : ''}`}>
                        <td className="p-3 font-mono text-slate-400">{s.slNo}</td>
                        <td className="p-3 font-mono font-bold text-purple-300">{s.regNo}</td>
                        <td className="p-3 font-bold text-white">{s.name}</td>
                        <td className="p-3 font-semibold text-slate-300">{s.className || '4BTAD - AI & DS'}</td>
                        <td className="p-3 font-mono text-emerald-400">{s.phone}</td>
                        <td className="p-3 text-slate-400 font-mono text-[11px] truncate max-w-[180px]">{s.email}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black font-mono ${
                            marks === 0 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                            marks === 1 ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                            marks === 2 ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                            marks === 3 ? 'bg-orange-950 text-orange-300 border border-orange-800 animate-pulse' :
                            'bg-rose-950 text-rose-300 border border-rose-600 animate-bounce'
                          }`}>
                            {marks}/4 Marks
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                            isDetained ? 'bg-rose-600 text-white' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}>
                            {isDetained ? 'DETAINED / ACCESS BLOCKED' : 'ACTIVE'}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-xs">
                          {isDetained ? (
                            <span className="text-rose-400 font-bold flex items-center gap-1">
                              <Ban size={13} /> Detained for 1 Year
                            </span>
                          ) : (
                            <span className="text-slate-400">Active Student</span>
                          )}
                        </td>
                        <td className="p-3">
                          {s.warningHistory && s.warningHistory.length > 0 ? (
                            <button
                              onClick={() => setSelectedStudentHistory(s)}
                              className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg text-[10px] font-bold"
                            >
                              View {s.warningHistory.length} Warning Logs
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-500">No Warnings</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* WARNING HISTORY MODAL */}
      {selectedStudentHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0e1126] border border-amber-500/40 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="text-amber-400" size={18} /> Warning Log: {selectedStudentHistory.name}
              </h3>
              <button onClick={() => setSelectedStudentHistory(null)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto">
              {selectedStudentHistory.warningHistory?.map((w, idx) => (
                <div key={idx} className="p-3 bg-[#070814] rounded-xl border border-amber-500/30 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-amber-300">
                    <span>Prank Mark #{w.markNumber} Issued</span>
                    <span className="font-mono text-[10px] text-slate-400">{w.date} {w.time}</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{w.reason}</p>
                  <p className="text-[10px] text-slate-500 font-mono">By Officer {w.issuedBy} • Incident: {w.incidentId}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedStudentHistory(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold"
              >
                Close Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0e1126] border border-rose-500/40 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-950 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto">
              <LogOut size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Confirm Logout</h3>
              <p className="text-xs text-slate-300 mt-1">Are you sure you want to sign out of Security Control Desk?</p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowLogoutConfirm(false); onLogout(); }}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs shadow-lg"
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
