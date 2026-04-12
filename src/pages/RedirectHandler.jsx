import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { userManager } from "../services/authService";
const RedirectHandler = () => {
  const navigate = useNavigate();
  const callbackProcessed = useRef(false);
  useEffect(() => {
    if (callbackProcessed.current) return;
    userManager.getUser().then((user) => {
      if (user) {
        navigate("/", { replace: true });
        return;
      }
      callbackProcessed.current = true;
      userManager.signinCallback().then(() => {
        navigate("/", { replace: true });
      }).catch((err) => {
        console.error("Error handling redirect", err);
        userManager.getUser().then((u) => {
          if (u) navigate("/", { replace: true });
          else navigate("/login", { replace: true });
        });
      });
    });
  }, [navigate]);
  return /* @__PURE__ */ jsx("div", { style: { height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f8f9fa" }, children: /* @__PURE__ */ jsxs("div", { style: { textAlign: "center" }, children: [
    /* @__PURE__ */ jsx(
      "img",
      {
        src: "/pnb_logo.png",
        alt: "PNB Logo",
        style: { height: "80px", marginBottom: "32px" }
      }
    ),
    /* @__PURE__ */ jsx("h2", { style: { color: "#800000", fontSize: "2rem", fontWeight: "800", margin: 0 }, children: "Processing Login" }),
    /* @__PURE__ */ jsx("p", { style: { color: "#6c757d", marginTop: "12px", fontSize: "16px" }, children: "Please wait while we secure your session..." }),
    /* @__PURE__ */ jsxs("div", { style: { marginTop: "40px", display: "flex", justifyContent: "center" }, children: [
      /* @__PURE__ */ jsx("div", { style: {
        width: "48px",
        height: "48px",
        border: "4px solid #f3f3f3",
        borderTop: "4px solid #800000",
        borderRadius: "50%",
        animation: "spin 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite"
      } }),
      /* @__PURE__ */ jsx("style", { children: `
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          ` })
    ] })
  ] }) });
};
var RedirectHandler_default = RedirectHandler;
export {
  RedirectHandler_default as default
};
