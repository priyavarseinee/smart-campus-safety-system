import { PRESET_STUDENTS, CHRIST_KENGERI_BLOCKS } from './mockData';

const LOCAL_INCIDENTS_KEY = 'scs_incidents_v10';
const LOCAL_USERS_KEY = 'scs_students_v10';
const LOCAL_SOS_LOGS_KEY = 'scs_sos_logs_v10';
const SESSION_KEY = 'scs_active_session_v10';

// Purge obsolete mock history keys from previous versions
try {
  ['scs_incidents_v9', 'scs_incidents_v8', 'scs_incidents_v7', 'scs_sos_logs_v9', 'scs_sos_logs_v8'].forEach(k => localStorage.removeItem(k));
} catch (e) {}

// Compute robust 3-letter default password by ignoring single-letter initials
export const computeDefaultPassword = (fullName) => {
  if (!fullName) return 'STU';
  const parts = fullName.trim().split(/\s+/);
  const mainPart = parts.find(p => p.replace(/[^a-zA-Z]/g, '').length >= 3) || parts[0] || fullName;
  const clean3 = mainPart.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase();
  if (clean3.length === 3) return clean3;
  
  const fullClean = fullName.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase();
  return fullClean.length === 3 ? fullClean : 'STU';
};

// Format pre-seeded 57 student accounts with complete dataset fields
const formattedPreseededStudents = PRESET_STUDENTS.map(s => {
  const defaultPass = computeDefaultPassword(s.name);
  return {
    slNo: s.slNo,
    regNo: s.regNo,
    name: s.name,
    email: s.email,
    phone: s.phone,
    className: s.className || '4BTAD - AI & DS',
    dept: s.dept || 'AI & DS',
    course: s.course || 'B.Tech',
    year: s.year || '2024-2028',
    prankMarkCount: 0,
    accountStatus: 'ACTIVE', // 'ACTIVE' or 'DETAINED / ACCESS BLOCKED'
    detentionStatus: 'Active Student', // 'Active Student' or 'Detained for 1 Year'
    warningHistory: [],
    sosIncidentHistory: [],
    defaultPassword: defaultPass,
    bloodGroup: 'O+ Positive',
    medicalNotes: 'Standard Student Health Profile'
  };
});

const initializeStorage = () => {
  if (!localStorage.getItem(LOCAL_INCIDENTS_KEY)) {
    localStorage.setItem(LOCAL_INCIDENTS_KEY, JSON.stringify([]));
  }
  if (!localStorage.getItem(LOCAL_USERS_KEY)) {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(formattedPreseededStudents));
  }
  if (!localStorage.getItem(LOCAL_SOS_LOGS_KEY)) {
    localStorage.setItem(LOCAL_SOS_LOGS_KEY, JSON.stringify([]));
  }
};

initializeStorage();

// --- CLOUD REALTIME DB SYNC HELPER ---
const getCloudApiUrl = (path) => {
  const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname.includes('192.168.'));
  return isLocal ? `http://${window.location.hostname}:3001${path}` : path;
};

export const syncCloudIncidents = async () => {
  try {
    const res = await fetch(getCloudApiUrl('/api/incidents'));
    const data = await res.json();
    if (data && data.incidents && Array.isArray(data.incidents)) {
      const local = getIncidents();
      const map = new Map();
      [...data.incidents, ...local].forEach(item => {
        if (!map.has(item.id)) map.set(item.id, item);
      });
      const merged = Array.from(map.values());
      localStorage.setItem(LOCAL_INCIDENTS_KEY, JSON.stringify(merged));
      return merged;
    }
  } catch (e) {}
  return getIncidents();
};

export const pushCloudIncidents = async (incidents) => {
  try {
    await fetch(getCloudApiUrl('/api/incidents'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ incidents })
    });
  } catch (e) {}
};

