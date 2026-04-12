import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  QrCode,
  Speaker,
  HelpCircle,
  LogOut,
  FileText,
  Menu
} from "lucide-react";
import { useAuth } from "../providers/AuthProvider.jsx";
import { useVpa } from "../providers/VpaProvider.jsx";
const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { selectedVpa } = useVpa();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const menuItems = [
    { name: "Dashboard", path: "/", icon: /* @__PURE__ */ jsx(LayoutDashboard, { size: 18 }) },
    { name: "Transaction Reports", path: "/reports", icon: /* @__PURE__ */ jsx(FileText, { size: 18 }) },
    { name: "QR Details", path: "/qr", icon: /* @__PURE__ */ jsx(QrCode, { size: 18 }) },
    { name: "Language Update", path: "/soundbox", icon: /* @__PURE__ */ jsx(Speaker, { size: 18 }) },
    { name: "Help & Support", path: "/support", icon: /* @__PURE__ */ jsx(HelpCircle, { size: 18 }) }
  ];
  if (!user) return /* @__PURE__ */ jsx(Fragment, { children });
  return /* @__PURE__ */ jsxs("div", { style: { display: "flex", height: "100vh", width: "100vw", backgroundColor: "var(--bg-app)", overflow: "hidden" }, children: [
    /* @__PURE__ */ jsxs("aside", { style: {
      width: "var(--sidebar-w)",
      backgroundColor: "white",
      display: "flex",
      flexDirection: "column",
      zIndex: 10,
      boxShadow: "2px 0 8px rgba(0,0,0,0.02)"
    }, children: [
      /* @__PURE__ */ jsx("div", { style: {
        height: "48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderBottom: "1px solid #f0f0f0",
        flexShrink: 0
      }, children: /* @__PURE__ */ jsx(
        "img",
        {
          src: "/pnb_logo.png",
          alt: "PNB Logo",
          style: { width: "100px", height: "auto", objectFit: "contain" }
        }
      ) }),
      /* @__PURE__ */ jsx("nav", { style: { flex: 1, padding: "16px 16px 0", overflowY: "auto" }, children: /* @__PURE__ */ jsx("ul", { style: { listStyle: "none", padding: 0 }, children: menuItems.map((item) => /* @__PURE__ */ jsx("li", { style: { margin: "2px 14px" }, children: /* @__PURE__ */ jsxs(
        NavLink,
        {
          to: item.path,
          style: ({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 16px",
            borderRadius: "6px",
            textDecoration: "none",
            fontSize: "13px",
            fontWeight: "600",
            transition: "all 0.15s ease",
            color: isActive ? "white" : "#666",
            backgroundColor: isActive ? "var(--primary-pnb)" : "transparent"
          }),
          children: [
            /* @__PURE__ */ jsx("span", { style: { display: "flex", alignItems: "center" }, children: item.icon }),
            item.name
          ]
        }
      ) }, item.name)) }) }),
      /* @__PURE__ */ jsx("div", { style: { padding: "16px 14px", borderTop: "1px solid #f0f0f0" }, children: /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => {
            logout();
          },
          style: {
            display: "flex",
            alignItems: "center",
            gap: "12px",
            width: "100%",
            padding: "12px 16px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "transparent",
            color: "#666",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "13px"
          },
          children: [
            /* @__PURE__ */ jsx(LogOut, { size: 18 }),
            "Sign Out"
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxs("main", { style: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }, children: [
      /* @__PURE__ */ jsxs("header", { style: {
        height: "48px",
        backgroundColor: "white",
        borderBottom: "1px solid #f0f0f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
        position: "relative",
        zIndex: 50,
        flexShrink: 0
      }, children: [
        /* @__PURE__ */ jsx("div", { style: { border: "1px solid #eee", padding: "6px", borderRadius: "4px", cursor: "pointer" }, children: /* @__PURE__ */ jsx(Menu, { size: 18, color: "#666" }) }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: { display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", position: "relative" },
            onClick: () => setIsProfileDropdownOpen(!isProfileDropdownOpen),
            children: [
              /* @__PURE__ */ jsx("div", { style: { width: "32px", height: "32px", borderRadius: "50%", overflow: "hidden", border: "1px solid #eee" }, children: /* @__PURE__ */ jsx("img", { src: `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedVpa?.merchant_name || "MERCHANT")}&background=156DC4&color=fff`, alt: "Profile", style: { width: "100%", height: "100%" } }) }),
              /* @__PURE__ */ jsx("span", { style: { fontSize: "13px", fontWeight: "700", color: "#333" }, children: selectedVpa?.merchant_name || "MERCHANT" }),
              isProfileDropdownOpen && /* @__PURE__ */ jsxs("div", { style: {
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: "8px",
                backgroundColor: "white",
                borderRadius: "6px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                padding: "8px 0",
                minWidth: "150px",
                zIndex: 200
              }, children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    style: { padding: "10px 16px", fontSize: "12px", color: "#333", cursor: "pointer", fontWeight: "500" },
                    onClick: (e) => {
                      e.stopPropagation();
                      setIsProfileDropdownOpen(false);
                      setShowProfileModal(true);
                    },
                    onMouseEnter: (e) => e.currentTarget.style.backgroundColor = "#f5f5f5",
                    onMouseLeave: (e) => e.currentTarget.style.backgroundColor = "transparent",
                    children: "View Profile"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    style: { padding: "10px 16px", fontSize: "12px", color: "#A01E35", cursor: "pointer", fontWeight: "500" },
                    onClick: (e) => {
                      e.stopPropagation();
                      logout();
                    },
                    onMouseEnter: (e) => e.currentTarget.style.backgroundColor = "#f5f5f5",
                    onMouseLeave: (e) => e.currentTarget.style.backgroundColor = "transparent",
                    children: "Logout"
                  }
                )
              ] })
            ]
          }
        )
      ] }),
      showProfileModal && /* @__PURE__ */ jsx("div", { style: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        zIndex: 1e3,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px"
        // Guarantees it never touches edges
      }, children: /* @__PURE__ */ jsxs(
        "div",
        {
          style: {
            backgroundColor: "white",
            borderRadius: "6px",
            width: "400px",
            maxWidth: "100%",
            boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column"
          },
          children: [
            /* @__PURE__ */ jsx("div", { style: { padding: "12px 20px", borderBottom: "1px solid #f0f0f0", flexShrink: 0 }, children: /* @__PURE__ */ jsx("h2", { style: { margin: 0, fontSize: "13px", fontWeight: "700", color: "#333" }, children: "View Profile Details" }) }),
            /* @__PURE__ */ jsxs("div", { style: { padding: "12px 20px", display: "flex", flexDirection: "column", gap: "12px", overflowY: "visible" }, children: [
              /* @__PURE__ */ jsxs("div", { style: { border: "1px solid #eaeaea", borderRadius: "4px" }, children: [
                /* @__PURE__ */ jsx("div", { style: { padding: "8px 12px", borderBottom: "1px solid #eaeaea", backgroundColor: "#fafafa" }, children: /* @__PURE__ */ jsx("h3", { style: { margin: 0, fontSize: "11px", fontWeight: "700", color: "#333" }, children: "Basic Information" }) }),
                /* @__PURE__ */ jsxs("div", { style: { padding: "12px" }, children: [
                  /* @__PURE__ */ jsxs("div", { style: { display: "flex", marginBottom: "12px" }, children: [
                    /* @__PURE__ */ jsx("div", { style: { flex: 1, fontSize: "10px", color: "#666" }, children: "Name" }),
                    /* @__PURE__ */ jsx("div", { style: { flex: 1, fontSize: "10px", color: "#333", fontWeight: "500" }, children: selectedVpa?.merchant_name || "MERCHANT" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { style: { display: "flex" }, children: [
                    /* @__PURE__ */ jsx("div", { style: { flex: 1, fontSize: "10px", color: "#666" }, children: "Phone" }),
                    /* @__PURE__ */ jsx("div", { style: { flex: 1, fontSize: "10px", color: "#333", fontWeight: "500" }, children: selectedVpa?.merchant_mobile || "N/A" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { style: { border: "1px solid #eaeaea", borderRadius: "4px" }, children: [
                /* @__PURE__ */ jsx("div", { style: { padding: "8px 12px", borderBottom: "1px solid #eaeaea", backgroundColor: "#fafafa" }, children: /* @__PURE__ */ jsx("h3", { style: { margin: 0, fontSize: "11px", fontWeight: "700", color: "#333" }, children: "Device Information" }) }),
                /* @__PURE__ */ jsxs("div", { style: { padding: "12px", display: "flex", flexDirection: "column", gap: "12px" }, children: [
                  /* @__PURE__ */ jsxs("div", { style: { display: "flex" }, children: [
                    /* @__PURE__ */ jsx("div", { style: { flex: 1, fontSize: "10px", color: "#666" }, children: "Device Serial Number" }),
                    /* @__PURE__ */ jsx("div", { style: { flex: 1, fontSize: "10px", color: "#333", fontWeight: "500" }, children: selectedVpa?.serial_number || "N/A" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { style: { display: "flex" }, children: [
                    /* @__PURE__ */ jsx("div", { style: { flex: 1, fontSize: "10px", color: "#666" }, children: "Linked Account Number" }),
                    /* @__PURE__ */ jsx("div", { style: { flex: 1, fontSize: "10px", color: "#333", fontWeight: "500" }, children: selectedVpa?.merchant_account_no || "N/A" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { style: { display: "flex" }, children: [
                    /* @__PURE__ */ jsx("div", { style: { flex: 1, fontSize: "10px", color: "#666" }, children: "UPI ID" }),
                    /* @__PURE__ */ jsx("div", { style: { flex: 1, fontSize: "10px", color: "#333", fontWeight: "500" }, children: selectedVpa?.vpa_id || "N/A" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { style: { display: "flex" }, children: [
                    /* @__PURE__ */ jsx("div", { style: { flex: 1, fontSize: "10px", color: "#666" }, children: "IFSC Code" }),
                    /* @__PURE__ */ jsx("div", { style: { flex: 1, fontSize: "10px", color: "#333", fontWeight: "500" }, children: selectedVpa?.ifsc || "N/A" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { style: { display: "flex" }, children: [
                    /* @__PURE__ */ jsx("div", { style: { flex: 1, fontSize: "10px", color: "#666" }, children: "Device Model Name" }),
                    /* @__PURE__ */ jsx("div", { style: { flex: 1, fontSize: "10px", color: "#333", fontWeight: "500" }, children: "Soundbox" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { style: { display: "flex" }, children: [
                    /* @__PURE__ */ jsx("div", { style: { flex: 1, fontSize: "10px", color: "#666" }, children: "Device Mobile Number" }),
                    /* @__PURE__ */ jsx("div", { style: { flex: 1, fontSize: "10px", color: "#333", fontWeight: "500" }, children: selectedVpa?.merchant_mobile || "N/A" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { style: { display: "flex" }, children: [
                    /* @__PURE__ */ jsx("div", { style: { flex: 1, fontSize: "10px", color: "#666" }, children: "Network Type" }),
                    /* @__PURE__ */ jsx("div", { style: { flex: 1, fontSize: "10px", color: "#333", fontWeight: "500" }, children: "N/A" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { style: { display: "flex" }, children: [
                    /* @__PURE__ */ jsx("div", { style: { flex: 1, fontSize: "10px", color: "#666" }, children: "Device Status" }),
                    /* @__PURE__ */ jsx("div", { style: { flex: 1, fontSize: "10px", color: "#333", fontWeight: "500" }, children: selectedVpa?.device_status || "N/A" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { style: { display: "flex" }, children: [
                    /* @__PURE__ */ jsx("div", { style: { flex: 1, fontSize: "10px", color: "#666" }, children: "Address" }),
                    /* @__PURE__ */ jsx("div", { style: { flex: 1, fontSize: "10px", color: "#333", fontWeight: "500" }, children: selectedVpa?.merchant_delivery_address || "N/A" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { style: { display: "flex" }, children: [
                    /* @__PURE__ */ jsx("div", { style: { flex: 1, fontSize: "10px", color: "#666" }, children: "City/State" }),
                    /* @__PURE__ */ jsx("div", { style: { flex: 1, fontSize: "10px", color: "#333", fontWeight: "500" }, children: selectedVpa?.city ? `${selectedVpa.city}, ${selectedVpa.state}` : "N/A" })
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { style: { padding: "10px 20px", display: "flex", justifyContent: "flex-end", borderTop: "1px solid #f0f0f0", flexShrink: 0 }, children: /* @__PURE__ */ jsx(
              "button",
              {
                style: {
                  padding: "8px 24px",
                  backgroundColor: "#A01E35",
                  border: "none",
                  borderRadius: "4px",
                  color: "white",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer"
                },
                onClick: () => setShowProfileModal(false),
                children: "Close"
              }
            ) })
          ]
        }
      ) }),
      /* @__PURE__ */ jsx("div", { style: { flex: 1, overflowY: "auto", backgroundColor: "#f8f9fa" }, children })
    ] })
  ] });
};
var Layout_default = Layout;
export {
  Layout_default as default
};

