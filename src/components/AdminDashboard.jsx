import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, AlertTriangle, ShieldCheck, TrendingUp, Search, 
  MapPin, CheckCircle2, XCircle, LogOut, ShieldAlert, Award, FileSpreadsheet, UserPlus, Clock, Flame, Stethoscope, Eye, UserX, Wrench, QrCode, Smartphone, AlertOctagon, Ban, X
} from 'lucide-react';
import { getIncidents, getStoredStudents, getSOSLogs } from '../services/firebaseConfig';
import { INCIDENT_CATEGORIES } from '../services/mockData';
import AddStudentModal from './AddStudentModal';

export default function AdminDashboard({ user, onLogout }) {
  const [incidents, setIncidents] = useState([]);
  const [students, setStudents] = useState([]);
  const [sosLogs, setSosLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('ANALYTICS'); // 'ANALYTICS', 'REGISTRY', 'AUDIT', 'SOS_LOGS', 'PENALTIES'
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [selectedWarningLog, setSelectedWarningLog] = useState(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    setIncidents(getIncidents());
    setStudents(getStoredStudents());
    setSosLogs(getSOSLogs());
  };

  const totalIncidents = incidents.length;
  const resolvedIncidents = incidents.filter(i => i.status === 'RESOLVED');
  const resolvedCount = resolvedIncidents.length;

  // Calculate Real-Time Average Resolution Time (in minutes)
  const calculateAverageResolutionTime = () => {
    if (resolvedIncidents.length === 0) return '4.2 Mins';
    let totalMinutes = 0;
    resolvedIncidents.forEach(inc => {
      if (inc.totalDurationMinutes) {
        totalMinutes += parseFloat(inc.totalDurationMinutes);
      } else {
        const start = new Date(inc.createdAt).getTime();
        const endItem = inc.timeline ? inc.timeline[inc.timeline.length - 1] : null;
        const end = endItem ? new Date(endItem.timestamp).getTime() : start + 300000;
        totalMinutes += Math.max(0.5, (end - start) / (1000 * 60));
      }
    });
    const avg = (totalMinutes / resolvedIncidents.length).toFixed(1);
    return `${avg} Mins`;
  };

  // Search Filter Helper across all fields
  const cleanQuery = searchQuery.trim().toLowerCase();
  const isMatch = (val) => val ? String(val).toLowerCase().includes(cleanQuery) : false;

  const filteredStudents = students.filter(s => 
    !cleanQuery || isMatch(s.name) || isMatch(s.regNo) || isMatch(s.email) || isMatch(s.phone) || isMatch(s.dept) || isMatch(s.className) || isMatch(s.accountStatus) || isMatch(s.detentionStatus)
  );

  const filteredSosLogs = sosLogs.filter(l => 
    !cleanQuery || isMatch(l.studentName) || isMatch(l.regNo) || isMatch(l.phone) || isMatch(l.sosLogId) || isMatch(l.incidentId) || isMatch(l.className) || isMatch(l.status) || isMatch(l.penaltyStatus) || isMatch(l.securityPersonnel)
  );

  const filteredIncidents = incidents.filter(i => 
    !cleanQuery || isMatch(i.id) || isMatch(i.categoryLabel) || isMatch(i.reportedBy) || isMatch(i.regNo) || isMatch(i.status) || isMatch(i.location) || isMatch(i.phone)
  );

  // Cases per Emergency Category Breakdown
  const categoryStats = INCIDENT_CATEGORIES.map(cat => {
    const count = incidents.filter(i => i.type === cat.id).length;
    return {
      ...cat,
      count
    };
  });

  // Cases per Campus Block Breakdown
  const locationStats = incidents.reduce((acc, inc) => {
    acc[inc.location] = (acc[inc.location] || 0) + 1;
    return acc;
  }, {});

  const sortedLocations = Object.entries(locationStats).sort((a, b) => b[1] - a[1]);

  return (
    <div className="min-h-screen bg-[#070814] text-slate-100 pb-12 antialiased">
      {/* Top Header */}
      <header className="bg-[#0e1126]/90 border-b border-purple-500/20 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-purple-600 to-amber-600 rounded-xl text-white shadow-lg shadow-purple-600/30">
              <Building2 size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-white text-lg tracking-tight">ADMINISTRATION PORTAL</h1>
                <span className="text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded-full border border-purple-800 font-semibold">CHRIST UNIVERSITY KENGERI</span>
              </div>
              <p className="text-xs text-purple-300/80">Campus Safety Analytics & Registry Control</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddStudentModal(true)}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition"
            >
              <UserPlus size={16} /> Add Student Access
            </button>

            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl transition border border-transparent hover:border-rose-500/30 flex items-center gap-1 text-xs font-semibold"
              title="Sign Out"
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pt-6 space-y-6">
        {/* KPI Counter Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 bg-[#0e1126] border border-purple-500/30 rounded-2xl shadow-lg">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Total Filed Incidents</span>
            <p className="text-3xl font-extrabold text-white mt-2">{totalIncidents}</p>
            <p className="text-[11px] text-purple-300/70 mt-1">Campus wide logs</p>
          </div>

          <div className="p-5 bg-[#0e1126] border border-rose-500/30 rounded-2xl shadow-lg">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">SOS Emergency Calls</span>
            <p className="text-3xl font-extrabold text-white mt-2">{sosLogs.length}</p>
            <p className="text-[11px] text-rose-300/70 mt-1">Auto-logged calls</p>
          </div>

          <div className="p-5 bg-[#0e1126] border border-amber-500/30 rounded-2xl shadow-lg">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Prank Marks Issued</span>
            <p className="text-3xl font-extrabold text-white mt-2">
              {students.reduce((sum, s) => sum + (s.prankMarkCount || 0), 0)}
            </p>
            <p className="text-[11px] text-amber-300/70 mt-1">Total marks in system</p>
          </div>

          <div className="p-5 bg-[#0e1126] border border-rose-600/40 rounded-2xl shadow-lg">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Detained Accounts</span>
            <p className="text-3xl font-extrabold text-white mt-2">
              {students.filter(s => (s.prankMarkCount || 0) >= 4 || s.accountStatus === 'DETAINED / ACCESS BLOCKED').length}
            </p>
            <p className="text-[11px] text-rose-400 mt-1 font-bold">1-Year Detention (Blocked)</p>
          </div>
        </div>

        {/* Tab Navigation & Search Bar */}
        <div className="bg-[#0e1126] border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'ANALYTICS', label: 'Safety Analytics & Metrics' },
              { id: 'REGISTRY', label: `Complete Student Dataset (${students.length})` },
              { id: 'SOS_LOGS', label: `Dedicated SOS Log (${sosLogs.length})` },
              { id: 'PENALTIES', label: 'Prank Mark & Detention Registry' },
              { id: 'AUDIT', label: 'Incident Audit Trail' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-[#070814] text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ACTIVE WORKING SEARCH INPUT BAR */}
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
            <input
              type="text"
              placeholder="Search logs, student name, reg no, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-[#070814] border border-purple-500/50 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-400 shadow"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                title="Clear Search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* LIVE SEARCH RESULTS DISPLAY PANEL WHEN QUERY IS ACTIVE */}
        {cleanQuery && (
          <div className="p-5 bg-[#0e1126] border-2 border-purple-500/60 rounded-2xl space-y-5 animate-fadeIn shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-500/30 pb-3">
              <span className="text-sm font-extrabold text-white flex items-center gap-2">
                <Search size={18} className="text-purple-400 animate-pulse" /> Live Search Results for: "<strong className="text-purple-300">{searchQuery}</strong>"
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-purple-300 bg-purple-950 px-3 py-1 rounded-xl border border-purple-700 font-bold">
                  {filteredStudents.length} Students | {filteredIncidents.length} Incidents | {filteredSosLogs.length} SOS Calls
                </span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold"
                >
                  Clear Search
                </button>
              </div>
            </div>

            {/* MATCHING STUDENTS */}
            {filteredStudents.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Users size={14} /> Matching Student Dataset ({filteredStudents.length})
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-[#070814] text-purple-300 uppercase font-mono text-[10px]">
                      <tr>
                        <th className="p-2">Reg No</th>
                        <th className="p-2">Name</th>
                        <th className="p-2">Class</th>
                        <th className="p-2">Phone</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Prank Marks</th>
                        <th className="p-2">Account Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-sans">
                      {filteredStudents.slice(0, 10).map((s) => (
                        <tr key={s.regNo} className="hover:bg-slate-900/50">
                          <td className="p-2 font-mono font-bold text-purple-300">{s.regNo}</td>
                          <td className="p-2 font-bold text-white">{s.name}</td>
                          <td className="p-2">{s.className || '4BTAD'}</td>
                          <td className="p-2 font-mono text-emerald-400">{s.phone}</td>
                          <td className="p-2 font-mono text-slate-400 text-[11px] truncate max-w-[180px]">{s.email}</td>
                          <td className="p-2 font-mono text-amber-300">{s.prankMarkCount || 0}/4 Marks</td>
                          <td className="p-2 font-bold text-emerald-400">{s.accountStatus || 'ACTIVE'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* MATCHING INCIDENTS */}
            {filteredIncidents.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FileSpreadsheet size={14} /> Matching Incident Reports ({filteredIncidents.length})
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-[#070814] text-blue-300 uppercase font-mono text-[10px]">
                      <tr>
                        <th className="p-2">ID</th>
                        <th className="p-2">Category</th>
                        <th className="p-2">Reported By</th>
                        <th className="p-2">Location</th>
                        <th className="p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-sans">
                      {filteredIncidents.slice(0, 10).map((inc) => (
                        <tr key={inc.id} className="hover:bg-slate-900/50">
                          <td className="p-2 font-mono font-bold text-purple-300">{inc.id}</td>
                          <td className="p-2 font-bold text-white">{inc.categoryLabel}</td>
                          <td className="p-2">{inc.reportedBy} ({inc.regNo})</td>
                          <td className="p-2 text-purple-300 font-semibold">{inc.location}</td>
                          <td className="p-2 font-bold text-amber-300">{inc.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* NO RESULTS AT ALL */}
            {filteredStudents.length === 0 && filteredIncidents.length === 0 && filteredSosLogs.length === 0 && (
              <div className="p-6 text-center text-slate-400 text-xs">
                No matching records found for "{searchQuery}". Try searching by Student Name, Register Number, Phone Number, or Incident ID.
              </div>
            )}
          </div>
        )}

        {/* TAB CONTENT: ANALYTICS */}
        {activeTab === 'ANALYTICS' && (
          <div className="space-y-6">
            {/* Number of Cases for Each Emergency Category Grid */}
            <div className="bg-[#0e1126] border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ShieldAlert className="text-purple-400" size={18} /> Number of Cases per Emergency Category
                  </h3>
                  <p className="text-xs text-slate-400">Total incidents filed across all emergency types</p>
                </div>
                <span className="text-xs text-purple-300 font-mono bg-purple-950 px-3 py-1 rounded-xl border border-purple-800 font-bold">
                  {totalIncidents} Total Logs
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 pt-2">
                {categoryStats.map(cat => (
                  <div key={cat.id} className="p-3.5 bg-[#070814] border border-slate-800/80 rounded-2xl space-y-2 text-center">
                    <span className="text-[11px] font-bold text-slate-300 block truncate">{cat.label}</span>
                    <p className="text-2xl font-black text-purple-300">{cat.count}</p>
                    <span className="text-[9px] text-slate-500 uppercase font-mono">{cat.priority} PRIORITY</span>
                  </div>
                ))}
              </div>
            </div>

            {/* High-Risk Campus Zone Concentration + Resolution SLA Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Total Cases in Each Campus Block */}
              <div className="bg-[#0e1126] border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <MapPin className="text-rose-400" size={18} /> Total Cases in Each Campus Block
                </h3>
                <p className="text-xs text-slate-400">High-risk incident concentration by Christ University block</p>

                <div className="space-y-3 pt-2">
                  {sortedLocations.length === 0 ? (
                    <p className="text-xs text-slate-500">No incident location data recorded yet.</p>
                  ) : (
                    sortedLocations.map(([loc, cnt], idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-300 truncate max-w-xs">{loc}</span>
                          <span className="text-purple-300 font-mono shrink-0">{cnt} Cases</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-rose-500 rounded-full"
                            style={{ width: `${Math.min(100, (cnt / Math.max(1, totalIncidents)) * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Resolution SLA & Response Performance */}
              <div className="bg-[#0e1126] border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="text-emerald-400" size={18} /> Resolution Performance & Time Metrics
                </h3>
                <p className="text-xs text-slate-400">Security dispatch efficiency & response SLA benchmarks</p>

                <div className="space-y-4 pt-2">
                  <div className="p-4 bg-[#070814] rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Average Time to Solve Cases</span>
                      <span className="text-cyan-400 font-bold font-mono text-sm">{calculateAverageResolutionTime()}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-500 rounded-full w-4/5" />
                    </div>
                  </div>

                  <div className="p-4 bg-[#070814] rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Resolution Completion Rate</span>
                      <span className="text-emerald-400 font-bold font-mono text-sm">
                        {totalIncidents ? Math.round((resolvedCount / totalIncidents) * 100) : 100}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${totalIncidents ? (resolvedCount / totalIncidents) * 100 : 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: COMPLETE STUDENT DATASET (57 STUDENTS) */}
        {activeTab === 'REGISTRY' && (
          <div className="bg-[#0e1126] border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="text-purple-400" size={18} /> Complete Official Student Dataset ({filteredStudents.length} / {students.length} Records)
              </h3>
              <button
                onClick={() => setShowAddStudentModal(true)}
                className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5"
              >
                <UserPlus size={14} /> Add New Student
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#070814] text-purple-300 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-3">Sl.No</th>
                    <th className="p-3">Reg No</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Class</th>
                    <th className="p-3">Registered Phone</th>
                    <th className="p-3">Official Mail-Id</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Default Password</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-500">
                        No students matching search query "{searchQuery}".
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s) => (
                      <tr key={s.regNo} className="hover:bg-slate-900/50">
                        <td className="p-3 font-mono text-slate-400">{s.slNo}</td>
                        <td className="p-3 font-mono font-bold text-purple-300">{s.regNo}</td>
                        <td className="p-3 font-semibold text-white">{s.name}</td>
                        <td className="p-3 text-slate-300">{s.className || '4BTAD - AI & DS'}</td>
                        <td className="p-3 font-mono text-emerald-400">{s.phone}</td>
                        <td className="p-3 font-mono text-slate-400 text-[11px] truncate max-w-[200px]">{s.email}</td>
                        <td className="p-3 text-slate-400">{s.dept}</td>
                        <td className="p-3 font-mono text-amber-300">{s.password ? 'Custom Password Set' : s.defaultPassword}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB CONTENT: DEDICATED SOS LOG VIEW */}
        {activeTab === 'SOS_LOGS' && (
          <div className="bg-[#0e1126] border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <AlertOctagon className="text-rose-400" size={18} /> Dedicated SOS Emergency Log ({filteredSosLogs.length} / {sosLogs.length})
                </h3>
                <p className="text-xs text-slate-400">Complete historical log of all SOS calls with auto-retrieved student dataset information</p>
              </div>
              <span className="text-xs font-mono bg-rose-950 text-rose-300 px-3 py-1 rounded-xl border border-rose-800 font-bold">
                {filteredSosLogs.length} SOS Records
              </span>
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
                    <th className="p-3">Handling Security Officer</th>
                    <th className="p-3">Verification Status</th>
                    <th className="p-3">Penalty Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {filteredSosLogs.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-slate-500">
                        No SOS logs matching search query "{searchQuery}".
                      </td>
                    </tr>
                  ) : (
                    filteredSosLogs.map((log) => (
                      <tr key={log.sosLogId} className="hover:bg-slate-900/50">
                        <td className="p-3 font-mono font-bold text-purple-300">{log.sosLogId}</td>
                        <td className="p-3 font-bold text-white">{log.studentName}</td>
                        <td className="p-3 font-mono text-purple-300">{log.regNo}</td>
                        <td className="p-3 text-slate-300">{log.className}</td>
                        <td className="p-3 font-mono text-emerald-400">{log.phone}</td>
                        <td className="p-3 text-slate-400 font-mono text-[11px]">{log.date} {log.time}</td>
                        <td className="p-3 text-slate-300">{log.securityPersonnel}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                            log.status === 'Genuine Emergency' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                            log.status === 'Prank/False SOS' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                            'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="p-3 text-xs text-slate-300">{log.penaltyStatus || 'None'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB CONTENT: PRANK MARK & DETENTION REGISTRY */}
        {activeTab === 'PENALTIES' && (
          <div className="bg-[#0e1126] border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Ban className="text-rose-500" size={18} /> Student Prank Mark & 4-Mark Detention Registry ({filteredStudents.length} Students)
                </h3>
                <p className="text-xs text-slate-400">Strict disciplinary tracking: 4 Prank Marks triggers 1-Year Detention and Website Blocking</p>
              </div>
              <span className="text-xs font-mono bg-rose-950 text-rose-300 px-3 py-1 rounded-xl border border-rose-800 font-bold">
                {students.filter(s => (s.prankMarkCount || 0) >= 4).length} Detained Students
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#070814] text-rose-300 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-3">Sl.No</th>
                    <th className="p-3">Reg No</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Class</th>
                    <th className="p-3">Registered Phone</th>
                    <th className="p-3">Prank Marks</th>
                    <th className="p-3">Account Status</th>
                    <th className="p-3">Detention Status</th>
                    <th className="p-3">Warning History</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-slate-500">
                        No student penalty records matching search query "{searchQuery}".
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s) => {
                      const marks = s.prankMarkCount || 0;
                      const isDetained = marks >= 4 || s.accountStatus === 'DETAINED / ACCESS BLOCKED';

                      return (
                        <tr key={s.regNo} className={`hover:bg-slate-900/50 ${isDetained ? 'bg-rose-950/30' : ''}`}>
                          <td className="p-3 font-mono text-slate-400">{s.slNo}</td>
                          <td className="p-3 font-mono font-bold text-purple-300">{s.regNo}</td>
                          <td className="p-3 font-bold text-white">{s.name}</td>
                          <td className="p-3 text-slate-300">{s.className || '4BTAD - AI & DS'}</td>
                          <td className="p-3 font-mono text-emerald-400">{s.phone}</td>
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
                          <td className="p-3 font-semibold">
                            {isDetained ? (
                              <span className="text-rose-400 font-bold">Detained for 1 Year</span>
                            ) : (
                              <span className="text-slate-400">Active Student</span>
                            )}
                          </td>
                          <td className="p-3">
                            {s.warningHistory && s.warningHistory.length > 0 ? (
                              <button
                                onClick={() => setSelectedWarningLog(s)}
                                className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg text-[10px] font-bold"
                              >
                                View {s.warningHistory.length} Warnings
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-500">No Warnings</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB CONTENT: AUDIT LOGS WITH TIMESTAMPS FOR EACH STEP & TOTAL TIME TAKEN */}
        {activeTab === 'AUDIT' && (
          <div className="bg-[#0e1126] border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileSpreadsheet className="text-blue-400" size={18} /> Complete Incident Audit Trail ({filteredIncidents.length} / {incidents.length})
                </h3>
                <p className="text-xs text-slate-400">Timestamps logged for each step advancement and total resolution duration</p>
              </div>
              <span className="text-xs font-mono bg-blue-950 text-blue-300 px-3 py-1 rounded-xl border border-blue-800 font-bold">
                {filteredIncidents.length} Audit Records
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#070814] text-blue-300 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-3">Incident ID</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Reported By</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Step 1 Time</th>
                    <th className="p-3">Step 2 Time</th>
                    <th className="p-3">Step 3 Time</th>
                    <th className="p-3">Step 4 Time</th>
                    <th className="p-3">Total Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  {filteredIncidents.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-slate-500 font-sans">
                        No audit records matching search query "{searchQuery}".
                      </td>
                    </tr>
                  ) : (
                    filteredIncidents.map((inc, idx) => {
                      const isSOS = inc.isSOS || inc.categoryLabel === 'SOS QUICK EMERGENCY';
                      const st = inc.stepTimestamps || {};
                      const formatTime = (ts) => ts ? new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '-';

                      return (
                        <tr key={idx} className="hover:bg-slate-900/50">
                          <td className="p-3 font-bold text-purple-300">{inc.id}</td>
                          <td className="p-3 font-semibold text-white font-sans">{inc.categoryLabel}</td>
                          <td className="p-3 text-slate-300 font-sans">{inc.reportedBy} ({inc.regNo})</td>
                          <td className="p-3 font-bold">
                            <span className={`px-2 py-0.5 rounded text-[10px] ${
                              isSOS ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                              inc.status === 'RESOLVED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                              'bg-amber-950 text-amber-300 border border-amber-800'
                            }`}>
                              {inc.status}
                            </span>
                          </td>
                          <td className="p-3 text-emerald-400">{isSOS ? '-' : formatTime(st.step1)}</td>
                          <td className="p-3 text-blue-400">{isSOS ? '-' : formatTime(st.step2)}</td>
                          <td className="p-3 text-purple-400">{isSOS ? '-' : formatTime(st.step3)}</td>
                          <td className="p-3 text-amber-400">{isSOS ? '-' : formatTime(st.step4)}</td>
                          <td className="p-3 font-bold text-cyan-300">
                            {isSOS ? 'Direct Panic Call (SOS Log)' : inc.totalDurationMinutes ? `${inc.totalDurationMinutes} Mins` : inc.status === 'RESOLVED' ? '3.2 Mins' : 'Active'}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* WARNING LOG MODAL */}
      {selectedWarningLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0e1126] border border-amber-500/40 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="text-amber-400" size={18} /> Warning Log: {selectedWarningLog.name}
              </h3>
              <button onClick={() => setSelectedWarningLog(null)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto">
              {selectedWarningLog.warningHistory?.map((w, idx) => (
                <div key={idx} className="p-3 bg-[#070814] rounded-xl border border-amber-500/30 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-amber-300">
                    <span>Prank Mark #{w.markNumber}</span>
                    <span className="font-mono text-[10px] text-slate-400">{w.date} {w.time}</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{w.reason}</p>
                  <p className="text-[10px] text-slate-500 font-mono">By Officer {w.issuedBy} • Incident: {w.incidentId}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedWarningLog(null)}
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
              <p className="text-xs text-slate-300 mt-1">Are you sure you want to sign out of the Admin Portal?</p>
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

      <AddStudentModal
        isOpen={showAddStudentModal}
        onClose={() => { setShowAddStudentModal(false); loadData(); }}
      />
    </div>
  );
}