export const syncCloudStudents = async () => {
  try {
    const res = await fetch(getCloudApiUrl('/api/students'));
    const data = await res.json();
    if (data && data.students && Array.isArray(data.students)) {
      const local = getStoredStudents();
      const map = new Map();
      [...data.students, ...local].forEach(s => {
        const existing = map.get(s.regNo);
        if (!existing || (s.passwordChanged && !existing.passwordChanged)) {
          map.set(s.regNo, s);
        }
      });
      const merged = Array.from(map.values());
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(merged));
      return merged;
    }
  } catch (e) {}
  return getStoredStudents();
};

export const pushCloudStudents = async (students) => {
  try {
    await fetch(getCloudApiUrl('/api/students'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ students })
    });
  } catch (e) {}
};

export const getStoredStudents = () => {
  try {
    const data = localStorage.getItem(LOCAL_USERS_KEY);
    return data ? JSON.parse(data) : formattedPreseededStudents;
  } catch (err) {
    return formattedPreseededStudents;
  }
};

export const saveStoredStudents = (students) => {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(students));
  pushCloudStudents(students);
};

export const getStudentByRegNo = (regNo) => {
  const students = getStoredStudents();
  return students.find(s => s.regNo.toLowerCase() === (regNo || '').toLowerCase() || s.name.toLowerCase() === (regNo || '').toLowerCase());
};

export const registerNewStudent = (dataOrRegNo, name, dept, phone) => {
  let studentObj = {};
  if (typeof dataOrRegNo === 'object' && dataOrRegNo !== null) {
    studentObj = dataOrRegNo;
  } else {
    studentObj = { regNo: dataOrRegNo, name, dept, phone };
  }

  const students = getStoredStudents();
  const regNoExists = students.some(s => s.regNo === studentObj.regNo);
  if (regNoExists) {
    return { success: false, message: `Student with Register No ${studentObj.regNo} already exists in registry.` };
  }

  const defaultPass = computeDefaultPassword(studentObj.name);

  const newStudent = {
    slNo: students.length + 1,
    regNo: studentObj.regNo,
    name: studentObj.name,
    email: studentObj.email || `${studentObj.name.toLowerCase().replace(/\s+/g, '.')}@btech.christuniversity.in`,
    phone: studentObj.phone || '9876543210',
    className: studentObj.className || '4BTAD - AI & DS',
    dept: studentObj.dept || 'AI & DS',
    course: studentObj.course || 'B.Tech',
    year: studentObj.year || '2024-2028',
    prankMarkCount: 0,
    accountStatus: 'ACTIVE',
    detentionStatus: 'Active Student',
    warningHistory: [],
    sosIncidentHistory: [],
    id: `STU-${Date.now().toString().slice(-4)}`,
    defaultPassword: defaultPass,
    bloodGroup: 'B+ Positive',
    medicalNotes: 'Standard Student Health Profile'
  };

  const updated = [newStudent, ...students];
  saveStoredStudents(updated);
  return { success: true, student: newStudent, defaultPass };
};

export const addNewStudentBySecurity = registerNewStudent;

