import React, { useState } from 'react';
import { UserPlus, X, CheckCircle2, Shield } from 'lucide-react';
import { addNewStudentBySecurity } from '../services/firebaseConfig';

export default function Register({ isOpen, onClose, onRegisterSuccess }) {
  const [regNo, setRegNo] = useState('');
  const [name, setName] = useState('');
  const [dept, setDept] = useState('AI & DS');
  const [phone, setPhone] = useState('');
  const [msg, setMsg] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setMsg(null);

    if (!regNo || !name) {
      setMsg({ type: 'error', text: 'Register Number and Name are required.' });
      return;
    }

    const res = addNewStudentBySecurity(regNo, name, dept, phone);
    if (res.success) {
      setMsg({
        type: 'success',
        text: `Registration successful! Your login Reg No is ${regNo} and your Password is '${res.defaultPass}' (First 3 letters of name in CAPITAL).`
      });
      setTimeout(() => {
        if (onRegisterSuccess) onRegisterSuccess(res.student);
      }, 2000);
    } else {
      setMsg({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0e1126] border border-purple-500/30 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-6 bg-gradient-to-r from-purple-950 to-slate-900 border-b border-purple-500/20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-600/20 text-purple-300 rounded-xl border border-purple-500/30">
              <UserPlus size={22} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Student Registration</h3>
              <p className="text-xs text-purple-300/70">Christ University Kengeri Portal</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {msg && (
            <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
              msg.type === 'success' ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-300' : 'bg-rose-950/50 border-rose-500/30 text-rose-300'
            }`}>
              {msg.text}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1.5">Register Number *</label>
            <input
              type="text"
              placeholder="e.g. 2462099"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              className="w-full px-4 py-3 bg-[#070814] border border-slate-700/60 rounded-xl text-white focus:outline-none focus:border-purple-500 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1.5">Full Student Name *</label>
            <input
              type="text"
              placeholder="e.g. ROHAN SHARMA"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-[#070814] border border-slate-700/60 rounded-xl text-white focus:outline-none focus:border-purple-500 text-sm"
              required
            />
            <p className="text-[11px] text-slate-400 mt-1">Default password will automatically be set to the first 3 letters in CAPITAL.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1.5">Department</label>
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              className="w-full px-4 py-3 bg-[#070814] border border-slate-700/60 rounded-xl text-white focus:outline-none focus:border-purple-500 text-sm"
            >
              <option value="AI & DS">AI & Data Science</option>
              <option value="CSE">Computer Science (CSE)</option>
              <option value="ECE">ECE</option>
              <option value="Mechanical">Mechanical Engineering</option>
              <option value="Civil">Civil Engineering</option>
              <option value="Management">School of Management</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1.5">Phone Number</label>
            <input
              type="text"
              placeholder="9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 bg-[#070814] border border-slate-700/60 rounded-xl text-white focus:outline-none focus:border-purple-500 text-sm"
            />
          </div>

          <div className="pt-3 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 text-sm font-medium">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-600/30 text-sm">
              Register Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
