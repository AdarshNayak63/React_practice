import { jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from "react";
import { userManager } from "../services/authService";
const AuthContext = createContext(void 0);
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    userManager.getUser().then((user2) => {
      setUser(user2);
      setLoading(false);
    });
    const onUserLoaded = (user2) => setUser(user2);
    const onUserUnloaded = () => setUser(null);
    userManager.events.addUserLoaded(onUserLoaded);
    userManager.events.addUserUnloaded(onUserUnloaded);
    return () => {
      userManager.events.removeUserLoaded(onUserLoaded);
      userManager.events.removeUserUnloaded(onUserUnloaded);
    };
  }, []);
  const login = () => userManager.signinRedirect();
  const logout = () => userManager.signoutRedirect();
  return /* @__PURE__ */ jsx(AuthContext.Provider, { value: { user, loading, login, logout }, children });
};
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
export {
  AuthProvider,
  useAuth
};
