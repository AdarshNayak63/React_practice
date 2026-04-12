import { jsx, jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./core/providers/AuthProvider.jsx";
import Layout from "./core/layout/AppLayout.jsx";
import Login from "./features/auth/pages/LoginPage.jsx";
import RedirectHandler from "./features/auth/pages/AuthRedirectPage.jsx";
import Dashboard from "./features/dashboard/pages/DashboardHome.jsx";
import Reports from "./features/reports/pages/ReportsPage.jsx";
import Soundbox from "./features/soundbox/pages/SoundboxLanguagePage.jsx";
import QRCodePage from "./features/qr/pages/QRCodeDetailsPage.jsx";
import Support from "./features/support/pages/SupportDeskPage.jsx";
import ErrorBoundary from "./core/boundary/AppErrorBoundary.jsx";
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return /* @__PURE__ */ jsxs("div", { style: { height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }, children: [
      /* @__PURE__ */ jsx("div", { style: { width: "40px", height: "40px", border: "4px solid #f3f3f3", borderTop: "4px solid #800000", borderRadius: "50%", animation: "spin 1s linear infinite" } }),
      /* @__PURE__ */ jsx("style", { children: `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }` })
    ] });
  }
  if (!user) {
    return /* @__PURE__ */ jsx(Navigate, { to: "/login", replace: true });
  }
  return /* @__PURE__ */ jsx(Layout, { children });
};
import { VpaProvider } from "./core/providers/VpaProvider.jsx";
function App() {
  return /* @__PURE__ */ jsx(Router, { children: /* @__PURE__ */ jsx(ErrorBoundary, { children: /* @__PURE__ */ jsx(AuthProvider, { children: /* @__PURE__ */ jsx(VpaProvider, { children: /* @__PURE__ */ jsxs(Routes, { children: [
    /* @__PURE__ */ jsx(Route, { path: "/login", element: /* @__PURE__ */ jsx(Login, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/redirected", element: /* @__PURE__ */ jsx(RedirectHandler, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/", element: /* @__PURE__ */ jsx(ProtectedRoute, { children: /* @__PURE__ */ jsx(Dashboard, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/reports", element: /* @__PURE__ */ jsx(ProtectedRoute, { children: /* @__PURE__ */ jsx(Reports, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/soundbox", element: /* @__PURE__ */ jsx(ProtectedRoute, { children: /* @__PURE__ */ jsx(Soundbox, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/qr", element: /* @__PURE__ */ jsx(ProtectedRoute, { children: /* @__PURE__ */ jsx(QRCodePage, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/support", element: /* @__PURE__ */ jsx(ProtectedRoute, { children: /* @__PURE__ */ jsx(Support, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(Navigate, { to: "/", replace: true }) })
  ] }) }) }) }) });
}
var App_default = App;
export {
  App_default as default
};
