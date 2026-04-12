import React, { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';

export default function ProtectedRoute({ children }) {
  const auth = useAuth();

  useEffect(() => {
    // If we're not loading, not authenticated, and there's no active login error
    // then trigger the redirect to authenticaton server
    if (!auth.isLoading && !auth.isAuthenticated && !auth.error) {
      auth.signinRedirect();
    }
  }, [auth.isLoading, auth.isAuthenticated, auth.error, auth]);

  if (auth.isLoading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p>Authenticating securely...</p>
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

  if (!auth.isAuthenticated) {
    return (
      <div className="loader-container">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return children;
}
