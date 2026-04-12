import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useVpa } from "../context/VpaContext.jsx";
import { apiService } from "../services/apiService";
import { AlertCircle } from "lucide-react";
const Soundbox = () => {
  const { selectedVpa, loading: vpaGlobalLoading } = useVpa();
  const [languages, setLanguages] = useState([]);
  const [currentLang, setCurrentLang] = useState("Loading...");
  const [selectedLang, setSelectedLang] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [langLoading, setLangLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState({ show: false, message: "" });
  useEffect(() => {
    const checkStatus = async () => {
      if (!selectedVpa?.terminal_id) return;
      try {
        const res = await apiService.getCurrentLanguage(selectedVpa.terminal_id || "");
        const langData = res.data?.data;
        if (typeof langData === "string") {
          setCurrentLang(langData);
        } else if (langData?.language) {
          setCurrentLang(langData.language);
        }
      } catch (err) {
        console.error("Failed to check language status:", err);
      }
    };
    checkStatus();
  }, [selectedVpa]);
  const toggleDropdown = async () => {
    const nextState = !isDropdownOpen;
    setIsDropdownOpen(nextState);
    if (nextState && languages.length <= 11) {
      setLangLoading(true);
      try {
        const res = await apiService.fetchLanguages();
        if (res.data?.data && Array.isArray(res.data.data)) {
          setLanguages(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch languages:", err);
      } finally {
        setLangLoading(false);
      }
    }
  };
  const handleUpdate = async () => {
    if (!selectedLang || !selectedVpa?.terminal_id) return;
    setLoading(true);
    try {
      const res = await apiService.updateLanguage({
        tid: selectedVpa.terminal_id || "",
        update_language: selectedLang
      });
      if (res.data?.status === "SUCCESS" || res.data?.statusCode === 200 || res.data?.result === "success" || res.data?.responseCode === "01") {
        setShowSuccessModal(true);
      } else {
        setErrorModal({
          show: true,
          message: res.data?.message || "Failed to update language. Please try again later."
        });
      }
    } catch (err) {
      console.error("Update Error:", err);
      setErrorModal({
        show: true,
        message: err.response?.data?.message || "A network error occurred while updating language."
      });
    } finally {
      setLoading(false);
    }
  };
  if (vpaGlobalLoading && !selectedVpa) {
    return /* @__PURE__ */ jsx("div", { style: { height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsx("p", { children: "Loading VPA details..." }) });
  }
  return /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", height: "100%", boxSizing: "border-box", backgroundColor: "#f8f9fa", padding: "24px 32px" }, children: [
    /* @__PURE__ */ jsx("h1", { style: { margin: "0 0 24px 0", fontSize: "18px", fontWeight: "800", color: "#1A1A1A" }, children: "Language Update" }),
    /* @__PURE__ */ jsxs("div", { style: { backgroundColor: "white", borderRadius: "8px", border: "1px solid #eee", padding: "24px" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "8px" }, children: [
          /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: "600", color: "#888" }, children: "VPA ID" }),
          /* @__PURE__ */ jsx("div", { style: { height: "40px", backgroundColor: "#f5f5f5", borderRadius: "4px", border: "1px solid #eee", display: "flex", alignItems: "center", padding: "0 12px", fontSize: "13px", color: "#333" }, children: selectedVpa?.vpa_id || "N/A" })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "8px" }, children: [
          /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: "600", color: "#888" }, children: "Device Serial Number" }),
          /* @__PURE__ */ jsx("div", { style: { height: "40px", backgroundColor: "#f5f5f5", borderRadius: "4px", border: "1px solid #eee", display: "flex", alignItems: "center", padding: "0 12px", fontSize: "13px", color: "#333" }, children: selectedVpa?.serial_number || "N/A" })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "8px" }, children: [
          /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: "600", color: "#888" }, children: "Current Language" }),
          /* @__PURE__ */ jsx("div", { style: { height: "40px", backgroundColor: "#f5f5f5", borderRadius: "4px", border: "1px solid #eee", display: "flex", alignItems: "center", padding: "0 12px", fontSize: "13px", color: "#333" }, children: currentLang })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "8px", position: "relative" }, children: [
          /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: "600", color: "#888" }, children: "Language Update" }),
          /* @__PURE__ */ jsxs(
            "div",
            {
              onClick: toggleDropdown,
              style: { height: "40px", backgroundColor: "white", borderRadius: "4px", border: "1px solid #ddd", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px", fontSize: "13px", color: selectedLang ? "#333" : "#999", cursor: "pointer" },
              children: [
                langLoading ? "Loading..." : selectedLang || "Select Language Update",
                /* @__PURE__ */ jsx(ChevronDown, { size: 14, color: "#666" })
              ]
            }
          ),
          isDropdownOpen && /* @__PURE__ */ jsx("div", { style: { position: "absolute", top: "100%", left: 0, right: 0, marginTop: "4px", backgroundColor: "white", border: "1px solid #eee", borderRadius: "4px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", zIndex: 10, padding: "8px 0", maxHeight: "250px", overflowY: "auto" }, children: languages.map((lang) => /* @__PURE__ */ jsx(
            "div",
            {
              onClick: () => {
                setSelectedLang(lang);
                setIsDropdownOpen(false);
              },
              style: { padding: "10px 16px", fontSize: "13px", color: "#333", cursor: "pointer", backgroundColor: selectedLang === lang ? "#fdf2f4" : "transparent", fontWeight: selectedLang === lang ? "600" : "400" },
              children: lang
            },
            lang
          )) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "flex-end", gap: "16px", alignItems: "center" }, children: [
        /* @__PURE__ */ jsx("button", { style: { backgroundColor: "transparent", border: "none", color: "#A01E35", fontSize: "13px", fontWeight: "700", cursor: "pointer" }, children: "Cancel" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleUpdate,
            disabled: !selectedLang || loading,
            style: { backgroundColor: "#A01E35", color: "white", border: "none", borderRadius: "4px", padding: "10px 24px", fontSize: "13px", fontWeight: "700", cursor: selectedLang && !loading ? "pointer" : "not-allowed", opacity: selectedLang && !loading ? 1 : 0.6 },
            children: loading ? "Updating..." : "Update"
          }
        )
      ] })
    ] }),
    showSuccessModal && /* @__PURE__ */ jsx("div", { style: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1e3, display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsxs("div", { style: { backgroundColor: "white", borderRadius: "8px", padding: "32px", width: "380px", display: "flex", flexDirection: "column", alignItems: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }, children: [
      /* @__PURE__ */ jsxs("h2", { style: { margin: "0 0 24px 0", fontSize: "14px", fontWeight: "700", color: "#333", textAlign: "center", lineHeight: "1.5" }, children: [
        "Language update request",
        /* @__PURE__ */ jsx("br", {}),
        "Initiated Successfully"
      ] }),
      /* @__PURE__ */ jsx("div", { style: { width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "#e6f7eb", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "32px", border: "8px solid #c2edce" }, children: /* @__PURE__ */ jsx("div", { style: { width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#34c759", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsx(Check, { size: 28, color: "white", strokeWidth: 4 }) }) }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            setShowSuccessModal(false);
            setSelectedLang(null);
          },
          style: { width: "100%", backgroundColor: "#A01E35", color: "white", border: "none", borderRadius: "4px", padding: "12px 0", fontSize: "13px", fontWeight: "700", cursor: "pointer" },
          children: "Close"
        }
      )
    ] }) }),
    errorModal.show && /* @__PURE__ */ jsx("div", { style: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1e3, display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsxs("div", { style: { backgroundColor: "white", borderRadius: "8px", padding: "32px", width: "380px", display: "flex", flexDirection: "column", alignItems: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }, children: [
      /* @__PURE__ */ jsx("h2", { style: { margin: "0 0 16px 0", fontSize: "18px", fontWeight: "800", color: "#A01E35" }, children: "Update Failed" }),
      /* @__PURE__ */ jsx("p", { style: { margin: "0 0 24px 0", fontSize: "13px", color: "#666", textAlign: "center", lineHeight: "1.5" }, children: errorModal.message }),
      /* @__PURE__ */ jsx("div", { style: { width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }, children: /* @__PURE__ */ jsx(AlertCircle, { size: 32, color: "#A01E35" }) }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setErrorModal({ show: false, message: "" }),
          style: { width: "100%", backgroundColor: "#333", color: "white", border: "none", borderRadius: "4px", padding: "12px 0", fontSize: "13px", fontWeight: "700", cursor: "pointer" },
          children: "Understand"
        }
      )
    ] }) })
  ] });
};
var Soundbox_default = Soundbox;
export {
  Soundbox_default as default
};
