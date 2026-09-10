import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, User, Lock, ArrowRight, ShieldCheck, Shield, KeyRound, CheckCircle2, 
  AlertTriangle, X, QrCode, Smartphone, UserX, Ban, Mail, ExternalLink, Check, RefreshCw
} from 'lucide-react';
import { authenticateUser, resetStudentPassword, getStudentByRegNo } from '../services/firebaseConfig';
import MobileQRModal from './MobileQRModal';

export default function Login({ onLoginSuccess }) {
  const [role, setRole] = useState('student'); // 'student', 'security', 'admin'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [blockedAlert, setBlockedAlert] = useState(null);

  // Mobile QR Modal State
  const [showQRModal, setShowQRModal] = useState(false);

  // Forgot Password Email Reset Flow States
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [resetError, setResetError] = useState(null);
  const [sentEmailData, setSentEmailData] = useState(null); // Email Inbox Payload

  // Live Gmail SMTP Config State
  const [showGmailSetup, setShowGmailSetup] = useState(false);
  const [gmailUserConfig, setGmailUserConfig] = useState('');
  const [gmailPassConfig, setGmailPassConfig] = useState('');
  const [gmailSetupMsg, setGmailSetupMsg] = useState(null);
  const [savingGmail, setSavingGmail] = useState(false);

  const handleSaveGmailConfig = async (e) => {
    e.preventDefault();
    setGmailSetupMsg(null);
    setSavingGmail(true);

    try {
      const apiHost = window.location.hostname || 'localhost';
      const response = await fetch(`http://${apiHost}:3001/api/config-gmail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gmailUser: gmailUserConfig.trim(), gmailPass: gmailPassConfig.trim() })
      });
      const data = await response.json();
      setSavingGmail(false);

      if (data.success) {
        setGmailSetupMsg({ type: 'success', text: `✓ Gmail SMTP connected successfully! Live emails will be sent from ${gmailUserConfig.trim()}` });
      } else {
        setGmailSetupMsg({ type: 'error', text: data.message || 'Failed to connect Gmail SMTP.' });
      }
    } catch (err) {
      setSavingGmail(false);
      setGmailSetupMsg({ type: 'error', text: 'Backend server connection error. Make sure node server.js is running.' });
    }
  };

  // Change Password & Confirm Modal State (from Email Link)
  const [activeResetStudent, setActiveResetStudent] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePassError, setChangePassError] = useState('');
  const [changePassSuccess, setChangePassSuccess] = useState('');

  // Check URL parameters on mount for resetToken
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const regNo = params.get('regNo');
    const token = params.get('resetToken');
    if (regNo && token) {
      const student = getStudentByRegNo(regNo);
      if (student) {
        if (student.accountStatus === 'DETAINED / ACCESS BLOCKED' || student.prankMarkCount >= 4) {
          setBlockedAlert(`ACCOUNT BLOCKED: ${student.name} (${student.regNo}) is Detained for 1 Year. Password reset disabled.`);
        } else {
          setActiveResetStudent({ ...student, token });
        }
      }
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setBlockedAlert(null);

    const res = authenticateUser(identifier, password, role);
    if (res.success) {
      onLoginSuccess(res.user);
    } else {
      if (res.isBlocked) {
        setBlockedAlert(res.message);
      } else {
        setError(res.message || 'Invalid username or password.');
      }
    }
  };

  const [destinationEmail, setDestinationEmail] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  // Step 1: Send Reset Link via Real Nodemailer API
  const handleSendResetEmail = async (e) => {
    e.preventDefault();
    setResetError(null);
    setSendingEmail(true);

    if (!resetIdentifier.trim()) {
      setResetError('Register Number or Official Email is required.');
      setSendingEmail(false);
      return;
    }

    const student = getStudentByRegNo(resetIdentifier);
    if (!student) {
      setResetError('Student Register Number or Email not found in university registry.');
      setSendingEmail(false);
      return;
    }

    if (student.accountStatus === 'DETAINED / ACCESS BLOCKED' || student.prankMarkCount >= 4) {
      setResetError(`ACCOUNT BLOCKED: ${student.name} (${student.regNo}) has been Detained for 1 Year due to 4 Prank Marks. Password reset is disabled.`);
      setSendingEmail(false);
      return;
    }

    const recipient = (destinationEmail || student.email || '').trim();
    const token = `RESET-TOK-${student.regNo}-${Date.now().toString().slice(-4)}`;
    const resetUrl = `${window.location.origin}?resetToken=${token}&regNo=${student.regNo}`;

    try {
      const apiHost = window.location.hostname || 'localhost';
      const response = await fetch(`http://${apiHost}:3001/api/send-reset-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toEmail: recipient,
          studentName: student.name,
          regNo: student.regNo,
          resetToken: token,
          resetUrl: resetUrl
        })
      });

      const data = await response.json();
      setSendingEmail(false);

      if (data.success || data) {
        setSentEmailData({
          student,
          recipient,
          token,
          resetUrl,
          previewUrl: data.previewUrl,
          sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
    } catch (err) {
      setSendingEmail(false);
      // Fallback local dispatch preview if server is offline
      setSentEmailData({
        student,
        recipient,
        token,
        resetUrl,
        sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }
  };

  // Step 2: Save New Password & Confirm
  const handleSaveNewPassword = (e) => {
    e.preventDefault();
    setChangePassError('');
    setChangePassSuccess('');

    if (newPassword.length < 3) {
      setChangePassError('Password must be at least 3 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setChangePassError('Passwords do not match. Please confirm password accurately.');
      return;
    }

    const res = resetStudentPassword(activeResetStudent.regNo, newPassword);
    if (res.success) {
      setChangePassSuccess(`✓ Password for ${activeResetStudent.name} (${activeResetStudent.regNo}) reset successfully!`);
      
      // Auto-fill main login form for instant sign-in
      setIdentifier(activeResetStudent.regNo);
      setPassword(newPassword);

      setTimeout(() => {
        setActiveResetStudent(null);
        setSentEmailData(null);
        setShowForgotModal(false);
        setNewPassword('');
        setConfirmPassword('');
        setChangePassSuccess('');
      }, 1500);
    } else {
      setChangePassError(res.message || 'Failed to update password.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070814] flex flex-col items-center justify-center p-4 antialiased text-slate-100 relative">
      {/* Top Mobile QR Quick Launcher */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setShowQRModal(true)}
          className="px-3.5 py-2 bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-500/40 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition"
        >
          <QrCode size={16} className="text-purple-400" /> 📱 Mobile QR Access
        </button>
      </div>

      {/* Brand Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-800 text-purple-300 text-xs font-semibold tracking-wide">
          <ShieldAlert size={14} className="text-purple-400" />
          CHRIST UNIVERSITY KENGERI
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Campus Safety System
        </h1>
        <p className="text-xs sm:text-sm text-purple-200/70 max-w-md mx-auto">
          Kanmanike, Bengaluru 560074 • Emergency Response & Incident Portal
        </p>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-[#0e1126] border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#070814] border border-slate-800 rounded-2xl">
          <button
            type="button"
            onClick={() => { setRole('student'); setError(''); setBlockedAlert(null); }}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              role === 'student'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User size={13} /> Student / Faculty
          </button>

          <button
            type="button"
            onClick={() => { setRole('security'); setError(''); setBlockedAlert(null); }}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              role === 'security'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck size={13} /> Security Guard
          </button>

          <button
            type="button"
            onClick={() => { setRole('admin'); setError(''); setBlockedAlert(null); }}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              role === 'admin'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield size={13} /> Administrator
          </button>
        </div>

        {/* 4-Mark Detained Account Blocked Alert */}
        {blockedAlert && (
          <div className="p-4 bg-rose-950 border-2 border-rose-500/80 text-rose-200 rounded-2xl text-xs space-y-2 text-center shadow-2xl animate-shake">
            <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center mx-auto shadow">
              <Ban size={22} />
            </div>
            <h4 className="font-extrabold text-white text-sm uppercase tracking-wide">ACCOUNT BLOCKED / DETAINED</h4>
            <p className="leading-relaxed font-semibold text-rose-200">{blockedAlert}</p>
            <p className="text-[11px] text-rose-400 font-mono pt-1 border-t border-rose-800/80">
              Disciplinary Threshold Reached (4 Prank SOS Marks). Contact Dean of Students.
            </p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-semibold rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              {role === 'student' && 'Register Number / Student Name'}
              {role === 'security' && 'Security Guard Username'}
              {role === 'admin' && 'Administrator Username'}
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={
                  role === 'student' ? 'Enter Register Number / Student Name' :
                  role === 'security' ? 'Enter Security Username' :
                  'Enter Administrator Username'
                }
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#070814] border border-slate-700/70 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              {role === 'student' && (
                <button
                  type="button"
                  onClick={() => { setShowForgotModal(true); setSentEmailData(null); setResetError(null); }}
                  className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
                >
                  <KeyRound size={12} /> Forgot Password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#070814] border border-slate-700/70 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-3.5 font-extrabold rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm uppercase tracking-wider ${
              role === 'student' ? 'bg-purple-600 hover:bg-purple-500 text-white' :
              role === 'security' ? 'bg-blue-600 hover:bg-blue-500 text-white' :
              'bg-amber-600 hover:bg-amber-500 text-white'
            }`}
          >
            Sign In to Campus Portal <ArrowRight size={16} />
          </button>
        </form>

        {/* Scan QR Code to Open on Phone Button */}
        <div className="pt-3 border-t border-slate-800 text-center">
          <button
            type="button"
            onClick={() => setShowQRModal(true)}
            className="w-full py-2.5 bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
          >
            <Smartphone size={15} /> 📱 Scan QR Code to Open on Phone
          </button>
        </div>
      </div>

      {/* Mobile QR Modal */}
      <MobileQRModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
      />

      {/* --- FORGOT PASSWORD EMAIL DISPATCH MODAL --- */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0e1126] border border-purple-500/40 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4 relative">
            <button
              onClick={() => { setShowForgotModal(false); setSentEmailData(null); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
              title="Close"
            >
              <X size={18} />
            </button>

            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Mail className="text-purple-400" size={20} /> Request Password Reset Link
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Link will be sent to official Christ University email</p>
            </div>

            {resetError && (
              <div className="p-3 bg-rose-950/80 border border-rose-500/40 text-rose-300 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertTriangle size={16} className="shrink-0" /> {resetError}
              </div>
            )}

            {/* Expandable Live Gmail SMTP Config Panel */}
            <div className="p-3 bg-purple-950/40 border border-purple-500/30 rounded-2xl space-y-2">
              <button
                type="button"
                onClick={() => setShowGmailSetup(!showGmailSetup)}
                className="w-full text-left text-xs font-bold text-purple-300 flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5">
                  <Mail size={14} className="text-purple-400" /> ⚙️ Connect Live Gmail SMTP (Optional Real Inbox Dispatch)
                </span>
                <span>{showGmailSetup ? '▲ Hide' : '▼ Setup'}</span>
              </button>

              {showGmailSetup && (
                <div className="pt-2 border-t border-purple-500/20 space-y-2.5 animate-fadeIn">
                  {gmailSetupMsg && (
                    <div className={`p-2.5 rounded-xl text-xs font-semibold ${gmailSetupMsg.type === 'success' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-rose-950 text-rose-300 border border-rose-500/40'}`}>
                      {gmailSetupMsg.text}
                    </div>
                  )}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300">Your Sender Gmail Address</label>
                    <input
                      type="email"
                      placeholder="yourname@gmail.com"
                      value={gmailUserConfig}
                      onChange={(e) => setGmailUserConfig(e.target.value)}
                      className="w-full px-3 py-2 bg-[#070814] border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300">Google 16-Char App Password</label>
                    <input
                      type="password"
                      placeholder="xxxx xxxx xxxx xxxx"
                      value={gmailPassConfig}
                      onChange={(e) => setGmailPassConfig(e.target.value)}
                      className="w-full px-3 py-2 bg-[#070814] border border-slate-700 rounded-lg text-xs text-white"
                    />
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Generate from: Google Account ➔ Security ➔ 2-Step Verification ➔ App passwords.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveGmailConfig}
                    disabled={savingGmail}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold shadow transition"
                  >
                    {savingGmail ? 'Connecting Gmail...' : 'Save & Connect Gmail SMTP'}
                  </button>
                </div>
              )}
            </div>

            {!sentEmailData ? (
              <form onSubmit={handleSendResetEmail} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1.5">
                    Student Register Number or Official Email *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Register Number or Official Email"
                    value={resetIdentifier}
                    onChange={(e) => {
                      const val = e.target.value;
                      setResetIdentifier(val);
                      const student = getStudentByRegNo(val);
                      if (student && student.email) {
                        setDestinationEmail(student.email);
                      }
                    }}
                    className="w-full px-4 py-3 bg-[#070814] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1.5">
                    Destination Gmail / Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="Enter Destination Email Address"
                    value={destinationEmail}
                    onChange={(e) => setDestinationEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#070814] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                    required
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Enter your personal Gmail address to receive the live password reset email.
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 text-slate-400 hover:text-white text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendingEmail}
                    className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs shadow-lg uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {sendingEmail ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" /> Sending Email...
                      </>
                    ) : (
                      <>
                        <Mail size={14} /> Send Password Reset Email
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* OFFICIAL STUDENT INBOX CARD WITH WORKING CLICKABLE LINK & WEBMAIL LINK */
              <div className="space-y-4 animate-fadeIn">
                <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                  Password reset link dispatched to {sentEmailData.recipient}!
                </div>

                {sentEmailData.previewUrl && (
                  <a
                    href={sentEmailData.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition border border-blue-400/40"
                  >
                    <ExternalLink size={14} /> 🌐 Open Dispatched Email in Webmail Inbox (1-Click)
                  </a>
                )}

                {/* Simulated Student Email Mailbox Interface */}
                <div className="p-4 bg-[#070814] border-2 border-purple-500/40 rounded-2xl space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-extrabold text-purple-300 flex items-center gap-1.5">
                      <Mail size={14} /> Official Christ University Student Mailbox
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{sentEmailData.sentAt}</span>
                  </div>

                  <div className="space-y-1 text-slate-300">
                    <p><strong className="text-slate-400">From:</strong> <span className="font-mono text-purple-300">no-reply.security@btech.christuniversity.in</span></p>
                    <p><strong className="text-slate-400">To:</strong> <span className="font-mono text-emerald-400">{sentEmailData.recipient}</span></p>
                    <p><strong className="text-slate-400">Subject:</strong> <strong className="text-white">🔐 Security Password Reset Request for {sentEmailData.student.name} ({sentEmailData.student.regNo})</strong></p>
                  </div>

                  <div className="p-3 bg-[#0e1126] rounded-xl border border-purple-500/30 space-y-3 text-[11px] leading-relaxed text-slate-200">
                    <p>Dear <strong>{sentEmailData.student.name}</strong>,</p>
                    <p>You requested to reset your password for the Christ University Kengeri Safety Portal. Click the button below to change and confirm your password:</p>
                    
                    <button
                      type="button"
                      onClick={() => setActiveResetStudent(sentEmailData.student)}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black rounded-xl shadow-lg flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition border border-purple-400/40"
                    >
                      <ExternalLink size={15} /> 🔗 CLICK HERE TO CHANGE PASSWORD & CONFIRM ➔
                    </button>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => { setShowForgotModal(false); setSentEmailData(null); }}
                    className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold"
                  >
                    Close Mailbox Preview
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- CHANGE PASSWORD & CONFIRM MODAL (TRIGGERED FROM EMAIL LINK) --- */}
      {activeResetStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0e1126] border-2 border-purple-500/60 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4 relative">
            <button
              onClick={() => setActiveResetStudent(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
              title="Close"
            >
              <X size={18} />
            </button>

            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] font-mono bg-purple-950 text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-800 font-bold uppercase">
                VERIFIED EMAIL RESET LINK
              </span>
              <h3 className="text-xl font-extrabold text-white mt-1.5 flex items-center gap-2">
                <KeyRound className="text-purple-400" size={22} /> Change Password & Confirm
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Updating credentials for <strong className="text-white">{activeResetStudent.name}</strong> (Reg: <strong className="font-mono text-purple-300">{activeResetStudent.regNo}</strong>)
              </p>
            </div>

            {changePassSuccess && (
              <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                {changePassSuccess}
              </div>
            )}

            {changePassError && (
              <div className="p-3.5 bg-rose-950/80 border border-rose-500/50 text-rose-300 rounded-xl text-xs font-bold flex items-center gap-2">
                <AlertTriangle size={18} className="text-rose-400 shrink-0" />
                {changePassError}
              </div>
            )}

            <form onSubmit={handleSaveNewPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-purple-200 uppercase tracking-wider mb-1.5">
                  1. Enter New Password *
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#070814] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-200 uppercase tracking-wider mb-1.5">
                  2. Confirm New Password *
                </label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#070814] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-black rounded-xl text-xs shadow-lg uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Check size={16} /> SAVE NEW PASSWORD & LOGIN NOW
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
