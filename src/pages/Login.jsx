import { jsx, jsxs } from "react/jsx-runtime";
import { LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
const Login = () => {
  const { login } = useAuth();
  return /* @__PURE__ */ jsx(
    "div",
    {
      style: {
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8f9fa"
      },
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          style: {
            backgroundColor: "white",
            padding: "48px",
            borderRadius: "12px",
            border: "1px solid #eee",
            maxWidth: "400px",
            width: "90%",
            textAlign: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
          },
          children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: "/pnb_logo.png",
                alt: "PNB Logo",
                style: { width: "180px", height: "auto", marginBottom: "32px" }
              }
            ),
            /* @__PURE__ */ jsx("h1", { style: { color: "#1A1A1A", fontSize: "20px", fontWeight: "800", marginBottom: "8px" }, children: "Merchant Portal" }),
            /* @__PURE__ */ jsx("p", { style: { color: "#666", marginBottom: "40px", fontSize: "13px", lineHeight: 1.5 }, children: "Login to manage your business transactions and Soundbox alerts." }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => login(),
                style: {
                  width: "100%",
                  backgroundColor: "#A01E35",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "700",
                  padding: "14px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px"
                },
                children: [
                  /* @__PURE__ */ jsx(LogIn, { size: 18 }),
                  "Sign in with PNB Admin"
                ]
              }
            ),
            /* @__PURE__ */ jsx("p", { style: { marginTop: "32px", color: "#999", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }, children: "Punjab National Bank" })
          ]
        }
      )
    }
  );
};
var Login_default = Login;
export {
  Login_default as default
};
