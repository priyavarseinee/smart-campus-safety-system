import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import StudentDashboard from './components/StudentDashboard';
import SecurityDashboard from './components/SecurityDashboard';
import AdminDashboard from './components/AdminDashboard';
import { getCurrentSessionUser, logoutUser } from './services/firebaseConfig';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {
    const sessionUser = getCurrentSessionUser();
    if (sessionUser) {
      setCurrentUser(sessionUser);
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-[#070814] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">
      {!currentUser ? (
        <>
          <Login
            onLoginSuccess={handleLoginSuccess}
            onOpenRegister={() => setShowRegisterModal(true)}
          />
          <Register
            isOpen={showRegisterModal}
            onClose={() => setShowRegisterModal(false)}
            onRegisterSuccess={() => setShowRegisterModal(false)}
          />
        </>
      ) : currentUser.role === 'student' ? (
        <StudentDashboard
          user={currentUser}
          onLogout={handleLogout}
        />
      ) : currentUser.role === 'security' ? (
        <SecurityDashboard
          user={currentUser}
          onLogout={handleLogout}
        />
      ) : (
        <AdminDashboard
          user={currentUser}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
