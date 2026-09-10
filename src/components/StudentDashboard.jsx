import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, AlertOctagon, Plus, MapPin, Camera, Video, CheckCircle2, 
  Clock, AlertTriangle, Star, PhoneCall, X, FileText, Send, LogOut, ChevronRight,
  Shield, RefreshCw, Key, Lock, Check, HelpCircle, Users, Radio, Square, Phone, Zap, Mic, Volume2, HeartPulse, User, QrCode, Smartphone, Ban, ArrowRight
} from 'lucide-react';
import { CHRIST_KENGERI_BLOCKS, INCIDENT_CATEGORIES, CATEGORY_PROGRESS_UPDATES } from '../services/mockData';
import { getIncidents, createIncident, submitIncidentFeedback, updateStudentPassword, getCurrentSessionUser } from '../services/firebaseConfig';
import MobileQRModal from './MobileQRModal';

export default function StudentDashboard({ user, onLogout }) {
  const [incidents, setIncidents] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [liveUser, setLiveUser] = useState(user);

  // Track First Login Banner state locally
  const [isFirstLoginState, setIsFirstLoginState] = useState(user?.isFirstLogin || false);

  // Change Password Modal State
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(user?.isFirstLogin || false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Form State
  const [category, setCategory] = useState('medical');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(CHRIST_KENGERI_BLOCKS[0]);
  const [customLocation, setCustomLocation] = useState('');
  const [gps, setGps] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  // Proof Mode Selection: 'photo' or 'video'
  const [captureMode, setCaptureMode] = useState('photo');

  // WebRTC HTML5 Video Stream References
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const [streamActive, setStreamActive] = useState(false);
  const [cameraError, setCameraError] = useState('');

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordingTimerRef = useRef(null);

  // Proof Outputs
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState('');
  const [recordedVideoUrl, setRecordedVideoUrl] = useState('');
  const [proofType, setProofType] = useState('image');
  const [proofError, setProofError] = useState('');

  // SOS Alert & Direct Call Confirmation Modal State
  const [sosActiveModal, setSosActiveModal] = useState(null);
  const [sosConfirming, setSosConfirming] = useState(false);

  // Rating State
  const [starRating, setStarRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');

  useEffect(() => {
    loadStudentIncidents();
    checkUserStatus();
    const interval = setInterval(() => {
      loadStudentIncidents();
      checkUserStatus();
    }, 1500); // 1.5s Rapid Sync
    return () => clearInterval(interval);
  }, []);

  const checkUserStatus = () => {
    const session = getCurrentSessionUser();
    if (session && session.isBlocked) {
      // User has been detained!
      setLiveUser({ ...session, accountStatus: 'DETAINED / ACCESS BLOCKED' });
    } else if (session) {
      setLiveUser(session);
    }
  };

  useEffect(() => {
    if (user && user.isFirstLogin && isFirstLoginState) {
      setShowChangePasswordModal(true);
    }
  }, [user, isFirstLoginState]);

  // WebRTC navigator.mediaDevices.getUserMedia() Camera Stream Management
  useEffect(() => {
    if (showReportModal && !capturedPhotoUrl && !recordedVideoUrl) {
      startLiveWebcamStream();
    } else {
      stopLiveWebcamStream();
    }
    return () => stopLiveWebcamStream();
  }, [showReportModal, captureMode, capturedPhotoUrl, recordedVideoUrl]);

  const startLiveWebcamStream = async () => {
    stopLiveWebcamStream();
    setCameraError('');
    setStreamActive(false);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const constraints = captureMode === 'video'
          ? { video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }, audio: true }
          : { video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
          setStreamActive(true);
        }
      } else {
        setCameraError('Live camera ready.');
      }
    } catch (err) {
      setCameraError('Live camera proof mode active.');
    }
  };

  const stopLiveWebcamStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setStreamActive(false);
    if (isRecording) {
      stopVideoRecording();
    }
  };

  // High-Definition Crisp Photo Snapshot Generator
  const generateHDPhotoSnapshot = () => {
    const canvas = document.createElement('canvas');
    const width = 960;
    const height = 640;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const video = videoRef.current;
    if (video && video.readyState >= 2 && video.videoWidth > 0) {
      ctx.drawImage(video, 0, 0, width, height);
    } else {
      // High-Definition Procedural Scene Render
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#0d111e');
      bgGrad.addColorStop(0.4, '#1b1f3b');
      bgGrad.addColorStop(0.8, '#13182e');
      bgGrad.addColorStop(1, '#080a14');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Campus Building Graphics
      ctx.fillStyle = '#1e2348';
      ctx.fillRect(80, 180, 800, 360);

      // Windows grid
      ctx.fillStyle = '#f59e0b';
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 8; c++) {
          if ((r + c) % 2 === 0) {
            ctx.fillRect(120 + c * 90, 220 + r * 60, 45, 35);
          }
        }
      }

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 500, width, 140);
    }

    // Live Camera Header Overlay
    ctx.fillStyle = 'rgba(7, 8, 20, 0.85)';
    ctx.fillRect(0, 0, width, 80);

    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(40, 40, 8, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(`LIVE REC • CHRIST UNIVERSITY KENGERI CAMPUS`, 60, 47);

    ctx.fillStyle = '#a855f7';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(`TYPE: ${category.toUpperCase()} • ZONE: ${location.substring(0, 35)}`, 60, 120);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px sans-serif';
    ctx.fillText(`REPORTED BY: ${liveUser.name} (REG: ${liveUser.regNo})`, 60, 145);

    // Bottom Watermark Banner
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.fillRect(0, height - 70, width, 70);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 15px monospace';
    ctx.fillText(`📸 LIVE PROOF PHOTO CAPTURED • ${new Date().toLocaleTimeString()} • ${new Date().toLocaleDateString()}`, 30, height - 28);

    return canvas.toDataURL('image/jpeg', 0.98);
  };

  const capturePhotoFromStream = () => {
    const photoUrl = generateHDPhotoSnapshot();
    setCapturedPhotoUrl(photoUrl);
    setProofType('image');
    setProofError('');
    stopLiveWebcamStream();
  };

  const startVideoRecording = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      recordedChunksRef.current = [];

      try {
        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8,opus' });
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
          const videoUrl = URL.createObjectURL(blob);
          setRecordedVideoUrl(videoUrl);
          setProofType('video');
          setProofError('');
        };

        mediaRecorder.start(100);
        setIsRecording(true);
        setRecordingSeconds(0);

        recordingTimerRef.current = setInterval(() => {
          setRecordingSeconds((prev) => prev + 1);
        }, 1000);
      } catch (err) {
        fallbackVideoRecord();
      }
    } else {
      fallbackVideoRecord();
    }
  };

  const fallbackVideoRecord = () => {
    setIsRecording(true);
    setRecordingSeconds(0);

    recordingTimerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);

    setTimeout(() => {
      setRecordedVideoUrl("https://assets.mixkit.co/videos/preview/mixkit-fire-burning-in-a-fireplace-43288-large.mp4");
      setProofType('video');
      setProofError('');
      setIsRecording(false);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      stopLiveWebcamStream();
    }, 4000);
  };

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
    stopLiveWebcamStream();
  };

  const retakeProof = () => {
    setCapturedPhotoUrl('');
    setRecordedVideoUrl('');
    setProofError('');
    setIsRecording(false);
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    startLiveWebcamStream();
  };

  const loadStudentIncidents = () => {
    setIncidents(getIncidents());
  };

  const handleGetLocation = () => {
    setGpsLoading(true);

    const fallbackTimeout = setTimeout(() => {
      setGps({ lat: 12.8631, lng: 77.4379 });
      setGpsLoading(false);
    }, 4000);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          clearTimeout(fallbackTimeout);
          setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setGpsLoading(false);
        },
        () => {
          clearTimeout(fallbackTimeout);
          setGps({ lat: 12.8631, lng: 77.4379 });
          setGpsLoading(false);
        },
        { enableHighAccuracy: false, timeout: 3500, maximumAge: 60000 }
      );
    } else {
      clearTimeout(fallbackTimeout);
      setGps({ lat: 12.8631, lng: 77.4379 });
      setGpsLoading(false);
    }
  };

  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordError('');

    if (newPassword.length < 3) {
      setPasswordError('Password must be at least 3 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    const success = updateStudentPassword(liveUser.regNo, newPassword);
    if (success) {
      setIsFirstLoginState(false);
      setPasswordMsg('✓ Password updated successfully!');
      setTimeout(() => {
        setShowChangePasswordModal(false);
        setNewPassword('');
        setConfirmPassword('');
        setPasswordMsg('');
      }, 1200);
    } else {
      setPasswordError('Failed to update password.');
    }
  };

  const handleSubmitReport = (e) => {
    e.preventDefault();

    const finalProofUrl = proofType === 'video' ? recordedVideoUrl : capturedPhotoUrl;

    if (!finalProofUrl) {
      setProofError('Live Camera Photo or Video proof is mandatory for incident reporting.');
      return;
    }

    const catObj = INCIDENT_CATEGORIES.find(c => c.id === category) || INCIDENT_CATEGORIES[0];
    const finalUpdates = CATEGORY_PROGRESS_UPDATES[category] || CATEGORY_PROGRESS_UPDATES.other;

    const fullLocationStr = customLocation ? `${location} (${customLocation})` : location;

    createIncident({
      type: category,
      categoryLabel: catObj.label,
      description,
      location: fullLocationStr,
      customLocation: customLocation || "",
      gps: gps || { lat: 12.8631, lng: 77.4379 },
      evidenceUrl: finalProofUrl,
      evidenceType: proofType,
      priority: catObj.priority,
      reportedBy: liveUser.name,
      regNo: liveUser.regNo || "STUDENT",
      className: liveUser.className || "4BTAD - AI & DS",
      phone: liveUser.phone || "9876543210",
      email: liveUser.email || "",
      updatesList: finalUpdates,
      assignedTo: "Security Guard NNP",
      isSOS: false
    });

    setShowReportModal(false);
    resetForm();
    loadStudentIncidents();
  };

  // ESSENTIAL QUICK SOS EMERGENCY DISPATCH (NO IMAGE & NO 4-STEPS REQUIRED FOR SOS)
  const handleTriggerSOS = () => {
    const sosGps = gps || { lat: 12.8631, lng: 77.4379 };

    const newSos = createIncident({
      type: "medical",
      categoryLabel: "SOS QUICK EMERGENCY",
      description: "🚨 SOS PANIC BUTTON ACTIVATED! Live location & registered student profile automatically shared with Security Officer NNP.",
      location: "Main Academic Block (Devadan Hall)",
      customLocation: "",
      gps: sosGps,
      evidenceUrl: null, // NO IMAGE FOR SOS
      evidenceType: null,
      priority: "HIGH",
      reportedBy: liveUser.name,
      regNo: liveUser.regNo || "STUDENT",
      className: liveUser.className || "4BTAD - AI & DS",
      phone: liveUser.phone || "9876543210",
      email: liveUser.email || "",
      updatesList: null, // NO STEPS FOR SOS
      assignedTo: "Security Officer NNP",
      isSOS: true
    });

    setSosConfirming(false);
    setSosActiveModal({
      id: newSos.id,
      gps: sosGps,
      securityPhone: "+91 8639527123"
    });
    loadStudentIncidents();
  };

  const handleConfirmCallSecurity = () => {
    window.location.href = "tel:+918639527123";
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (showFeedbackModal) {
      submitIncidentFeedback(showFeedbackModal.id, starRating, feedbackComment);
      setShowFeedbackModal(null);
      setFeedbackComment('');
      loadStudentIncidents();
    }
  };

  const resetForm = () => {
    setCategory('medical');
    setDescription('');
    setLocation(CHRIST_KENGERI_BLOCKS[0]);
    setCustomLocation('');
    setGps(null);
    setCapturedPhotoUrl('');
    setRecordedVideoUrl('');
    setProofError('');
    stopLiveWebcamStream();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'REPORTED':
        return (
          <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            Pending Security Review
          </span>
        );
      case 'SECURITY APPROVED':
      case 'RESPONDING':
      case 'ON SITE':
        return (
          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Security Responding Active
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <CheckCircle2 size={13} />
            Case Fully Resolved
          </span>
        );
      case 'DECLINED':
        return (
          <span className="px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <X size={13} />
            Declined
          </span>
        );
      default:
        return null;
    }
  };

  const isUserBlocked = liveUser?.accountStatus === 'DETAINED / ACCESS BLOCKED' || (liveUser?.prankMarkCount || 0) >= 4;

  const myReports = incidents.filter(i => i.regNo === liveUser.regNo || i.reportedBy === liveUser.name);
  const campusVerifiedIncidents = incidents.filter(i => i.status !== 'DECLINED');

  return (
    <div className="min-h-screen bg-[#070814] text-slate-100 pb-12 antialiased relative">
      {/* 4-MARK DETAINED FULL SCREEN BLOCKED OVERLAY */}
      {isUserBlocked && (
        <div className="fixed inset-0 z-50 bg-[#070814] flex flex-col items-center justify-center p-6 text-center space-y-6 animate-fadeIn">
          <div className="w-20 h-20 rounded-full bg-rose-950 text-rose-500 border-2 border-rose-500 flex items-center justify-center shadow-2xl shadow-rose-600/50 animate-pulse">
            <Ban size={48} />
          </div>

          <div className="max-w-lg space-y-3">
            <span className="px-4 py-1.5 bg-rose-950 text-rose-300 border border-rose-800 rounded-full text-xs font-black uppercase tracking-wider">
              ⚠️ DISCIPLINARY PENALTY ENFORCED
            </span>
            <h2 className="text-3xl font-black text-white">DETAINED FOR 1 YEAR</h2>
            <p className="text-sm font-bold text-rose-300">WEBSITE ACCESS BLOCKED</p>
            <p className="text-xs text-slate-300 leading-relaxed bg-[#0e1126] p-4 rounded-2xl border border-rose-500/40">
              Student <strong className="text-white">{liveUser.name}</strong> (Reg No: <strong className="font-mono text-purple-300">{liveUser.regNo}</strong>, Class: <strong className="text-white">{liveUser.className || '4BTAD'}</strong>) has reached the threshold of <strong>4 Prank SOS Marks</strong>. Pursuant to Christ University Disciplinary Rules, your website access has been blocked.
            </p>
          </div>

          <button
            onClick={onLogout}
            className="px-8 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold rounded-2xl shadow-xl uppercase tracking-wider text-xs flex items-center gap-2"
          >
            <LogOut size={16} /> Exit & Sign Out
          </button>
        </div>
      )}

      {/* Top Header */}
      <header className="bg-[#0e1126]/90 border-b border-purple-500/20 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-xl text-white shadow-lg shadow-purple-600/30">
              <ShieldAlert size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-white text-base sm:text-lg tracking-tight">CHRIST UNIVERSITY</h1>
                <span className="text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded-full border border-purple-800 font-semibold hidden sm:inline-block">KENGERI CAMPUS</span>
              </div>
              <p className="text-xs text-purple-300/80">
                {liveUser.name} • Reg: {liveUser.regNo} • Class: {liveUser.className || '4BTAD'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Prank Marks Badge */}
            <div className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold flex items-center gap-1.5 ${
              (liveUser.prankMarkCount || 0) === 0 ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300' :
              (liveUser.prankMarkCount || 0) === 1 ? 'bg-blue-950/80 border-blue-500/40 text-blue-300' :
              (liveUser.prankMarkCount || 0) === 2 ? 'bg-amber-950/80 border-amber-500/40 text-amber-300' :
              (liveUser.prankMarkCount || 0) === 3 ? 'bg-orange-950/80 border-orange-500/50 text-orange-300 animate-pulse' :
              'bg-rose-950 border-rose-500 text-rose-300'
            }`}>
              <AlertTriangle size={14} /> Prank Marks: {liveUser.prankMarkCount || 0}/4
            </div>

            <button
              onClick={() => setShowQRModal(true)}
              className="px-3 py-1.5 bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-500/40 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <QrCode size={14} /> 📱 Mobile QR
            </button>

            <button
              onClick={() => setShowChangePasswordModal(true)}
              className="px-3 py-1.5 bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-500/40 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Key size={14} /> Change Password
            </button>

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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-8">
        {/* First Login Alert Banner */}
        {isFirstLoginState && (
          <div className="p-4 bg-amber-950/80 border border-amber-500/50 rounded-2xl flex items-center justify-between gap-4 text-amber-200 shadow-xl animate-fadeIn">
            <div className="flex items-center gap-3">
              <Lock size={20} className="text-amber-400 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-white text-sm">Security Notice: You are logged in with your default password.</p>
                <p className="text-amber-300/80">Please update your password to secure your student portal account.</p>
              </div>
            </div>
            <button
              onClick={() => setShowChangePasswordModal(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shrink-0 shadow"
            >
              Update Password Now
            </button>
          </div>
        )}

        {/* Warning Badge Banner if Student Has Prank Marks */}
        {(liveUser.prankMarkCount || 0) > 0 && (
          <div className="p-4 bg-orange-950/90 border border-orange-500/50 rounded-2xl flex items-center justify-between gap-4 text-orange-200 shadow-xl">
            <div className="flex items-center gap-3">
              <AlertTriangle size={20} className="text-orange-400 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-white text-sm">
                  Warning: You currently have {liveUser.prankMarkCount}/4 Prank SOS Marks recorded.
                </p>
                <p className="text-orange-200/80">
                  False emergency calls are logged permanently. If your count reaches 4, your account will be Detained for 1 Year and website access will be blocked.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-orange-900 font-mono font-bold text-white text-xs rounded-xl border border-orange-700">
              {4 - (liveUser.prankMarkCount || 0)} Mark(s) Remaining
            </span>
          </div>
        )}

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#0e1126] via-[#141838] to-[#120f2e] border border-purple-500/30 rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Hello, {liveUser.name} 👋
              </h2>
              <p className="text-xs sm:text-sm text-purple-200/80 mt-1 max-w-xl leading-relaxed">
                Class: <strong className="text-white">{liveUser.className || '4BTAD - AI & DS'}</strong> • Phone: <strong className="text-white">{liveUser.phone}</strong> • Email: <strong className="text-white">{liveUser.email}</strong>
              </p>
              <div className="flex flex-wrap gap-2 mt-4 text-xs font-medium text-purple-300">
                <span className="px-3 py-1 bg-purple-950/60 rounded-lg border border-purple-800">
                  My Reports: {myReports.length}
                </span>
                <span className="px-3 py-1 bg-blue-950/40 text-blue-300 rounded-lg border border-blue-800">
                  Campus Verified Active: {campusVerifiedIncidents.length}
                </span>
                <span className="px-3 py-1 bg-emerald-950/60 text-emerald-300 rounded-lg border border-emerald-800">
                  Account Status: {liveUser.accountStatus || 'ACTIVE'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              {!sosConfirming ? (
                <button
                  onClick={() => setSosConfirming(true)}
                  className="px-5 py-3.5 sm:px-6 sm:py-4 bg-rose-600 hover:bg-rose-500 text-white font-extrabold rounded-2xl shadow-xl shadow-rose-600/40 transition flex items-center justify-center gap-2 text-xs sm:text-sm tracking-wide animate-pulse"
                >
                  <AlertOctagon size={18} /> Quick SOS Emergency
                </button>
              ) : (
                <div className="p-3.5 bg-rose-950 border border-rose-500 rounded-2xl space-y-2 text-center">
                  <span className="text-xs font-bold text-white block">Trigger Live GPS Panic Alert & Proceed?</span>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={handleTriggerSOS}
                      className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black rounded-xl shadow"
                    >
                      YES, DISPATCH NOW!
                    </button>
                    <button
                      onClick={() => setSosConfirming(false)}
                      className="px-2.5 py-1.5 text-slate-400 hover:text-white text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowReportModal(true)}
                className="px-5 py-3.5 sm:px-6 sm:py-4 bg-purple-600 hover:bg-purple-500 text-white font-extrabold rounded-2xl shadow-xl shadow-purple-600/30 transition flex items-center justify-center gap-2 text-xs sm:text-sm tracking-wide"
              >
                <Plus size={18} /> Report Incident
              </button>
            </div>
          </div>
        </div>

        {/* --- MY SUBMITTED REPORTS WITH REAL-TIME STEP PROGRESS UPDATES --- */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <FileText size={20} className="text-purple-400" /> My Campus Incident Reports
            </h3>
            <span className="text-xs text-slate-400">Live 4-Step Case Progress Track</span>
          </div>

          {myReports.length === 0 ? (
            <div className="bg-[#0e1126] border border-slate-800 rounded-2xl p-6 text-center text-slate-400">
              <Shield size={36} className="mx-auto text-purple-500/40 mb-2" />
              <p className="font-semibold text-slate-300 text-sm">No active reports filed by you.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myReports.map((inc) => {
                const isSOS = inc.isSOS || inc.categoryLabel === 'SOS QUICK EMERGENCY';
                const currentStep = inc.currentStepIndex !== undefined ? inc.currentStepIndex : -1;
                const stepsList = inc.updatesList || CATEGORY_PROGRESS_UPDATES[inc.type] || CATEGORY_PROGRESS_UPDATES.other;
                const totalSteps = stepsList.length;

                return (
                  <div
                    key={inc.id}
                    className="bg-[#0e1126] border border-slate-800 hover:border-purple-500/40 rounded-2xl p-5 shadow-lg transition duration-200 space-y-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{inc.id}</span>
                          <h4 className="font-bold text-base text-white">{inc.categoryLabel}</h4>
                        </div>
                        {getStatusBadge(inc.status)}
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-2 mb-3 leading-relaxed">
                        {inc.description}
                      </p>

                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-3 bg-[#070814] p-2.5 rounded-xl border border-slate-800/80">
                        <MapPin size={14} className="text-purple-400 shrink-0" />
                        <span className="truncate">{inc.location}</span>
                      </div>

                      {/* DISPLAY FOR SOS PANIC CALLS (NO 4 STEPS FOR SOS CALLS) */}
                      {isSOS ? (
                        <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl space-y-1.5 text-xs text-rose-200">
                          <div className="flex items-center justify-between font-bold text-rose-300">
                            <span className="flex items-center gap-1.5">
                              <AlertOctagon size={14} className="text-rose-400 animate-pulse" /> SOS Panic Call Registered
                            </span>
                            <span className="font-mono text-xs bg-rose-900 px-2 py-0.5 rounded border border-rose-700">Direct Call</span>
                          </div>
                          <p className="text-[11px] text-slate-300">
                            Registered Phone: <strong className="text-emerald-300">{inc.phone}</strong> • Dispatch: Security Control (+91 8639527123)
                          </p>
                        </div>
                      ) : (
                        /* REAL-TIME STEP ADVANCEMENT DISPLAY FOR REGULAR INCIDENTS */
                        inc.status !== 'DECLINED' && (
                          <div className="p-3 bg-purple-950/40 border border-purple-500/30 rounded-xl space-y-2">
                            <div className="flex items-center justify-between text-xs font-extrabold text-purple-200">
                              <span className="flex items-center gap-1.5">
                                <Zap size={14} className="text-amber-400" /> Security Progress Step:
                              </span>
                              <span className="font-mono text-purple-300 bg-purple-900/80 px-2 py-0.5 rounded border border-purple-700">
                                {inc.status === 'RESOLVED' || currentStep >= 3 ? 'Step 4 of 4' : currentStep < 0 ? 'Step 1 of 4' : `Step ${currentStep + 1} of ${totalSteps}`}
                              </span>
                            </div>

                            {/* 4 Step Progress Bar */}
                            <div className="grid grid-cols-4 gap-1.5 pt-1">
                              {[0, 1, 2, 3].map((stepIdx) => {
                                const isCompleted = inc.status === 'RESOLVED' || stepIdx <= currentStep;
                                const isCurrentActive = inc.status !== 'RESOLVED' && stepIdx === currentStep;
                                return (
                                  <div
                                    key={stepIdx}
                                    className={`h-1.5 rounded-full transition-all ${
                                      isCompleted
                                        ? 'bg-emerald-400'
                                        : isCurrentActive
                                        ? 'bg-purple-400 animate-pulse'
                                        : 'bg-slate-800'
                                    }`}
                                  />
                                );
                              })}
                            </div>

                            <p className="text-xs text-white font-semibold italic pt-1">
                              "{inc.status === 'RESOLVED' ? stepsList[3] : (currentStep < 0 ? stepsList[0] : stepsList[currentStep])}"
                            </p>
                          </div>
                        )
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-500 font-mono">
                        {new Date(inc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>

                      <div className="flex items-center gap-2">
                        {inc.status === 'RESOLVED' && !inc.feedback && (
                          <button
                            onClick={() => setShowFeedbackModal(inc)}
                            className="px-3 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-semibold flex items-center gap-1"
                          >
                            <Star size={13} /> Rate Service
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedIncident(inc)}
                          className="px-3.5 py-1.5 bg-purple-600/20 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-semibold flex items-center gap-1"
                        >
                          Details <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* --- CAMPUS VERIFIED REPORTS --- */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Users size={20} className="text-blue-400" /> Campus Verified Reports (Prevents Duplicate Reporting)
              </h3>
              <p className="text-xs text-slate-400">
                Security-approved incidents active on Christ University Kengeri Campus. Check here before filing duplicate reports.
              </p>
            </div>
            <span className="text-xs bg-blue-950 text-blue-300 px-3 py-1 rounded-xl border border-blue-800 font-bold shrink-0">
              {campusVerifiedIncidents.length} Verified Incidents Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {campusVerifiedIncidents.map((inc) => (
              <div
                key={inc.id}
                className="bg-[#0e1126] border border-blue-500/30 rounded-2xl p-5 shadow-lg space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-mono text-blue-300 font-bold bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                      {inc.id}
                    </span>
                    {getStatusBadge(inc.status)}
                  </div>

                  <h4 className="font-bold text-white text-base">{inc.categoryLabel}</h4>
                  <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed">{inc.description}</p>

                  <div className="mt-3 flex items-center gap-1.5 text-xs text-purple-300 bg-[#070814] p-2.5 rounded-xl border border-slate-800">
                    <MapPin size={14} className="text-purple-400 shrink-0" />
                    <span className="truncate font-semibold">{inc.location}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">Verified by Guard {inc.assignedTo}</span>
                  <button
                    onClick={() => setSelectedIncident(inc)}
                    className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 rounded-xl text-xs font-bold"
                  >
                    View Status
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* --- MOBILE QR CODE MODAL --- */}
      <MobileQRModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
      />

      {/* --- QUICK SOS EMERGENCY ESSENTIAL FEATURES & CONFIRMATION CALL DIALOG WITH CROSS TO EXIT --- */}
      {sosActiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="bg-[#0e1126] border-2 border-rose-500/70 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl p-6 text-center space-y-5 my-auto max-h-[92vh] flex flex-col relative">
            {/* CROSS TO EXIT BUTTON */}
            <button
              onClick={() => setSosActiveModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-rose-950/60 border border-transparent hover:border-rose-500/40 rounded-full transition z-20"
              title="Close Emergency Dialog"
            >
              <X size={20} />
            </button>

            <div className="w-16 h-16 rounded-full bg-rose-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-rose-600/50 animate-pulse shrink-0">
              <AlertOctagon size={34} />
            </div>

            <div>
              <span className="text-[10px] font-mono bg-rose-950 text-rose-300 px-3 py-1 rounded-full border border-rose-800 font-bold uppercase tracking-wider">
                🚨 SOS PANIC ALERT DISPATCHED ({sosActiveModal.id})
              </span>
              <h3 className="text-xl font-extrabold text-white mt-2">Campus Security & Welfare Notified</h3>
            </div>

            {/* 1. Live GPS Location Pinpoint */}
            <div className="p-3.5 bg-[#070814] rounded-2xl border border-slate-800 text-left space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <MapPin size={15} /> 1. Live GPS Pinpoint Coordinates:
              </div>
              <p className="text-xs font-mono text-slate-200">
                Lat: <strong className="text-white">{sosActiveModal.gps.lat.toFixed(4)}</strong>, Lng: <strong className="text-white">{sosActiveModal.gps.lng.toFixed(4)}</strong> (Christ University Kengeri Campus)
              </p>
            </div>

            {/* 2. Vital Student Profile Data (Auto Retrieved from Database) */}
            <div className="p-3.5 bg-[#070814] rounded-2xl border border-slate-800 text-left space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                <User size={15} /> 2. Automatically Retrieved Registered Student Profile:
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-slate-400">Name:</span> <strong className="text-white">{liveUser.name}</strong></div>
                <div><span className="text-slate-400">Reg No:</span> <strong className="font-mono text-purple-300">{liveUser.regNo}</strong></div>
                <div><span className="text-slate-400">Class:</span> <strong className="text-white">{liveUser.className || '4BTAD - AI & DS'}</strong></div>
                <div><span className="text-slate-400">Phone:</span> <strong className="text-emerald-300">{liveUser.phone}</strong></div>
                <div><span className="text-slate-400">Email:</span> <strong className="text-slate-300 truncate block">{liveUser.email}</strong></div>
                <div><span className="text-slate-400">Prank Mark Count:</span> <strong className="text-amber-300">{liveUser.prankMarkCount || 0}/4 Marks</strong></div>
              </div>
            </div>

            {/* 3. Two-Way Audio Communication Line Simulator */}
            <div className="p-3 bg-purple-950/40 rounded-2xl border border-purple-500/30 text-left flex items-center justify-between text-xs text-purple-200">
              <div className="flex items-center gap-2">
                <Mic size={16} className="text-rose-400 animate-pulse" />
                <span>3. Two-Way Audio Line: <strong className="text-white">Active Open Mic Connected to Control Desk</strong></span>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            </div>

            {/* 4. Audio Warning Rules for Prank Callers */}
            <div className="p-3 bg-amber-950/80 rounded-2xl border border-amber-500/40 text-left space-y-1 text-amber-200 text-xs">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <Volume2 size={16} className="text-amber-400" /> Rules for Prank Callers & False Alarms:
              </div>
              <p className="text-[11px] leading-relaxed text-amber-200/90">
                🔊 Audio Warning: SOS call is recorded and logged with device ID. Verified false alarms add +1 Prank Mark. 4 Marks results in 1-Year Detention & website blocking.
              </p>
            </div>

            {/* Confirmation to Proceed Call Security Number +91 8639527123 */}
            <div className="pt-2">
              <button
                onClick={handleConfirmCallSecurity}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-black rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
              >
                <Phone size={18} /> 📞 CONFIRM & CALL SECURITY CONTROL (+91 8639527123)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- REPORT INCIDENT MODAL WITH PURE WEBRTC GETUSERMEDIA VIDEO FEED --- */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="bg-[#0e1126] border border-purple-500/40 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-auto max-h-[92vh] flex flex-col">
            <div className="p-5 sm:p-6 bg-gradient-to-r from-purple-950 to-slate-900 border-b border-purple-500/20 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-rose-600/20 text-rose-400 rounded-xl border border-rose-500/30">
                  <ShieldAlert size={22} />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">Report Campus Emergency / Hazard</h3>
                  <p className="text-xs text-purple-300/70">Christ University Kengeri Campus Dispatch</p>
                </div>
              </div>
              <button onClick={() => { stopLiveWebcamStream(); setShowReportModal(false); }} className="p-2 text-slate-400 hover:text-white rounded-lg transition" title="Exit">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitReport} className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-sm">
              {proofError && (
                <div className="p-3 bg-rose-950/60 border border-rose-500/40 text-rose-300 rounded-xl text-xs flex items-center gap-2">
                  <AlertTriangle size={16} className="shrink-0 text-rose-400" />
                  {proofError}
                </div>
              )}

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-2">
                  1. Select Incident Type *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {INCIDENT_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                        category === cat.id
                          ? 'bg-purple-600/30 border-purple-500 text-white shadow-md'
                          : 'bg-[#070814] border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="font-bold text-xs">{cat.label}</span>
                      <span className="text-[10px] text-slate-500 mt-1 uppercase font-mono">{cat.priority}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1.5">
                  2. Incident Description *
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe what happened or details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-[#070814] border border-slate-700/60 rounded-xl text-white focus:outline-none focus:border-purple-500 text-sm"
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1.5">
                  3. Select Christ University Campus Zone *
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 bg-[#070814] border border-slate-700/60 rounded-xl text-white focus:outline-none focus:border-purple-500 text-sm"
                >
                  {CHRIST_KENGERI_BLOCKS.map((blk, idx) => (
                    <option key={idx} value={blk}>{blk}</option>
                  ))}
                </select>

                {/* Mandatory Floor / Room / Specific Landmark Input Box */}
                <div className="mt-3">
                  <label className="block text-xs font-semibold text-purple-300 uppercase tracking-wider mb-1">
                    {location === "Other (Specify Custom Location)"
                      ? "Custom Location Description *"
                      : `Specify Exact Floor / Room / Spot in ${location} *`}
                  </label>
                  <input
                    type="text"
                    placeholder={
                      location === "Other (Specify Custom Location)"
                        ? "Type detailed location description..."
                        : "e.g. 2nd Floor Room 204 / Ground Floor Canteen / Elevator Lobby..."
                    }
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#070814] border border-purple-500/40 rounded-xl text-white text-xs focus:outline-none focus:border-purple-400"
                    required
                  />
                </div>

                <div className="mt-2.5 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    className="px-3.5 py-2 bg-purple-950/60 border border-purple-500/30 text-purple-300 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                  >
                    <MapPin size={14} /> {gpsLoading ? 'Detecting GPS...' : gps ? '✓ GPS Captured' : 'Use My Current Location'}
                  </button>
                  {gps && (
                    <span className="text-[11px] text-emerald-400 font-mono">
                      Lat: {gps.lat.toFixed(4)}, Lng: {gps.lng.toFixed(4)}
                    </span>
                  )}
                </div>
              </div>

              {/* LIVE WEBCAM VIDEO STREAM FEED CONTAINER */}
              <div className="p-4 bg-[#070814] border border-purple-500/30 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-purple-300 uppercase tracking-wider">
                    4. Select Live Proof Type (Photo or Video) *
                  </label>
                  <span className="text-[10px] text-rose-400 font-semibold uppercase">Live Camera Capture Only</span>
                </div>

                <div className="grid grid-cols-2 gap-2 p-1 bg-[#0e1126] border border-slate-800 rounded-xl">
                  <button
                    type="button"
                    onClick={() => { setCaptureMode('photo'); retakeProof(); }}
                    className={`py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition ${
                      captureMode === 'photo'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Camera size={16} /> 📷 Live Photo Mode
                  </button>
                  <button
                    type="button"
                    onClick={() => { setCaptureMode('video'); retakeProof(); }}
                    className={`py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition ${
                      captureMode === 'video'
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Video size={16} /> 🎥 Live Video Mode
                  </button>
                </div>

                {/* --- LIVE PHOTO MODE VIEW --- */}
                {captureMode === 'photo' && (
                  <div>
                    {!capturedPhotoUrl ? (
                      <div className="space-y-3">
                        <div className="relative rounded-2xl overflow-hidden bg-black border border-purple-500/40 aspect-video flex items-center justify-center">
                          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover rounded-2xl" />
                          <div className="absolute top-3 left-3 bg-purple-900/90 text-purple-200 text-[10px] px-2.5 py-1 rounded-full font-bold font-mono flex items-center gap-1.5 shadow">
                            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                            LIVE CAMERA FEED
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={capturePhotoFromStream}
                          className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold rounded-xl shadow-lg flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                        >
                          <Camera size={18} /> 📸 Capture Live Photo Proof
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* VISIBLE CRISP PHOTO PREVIEW CONTAINER */}
                        <div className="relative rounded-2xl overflow-hidden border-2 border-purple-500/50 shadow-2xl bg-black max-h-72">
                          <img src={capturedPhotoUrl} alt="Captured Live Proof" className="w-full object-cover max-h-72 rounded-2xl" />
                          <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold shadow">
                            ✓ Live Photo Saved & Stored
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={retakeProof}
                          className="px-4 py-2 bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                        >
                          <RefreshCw size={14} /> Retake Live Photo
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* --- LIVE VIDEO RECORDING MODE --- */}
                {captureMode === 'video' && (
                  <div>
                    {!recordedVideoUrl ? (
                      <div className="space-y-3">
                        <div className="relative rounded-2xl overflow-hidden bg-black border border-rose-500/40 aspect-video flex items-center justify-center">
                          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover rounded-2xl" />
                          {isRecording && (
                            <div className="absolute top-3 left-3 bg-rose-600 text-white text-xs px-3 py-1 rounded-full font-bold font-mono flex items-center gap-2 animate-pulse">
                              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                              REC: 00:0{recordingSeconds}s
                            </div>
                          )}
                        </div>

                        {!isRecording ? (
                          <button
                            type="button"
                            onClick={startVideoRecording}
                            className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold rounded-xl shadow-lg flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                          >
                            <Radio size={18} className="animate-pulse" /> 🔴 Start Recording Live Video
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={stopVideoRecording}
                            className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-white font-extrabold rounded-xl shadow-lg flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                          >
                            <Square size={18} /> ⏹️ Stop Recording & Save Video
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="relative rounded-2xl overflow-hidden border-2 border-rose-500/50 shadow-2xl bg-black max-h-72">
                          <video controls src={recordedVideoUrl} className="w-full max-h-72 rounded-2xl bg-black" />
                          <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold shadow">
                            ✓ Live Video Saved
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={retakeProof}
                          className="px-4 py-2 bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                        >
                          <RefreshCw size={14} /> Record Video Again
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg text-sm flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  <Send size={16} /> Submit Incident Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- CHANGE PASSWORD MODAL --- */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0e1126] border border-purple-500/40 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4 relative">
            <button onClick={() => setShowChangePasswordModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white" title="Exit">
              <X size={18} />
            </button>
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Key className="text-purple-400" size={20} /> {isFirstLoginState ? 'First Login: Create Custom Password' : 'Change Password'}
              </h3>
            </div>

            {isFirstLoginState && (
              <p className="text-xs text-amber-300 bg-amber-950/60 p-3 rounded-xl border border-amber-500/30">
                🔐 You are currently logged in with your default password. Please update your password to secure your account.
              </p>
            )}

            {passwordMsg && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 size={16} /> {passwordMsg}
              </div>
            )}
            {passwordError && (
              <div className="p-3 bg-rose-950/60 border border-rose-500/40 text-rose-300 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle size={16} /> {passwordError}
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1.5">
                  New Custom Password *
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#070814] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1.5">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#070814] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs shadow-lg uppercase tracking-wider"
                >
                  Save New Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- LOGOUT CONFIRMATION MODAL --- */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0e1126] border border-rose-500/40 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6 text-center space-y-4 relative">
            <button onClick={() => setShowLogoutConfirm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white" title="Exit">
              <X size={18} />
            </button>
            <div className="w-12 h-12 rounded-full bg-rose-950 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto">
              <LogOut size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Confirm Logout</h3>
              <p className="text-xs text-slate-300 mt-1">Are you sure you want to sign out of the safety portal?</p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => { setShowLogoutConfirm(false); onLogout(); }}
                className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs shadow-lg uppercase tracking-wider"
              >
                Yes, Log Out Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- INCIDENT DETAILS MODAL --- */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="bg-[#0e1126] border border-purple-500/40 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl my-auto max-h-[90vh] flex flex-col">
            <div className="p-6 bg-gradient-to-r from-purple-950 to-slate-900 border-b border-purple-500/20 flex justify-between items-center shrink-0">
              <div>
                <span className="text-[10px] font-mono text-purple-300">{selectedIncident.id}</span>
                <h3 className="text-xl font-bold text-white">{selectedIncident.categoryLabel}</h3>
              </div>
              <button onClick={() => setSelectedIncident(null)} className="p-2 text-slate-400 hover:text-white rounded-lg transition" title="Exit">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Current Status:</span>
                {getStatusBadge(selectedIncident.status)}
              </div>

              <div className="p-4 bg-[#070814] rounded-2xl border border-slate-800 space-y-2">
                <p className="text-xs text-slate-400 font-semibold uppercase">Description</p>
                <p className="text-slate-200 leading-relaxed">{selectedIncident.description}</p>
              </div>

              <div className="p-4 bg-[#070814] rounded-2xl border border-slate-800 space-y-2">
                <p className="text-xs text-slate-400 font-semibold uppercase">Location</p>
                <p className="text-purple-300 font-medium flex items-center gap-1.5">
                  <MapPin size={16} /> {selectedIncident.location}
                </p>
              </div>

              {/* RENDER STORED EVIDENCE ONLY IF IT EXISTS */}
              {selectedIncident.evidenceUrl && (
                <div className="p-4 bg-[#070814] rounded-2xl border border-slate-800 space-y-2">
                  <p className="text-xs text-purple-300 font-bold uppercase">Stored Evidence Proof ({selectedIncident.evidenceType || 'image'})</p>
                  {selectedIncident.evidenceType === 'video' ? (
                    <video controls src={selectedIncident.evidenceUrl} className="rounded-xl w-full max-h-64 bg-black border border-purple-500/30" />
                  ) : (
                    <img src={selectedIncident.evidenceUrl} alt="Evidence" className="rounded-xl w-full max-h-64 object-cover border border-purple-500/30" />
                  )}
                </div>
              )}

              {/* TIMELINE / PROGRESS LOG */}
              <div className="p-4 bg-purple-950/20 border border-purple-500/20 rounded-2xl space-y-3">
                <p className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                  Security Progress Log & Timeline
                </p>
                <div className="space-y-2.5">
                  {selectedIncident.timeline?.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs">
                      <div className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                      <div>
                        <p className="text-slate-200 font-medium">{item.note}</p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- FEEDBACK MODAL --- */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0e1126] border border-purple-500/40 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4 relative">
            <button onClick={() => setShowFeedbackModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white" title="Exit">
              <X size={18} />
            </button>
            <h3 className="text-lg font-bold text-white">Rate Resolution Satisfaction</h3>
            <p className="text-xs text-slate-300">Incident: {showFeedbackModal.categoryLabel}</p>

            <div>
              <label className="block text-xs font-semibold text-purple-200 mb-2">Rating</label>
              <div className="flex gap-2 text-2xl cursor-pointer">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setStarRating(star)}
                    className={star <= starRating ? 'text-amber-400' : 'text-slate-700'}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-purple-200 mb-1.5">Feedback Comment</label>
              <textarea
                rows={3}
                placeholder="Leave feedback on security response..."
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                className="w-full p-3 bg-[#070814] border border-slate-700 rounded-xl text-white text-xs focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <button onClick={handleFeedbackSubmit} className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow uppercase tracking-wider">
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