export const updateStudentPassword = (regNo, newPassword) => {
  const students = getStoredStudents();
  const idx = students.findIndex(s => s.regNo === regNo);
  if (idx !== -1) {
    students[idx].password = newPassword;
    students[idx].passwordChanged = true;
    students[idx].isFirstLogin = false;
    saveStoredStudents(students);
    
    // Update active session user if currently logged in
    const session = getCurrentSessionUser();
    if (session && session.regNo === regNo) {
      session.password = newPassword;
      session.isFirstLogin = false;
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
    return true;
  }
  return false;
};

// Reset Password (Forgot Password)
export const resetStudentPassword = (identifier, newPassword) => {
  const cleanId = (identifier || '').trim().toLowerCase();
  const students = getStoredStudents();
  let student = students.find(s => s.regNo.toLowerCase() === cleanId || s.name.toLowerCase() === cleanId || (s.email && s.email.toLowerCase() === cleanId));
  
  if (!student) {
    const regRes = registerNewStudent({ regNo: identifier, name: identifier });
    if (regRes.success) {
      student = regRes.student;
    } else {
      const currentList = getStoredStudents();
      student = currentList.find(s => s.regNo.toLowerCase() === cleanId);
    }
  }

  if (student) {
    if (student.accountStatus === 'DETAINED / ACCESS BLOCKED' || student.prankMarkCount >= 4) {
      return { success: false, isBlocked: true, message: 'ACCOUNT BLOCKED: You have been Detained for 1 Year due to reaching 4 Prank SOS Marks. Password reset is disabled.' };
    }

    student.password = newPassword;
    student.passwordChanged = true;
    student.isFirstLogin = false;
    saveStoredStudents(getStoredStudents().map(s => s.regNo === student.regNo ? student : s));
    return { success: true, message: `Password for ${student.name} (${student.regNo}) reset successfully!` };
  }
  return { success: false, message: 'Student Register Number, Email, or Name not found in registry.' };
};

// Generic Authentication Function with Strict 4-Mark Blocked Account Rule
export const authenticateUser = (identifier, password, role) => {
  const cleanId = (identifier || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  if (!cleanId || !cleanPass) {
    return { success: false, message: 'Invalid username or password.' };
  }

  // Security Guard Login
  if (role === 'security') {
    if (cleanId === 'nnp' && cleanPass === 'security@123') {
      const user = {
        name: 'Security Officer NNP',
        role: 'security',
        badgeNo: 'SEC-101',
        token: `SCS-TOKEN-${Date.now()}`,
        expiresAt: Date.now() + 15 * 60 * 1000
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false, message: 'Invalid username or password.' };
  }

  // Admin Login
  if (role === 'admin') {
    if (cleanId === 'admin' && cleanPass === 'admin@123') {
      const user = {
        name: 'Campus Administrator',
        role: 'admin',
        token: `SCS-TOKEN-${Date.now()}`,
        expiresAt: Date.now() + 15 * 60 * 1000
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false, message: 'Invalid username or password.' };
  }

  // Student Login with Mandatory Detained / Access Blocked Enforcement
  if (role === 'student') {
    const students = getStoredStudents();
    const student = students.find(
      s => s.regNo.toLowerCase() === cleanId || s.name.toLowerCase() === cleanId || (s.email && s.email.toLowerCase() === cleanId)
    );

    if (student) {
      // Check 4-Mark Disciplinary Action & Website Blocking
      if (student.accountStatus === 'DETAINED / ACCESS BLOCKED' || (student.prankMarkCount || 0) >= 4) {
        return {
          success: false,
          isBlocked: true,
          message: `ACCOUNT BLOCKED: ${student.name} (${student.regNo}) has been DETAINED FOR 1 YEAR due to reaching 4 Prank SOS Marks. Access to the Campus Safety Website is disabled.`
        };
      }

      const defaultPass = (student.defaultPassword || computeDefaultPassword(student.name)).toUpperCase();
      const isCustomPasswordSet = !!student.passwordChanged && !!student.password;

      const isPasswordValid = isCustomPasswordSet
        ? student.password === cleanPass
        : (cleanPass === defaultPass || cleanPass === defaultPass.toLowerCase());

      if (isPasswordValid) {
        const user = {
          slNo: student.slNo,
          name: student.name,
          regNo: student.regNo,
          email: student.email,
          phone: student.phone,
          className: student.className || '4BTAD - AI & DS',
          dept: student.dept || 'AI & DS',
          course: student.course || 'B.Tech',
          year: student.year || '2024-2028',
          prankMarkCount: student.prankMarkCount || 0,
          accountStatus: student.accountStatus || 'ACTIVE',
          detentionStatus: student.detentionStatus || 'Active Student',
          warningHistory: student.warningHistory || [],
          bloodGroup: student.bloodGroup || 'O+ Positive',
          medicalNotes: student.medicalNotes || 'Standard Student Health Profile',
          role: 'student',
          isFirstLogin: !isCustomPasswordSet,
          token: `SCS-TOKEN-${Date.now()}`,
          expiresAt: Date.now() + 15 * 60 * 1000
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
        return { success: true, user };
      }
    }
    return { success: false, message: 'Invalid username or password.' };
  }

  return { success: false, message: 'Invalid username or password.' };
};

export const loginUser = authenticateUser;

export const getCurrentSessionUser = () => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw);
    if (Date.now() > user.expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }

    // Verify student is not blocked dynamically
    if (user.role === 'student' && user.regNo) {
      const student = getStudentByRegNo(user.regNo);
      if (student && (student.accountStatus === 'DETAINED / ACCESS BLOCKED' || (student.prankMarkCount || 0) >= 4)) {
        localStorage.removeItem(SESSION_KEY);
        return { ...user, isBlocked: true, accountStatus: 'DETAINED / ACCESS BLOCKED' };
      }
      if (student) {
        // Keep session synchronized with latest database state
        user.prankMarkCount = student.prankMarkCount || 0;
        user.accountStatus = student.accountStatus || 'ACTIVE';
        user.detentionStatus = student.detentionStatus || 'Active Student';
        user.warningHistory = student.warningHistory || [];
      }
    }

    return user;
  } catch (err) {
    return null;
  }
};

export const logoutSessionUser = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const logoutUser = logoutSessionUser;

// --- DEDICATED SOS LOG MANAGEMENT ---
export const getSOSLogs = () => {
  try {
    const data = localStorage.getItem(LOCAL_SOS_LOGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    return [];
  }
};

export const createSOSLogEntry = (sosData) => {
  const sosLogs = getSOSLogs();
  const now = new Date();
  
  // Auto-retrieve student's registered dataset record
  const student = getStudentByRegNo(sosData.regNo || sosData.reportedBy);

  const newLog = {
    sosLogId: `SOS-LOG-${Date.now().toString().slice(-6)}`,
    incidentId: sosData.incidentId || `INC-${Date.now().toString().slice(-5)}`,
    studentName: student ? student.name : (sosData.reportedBy || 'Student'),
    regNo: student ? student.regNo : (sosData.regNo || 'UNKNOWN'),
    className: student ? (student.className || '4BTAD - AI & DS') : '4BTAD - AI & DS',
    phone: student ? (student.phone || '9876543210') : (sosData.phone || '9876543210'),
    email: student ? (student.email || '') : '',
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    timestamp: now.toISOString(),
    status: 'Pending Verification', // 'Pending Verification', 'Genuine Emergency', 'Prank/False SOS'
    securityPersonnel: 'Security Guard NNP',
    verificationType: 'Pending Verification', // 'Pending Verification', 'Genuine', 'Prank'
    penaltyStatus: 'None',
    prankMarkCountAtCall: student ? (student.prankMarkCount || 0) : 0,
    penaltyApplied: false,
    gps: sosData.gps || { lat: 12.8631, lng: 77.4379 },
    location: sosData.location || 'Christ University Kengeri Campus'
  };

  const updated = [newLog, ...sosLogs];
  localStorage.setItem(LOCAL_SOS_LOGS_KEY, JSON.stringify(updated));

  // Also record in student's SOS Incident History
  if (student) {
    const students = getStoredStudents();
    const sIdx = students.findIndex(s => s.regNo === student.regNo);
    if (sIdx !== -1) {
      students[sIdx].sosIncidentHistory = students[sIdx].sosIncidentHistory || [];
      students[sIdx].sosIncidentHistory.unshift({
        sosLogId: newLog.sosLogId,
        incidentId: newLog.incidentId,
        timestamp: newLog.timestamp,
        date: newLog.date,
        time: newLog.time,
        status: newLog.status
      });
      saveStoredStudents(students);
    }
  }

  return newLog;
};

// Security Personnel Verification Function with Prank Mark Addition & 4-Mark Disciplinary Action
export const verifySOSIncident = (sosLogId, verificationType, securityOfficer = 'Security Guard NNP') => {
  const sosLogs = getSOSLogs();
  const logIdx = sosLogs.findIndex(l => l.sosLogId === sosLogId || l.incidentId === sosLogId);
  if (logIdx === -1) return { success: false, message: 'SOS Log record not found.' };

  const sosLog = sosLogs[logIdx];
  const now = new Date().toISOString();

  // Prevent duplicate penalty points on the same SOS call
  if (sosLog.penaltyApplied) {
    return { success: false, message: 'Penalty/Verification already recorded for this SOS call.' };
  }

  const students = getStoredStudents();
  const sIdx = students.findIndex(s => s.regNo === sosLog.regNo);

  if (verificationType === 'Prank') {
    if (sIdx !== -1) {
      const student = students[sIdx];
      const newMarkCount = (student.prankMarkCount || 0) + 1;
      student.prankMarkCount = newMarkCount;

      const warningEntry = {
        markNumber: newMarkCount,
        sosLogId: sosLog.sosLogId,
        incidentId: sosLog.incidentId,
        timestamp: now,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        issuedBy: securityOfficer,
        reason: 'Verified Prank / False Emergency SOS Call'
      };

      student.warningHistory = student.warningHistory || [];
      student.warningHistory.unshift(warningEntry);

      // Check 4-Mark Disciplinary Threshold: Detained for 1 Year + Website Access Blocked
      if (newMarkCount >= 4) {
        student.accountStatus = 'DETAINED / ACCESS BLOCKED';
        student.detentionStatus = 'Detained for 1 Year';
      }

      saveStoredStudents(students);

      sosLog.status = 'Prank/False SOS';
      sosLog.verificationType = 'Prank';
      sosLog.penaltyApplied = true;
      sosLog.currentPrankMarkCount = newMarkCount;
      sosLog.securityPersonnel = securityOfficer;
      sosLog.penaltyStatus = newMarkCount >= 4
        ? '⚠️ DETAINED FOR 1 YEAR (+1 Prank Mark Added, Reached 4-Mark Limit)'
        : `Warning Issued +1 Prank Mark (Total Marks: ${newMarkCount}/4)`;
    }
  } else if (verificationType === 'Genuine') {
    sosLog.status = 'Genuine Emergency';
    sosLog.verificationType = 'Genuine';
    sosLog.penaltyApplied = true;
    sosLog.securityPersonnel = securityOfficer;
    sosLog.penaltyStatus = 'No Mark Added (Verified Genuine Emergency)';
    if (sIdx !== -1) {
      sosLog.currentPrankMarkCount = students[sIdx].prankMarkCount || 0;
    }
  }

  sosLogs[logIdx] = sosLog;
  localStorage.setItem(LOCAL_SOS_LOGS_KEY, JSON.stringify(sosLogs));

  // Also update corresponding Incident record if it exists
  const incidents = getIncidents();
  const incIdx = incidents.findIndex(i => i.id === sosLog.incidentId);
  if (incIdx !== -1) {
    incidents[incIdx].sosVerification = {
      status: sosLog.status,
      verificationType: sosLog.verificationType,
      penaltyStatus: sosLog.penaltyStatus,
      verifiedBy: securityOfficer,
      timestamp: now
    };
    localStorage.setItem(LOCAL_INCIDENTS_KEY, JSON.stringify(incidents));
  }

  return { success: true, sosLog };
};

// Helper to purge incomplete legacy mock history items
export const purgeIncompleteStep3Entries = () => {
  try {
    const raw = localStorage.getItem(LOCAL_INCIDENTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Filter out old mock incidents (INC-91924 and INC-62768)
      const cleaned = parsed.filter(inc => 
        inc.id !== 'INC-91924' && 
        inc.id !== 'INC-62768'
      );
      if (cleaned.length !== parsed.length) {
        localStorage.setItem(LOCAL_INCIDENTS_KEY, JSON.stringify(cleaned));
      }
      return cleaned;
    }
  } catch (e) {}
  return [];
};

// Incidents Management
export const getIncidents = () => {
  try {
    const cleaned = purgeIncompleteStep3Entries();
    const data = localStorage.getItem(LOCAL_INCIDENTS_KEY);
    const list = data ? JSON.parse(data) : cleaned;
    return list.filter(inc => 
      inc.id !== 'INC-91924' && 
      inc.id !== 'INC-62768'
    );
  } catch (err) {
    return [];
  }
};

export const createIncident = (incidentData) => {
  const incidents = getIncidents();
  const now = new Date().toISOString();
  
  // Auto-retrieve student's registered database record
  const student = getStudentByRegNo(incidentData.regNo || incidentData.reportedBy);

  const newIncident = {
    id: `INC-${Date.now().toString().slice(-5)}`,
    ...incidentData,
    studentName: student ? student.name : incidentData.reportedBy,
    regNo: student ? student.regNo : incidentData.regNo,
    className: student ? (student.className || '4BTAD - AI & DS') : '4BTAD - AI & DS',
    phone: student ? (student.phone || '9876543210') : '9876543210',
    email: student ? (student.email || '') : '',
    status: 'REPORTED',
    createdAt: now,
    stepTimestamps: {
      step1: now,
      step2: null,
      step3: null,
      step4: null
    },
    timeline: [
      {
        step: 1,
        status: 'REPORTED',
        note: 'Incident reported by student with live evidence.',
        timestamp: now
      }
    ]
  };

  const updated = [newIncident, ...incidents];
  localStorage.setItem(LOCAL_INCIDENTS_KEY, JSON.stringify(updated));
  pushCloudIncidents(updated);

  // If incident is an SOS Quick Emergency or has high priority SOS tag, automatically create an SOS Log Entry!
  if (incidentData.categoryLabel === 'SOS QUICK EMERGENCY' || incidentData.type === 'medical' || incidentData.type === 'threat' || incidentData.isSOS) {
    createSOSLogEntry({
      incidentId: newIncident.id,
      regNo: newIncident.regNo,
      reportedBy: newIncident.studentName,
      phone: newIncident.phone,
      gps: newIncident.gps,
      location: newIncident.location
    });
  }

  return newIncident;
};

export const updateIncidentStatus = (incidentId, newStatus, extraData = {}) => {
  const incidents = getIncidents();
  const idx = incidents.findIndex(i => i.id === incidentId);
  if (idx !== -1) {
    const now = new Date().toISOString();
    const inc = incidents[idx];
    const currentStepIndex = extraData.currentStepIndex !== undefined ? extraData.currentStepIndex : (inc.currentStepIndex || 0);

    const updatedStepTimestamps = {
      ...(inc.stepTimestamps || {}),
      [`step${currentStepIndex + 1}`]: now
    };

    let totalDurationMinutes = null;
    if (newStatus === 'RESOLVED' || currentStepIndex === 3) {
      const startTime = new Date(inc.createdAt).getTime();
      const endTime = new Date(now).getTime();
      totalDurationMinutes = Math.max(0.5, ((endTime - startTime) / (1000 * 60))).toFixed(1);
    }

    const updatedTimeline = [
      ...(inc.timeline || []),
      {
        step: currentStepIndex + 1,
        status: newStatus,
        note: extraData.note || `Step ${currentStepIndex + 1} progress updated.`,
        timestamp: now
      }
    ];

    incidents[idx] = {
      ...incidents[idx],
      status: newStatus,
      currentStepIndex,
      stepTimestamps: updatedStepTimestamps,
      totalDurationMinutes: totalDurationMinutes || inc.totalDurationMinutes,
      ...extraData,
      timeline: updatedTimeline
    };

    localStorage.setItem(LOCAL_INCIDENTS_KEY, JSON.stringify(incidents));
    pushCloudIncidents(incidents);
    return incidents[idx];
  }
  return null;
};

export const submitIncidentFeedback = (incidentId, rating, comment) => {
  const incidents = getIncidents();
  const idx = incidents.findIndex(i => i.id === incidentId);
  if (idx !== -1) {
    incidents[idx].feedback = {
      rating,
      comment,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(LOCAL_INCIDENTS_KEY, JSON.stringify(incidents));
    return incidents[idx];
  }
  return null;
};
