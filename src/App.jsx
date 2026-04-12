import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from 'react-oidc-context';
import { authConfig, ROUTES } from './authConfig';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import QRDetails from './pages/QRDetails';
import LanguageUpdate from './pages/LanguageUpdate';
import { setupInterceptors } from './services/api';

// OIDC Callback Handler Component
const CallbackHandler = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // The OIDC client will automatically handle the callback
    // Once authentication is complete, force redirect to localhost dashboard
    if (auth.isAuthenticated) {
      // Force localhost redirect regardless of current hostname
      window.location.href = 'http://localhost:3000/dashboard';
    }
  }, [auth.isAuthenticated, navigate]);

  if (auth.isLoading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p>Processing authentication...</p>
      </div>
    );
  }

  if (auth.error) {
    return (
      <div className="loader-container">
        <h2>Authentication Error</h2>
        <p className="text-muted">{auth.error.message}</p>
        <button className="glass-btn" onClick={() => auth.signinRedirect()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p>Redirecting to dashboard...</p>
    </div>
  );
};

// This component bridges the Router navigation with OIDC redirects.
const AuthBridge = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we just signed in (OIDC redirect back with code)
    if (auth.isAuthenticated) {
      // Set the token inside Axios automatically.
      // We pass a function so Axios always gets the fresh token.
      setupInterceptors(async () => auth.user?.access_token);
    }
  }, [auth.isAuthenticated, auth.user]);

  // Optional: OIDC provides events. We can let OIDC client handle the url cleanup.
  useEffect(() => {
    return auth.events.addUserLoaded((user) => {
       console.log("User Loaded");
    });
  }, [auth.events]);

  return (
    <Routes>
      {/* OIDC Callback Route */}
      <Route path={ROUTES.OAUTH_REDIRECT} element={<CallbackHandler />} />
      
      {/* Protected Routes */}
      <Route path={ROUTES.DASHBOARD} element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      
      {/* Other dummy routes */}
      <Route path={ROUTES.TRANSACTIONS} element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
      <Route path={ROUTES.QR_DETAILS} element={<ProtectedRoute><QRDetails /></ProtectedRoute>} />
      <Route path={ROUTES.LANGUAGE_UPDATE} element={<ProtectedRoute><LanguageUpdate /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/support" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      
      {/* Fallback */}
      <Route path="*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    </Routes>
  );
};

export default function App() {
  const onSigninCallback = (user) => {
    // Force redirect to localhost dashboard after authentication
    // Remove any production redirect and force localhost
    if (window.location.hostname !== 'localhost') {
      window.location.href = 'http://localhost:3000/dashboard';
    } else {
      // Clean URL and use React Router for localhost
      window.history.replaceState({}, document.title, '/dashboard');
      window.location.reload();
    }
  };

  return (
    <AuthProvider {...authConfig} onSigninCallback={onSigninCallback}>
      <Router>
        <AuthBridge />
      </Router>
    </AuthProvider>
  );
}
