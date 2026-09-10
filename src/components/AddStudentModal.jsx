import React, { useState } from 'react';
import { UserPlus, X, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import { addNewStudentBySecurity } from '../services/firebaseConfig';

export default function AddStudentModal({ isOpen, onClose, onStudentAdded }) {
  const [regNo, setRegNo] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dept, setDept] = useState('AI & DS');
  const [phone, setPhone] = useState('');
  const [resultMsg, setResultMsg] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setResultMsg(null);

    if (!regNo || !name) {
      setResultMsg({ type: 'error', text: 'Register Number and Full Name are required.' });
      return;
    }

    const customEmail = (email || `${name.toLowerCase().trim().replace(/\s+/g, '.')}@btech.christuniversity.in`).trim();

    const res = addNewStudentBySecurity({ regNo, name, email: customEmail, dept, phone });
    if (res.success) {
      setResultMsg({
        type: 'success',
        text: `Student ${res.student.name} added successfully! Email: ${res.student.email}. Default Password is '${res.defaultPass}' (First 3 letters of name in CAPITAL).`
      });
      setRegNo('');
      setName('');
      setEmail('');
      setPhone('');
      if (onStudentAdded) onStudentAdded(res.student);
    } else {
      setResultMsg({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0e1126] border border-purple-500/30 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="p-6 bg-gradient-to-r from-purple-950/60 to-slate-900 border-b border-purple-500/20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-600/20 text-purple-400 rounded-xl border border-purple-500/30">
              <UserPlus size={22} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                Add Student to Portal Access
              </h3>
              <p className="text-xs text-purple-300/70">Administrator Access Authorization</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {resultMsg && (
            <div className={`p-4 rounded-xl border flex items-start gap-3 text-sm ${
              resultMsg.type === 'success' 
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 font-medium' 
                : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
            }`}>
              {resultMsg.type === 'success' ? <CheckCircle size={20} className="shrink-0 mt-0.5 text-emerald-400" /> : <AlertCircle size={20} className="shrink-0 mt-0.5 text-rose-400" />}
              <div>{resultMsg.text}</div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1.5">Register Number *</label>
            <input
              type="text"
              placeholder="Enter Register Number"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              className="w-full px-4 py-3 bg-[#070814] border border-slate-700/60 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1.5">Full Student Name *</label>
            <input
              type="text"
              placeholder="Enter Full Student Name"
              value={name}
              onChange={(e) => {
                const val = e.target.value;
                setName(val);
                if (!email && val) {
                  const auto = `${val.toLowerCase().trim().replace(/\s+/g, '.')}@btech.christuniversity.in`;
                  setEmail(auto);
                }
              }}
              className="w-full px-4 py-3 bg-[#070814] border border-slate-700/60 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm"
              required
            />
            <p className="text-[11px] text-slate-400 mt-1">Default password will automatically be set to the first 3 letters in CAPITAL (e.g. 'PRA').</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1.5">Official Student Email Address *</label>
            <input
              type="email"
              placeholder="Enter Official Student Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#070814] border border-slate-700/60 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1.5">Department</label>
              <select
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                className="w-full px-4 py-3 bg-[#070814] border border-slate-700/60 rounded-xl text-white focus:outline-none focus:border-purple-500 text-xs"
              >
                <option value="AI & DS">AI & DS</option>
                <option value="CSE">Computer Science (CSE)</option>
                <option value="ECE">ECE</option>
                <option value="IT">IT</option>
                <option value="Civil">Civil</option>
                <option value="Mechanical">Mechanical</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1.5">Phone Number</label>
              <input
                type="text"
                placeholder="Enter Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-[#070814] border border-slate-700/60 rounded-xl text-white focus:outline-none focus:border-purple-500 transition text-xs"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white font-medium text-xs transition"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg transition flex items-center gap-2 text-xs"
            >
              <Shield size={16} /> Add Student Access
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
