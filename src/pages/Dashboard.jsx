import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import {
  ArrowLeftRight,
  ChevronDown,
  CircleDot
} from "lucide-react";
import { useVpa } from "../context/VpaContext.jsx";
const Dashboard = () => {
  const { vpaList, selectedVpa, setSelectedVpa, loading: vpaGlobalLoading, refreshVpas } = useVpa();
  const [showVpaModal, setShowVpaModal] = useState(false);
  const [modalSelectedVpaId, setModalSelectedVpaId] = useState("");
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("Today");
  useEffect(() => {
    refreshVpas();
  }, []);
  useEffect(() => {
    if (selectedVpa) {
      setModalSelectedVpaId(selectedVpa.vpa_id);
    }
  }, [selectedVpa]);
  if (vpaGlobalLoading && !selectedVpa) {
    return /* @__PURE__ */ jsx("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }, children: /* @__PURE__ */ jsx("p", { children: "Loading your data..." }) });
  }
  return /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", minHeight: "100%", backgroundColor: "#f8f9fa" }, children: [
    /* @__PURE__ */ jsx("div", { style: {
      backgroundColor: "white",
      padding: "32px 32px 24px 32px",
      borderBottom: "1px solid #f0f0f0"
    }, children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "24px" }, children: [
      /* @__PURE__ */ jsx("h1", { style: { margin: 0, fontSize: "18px", fontWeight: "700", color: "#1A1A1A" }, children: "Dashboard" }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "32px" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "#666", fontWeight: "600" }, children: "VPA ID :" }),
            /* @__PURE__ */ jsxs(
              "div",
              {
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "6px 12px",
                  backgroundColor: "white",
                  border: "1px solid #E6E6E6",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#333"
                },
                onClick: () => setShowVpaModal(true),
                children: [
                  /* @__PURE__ */ jsx("span", { children: selectedVpa?.vpa_id || "Select VPA" }),
                  " ",
                  /* @__PURE__ */ jsx(ChevronDown, { size: 14, color: "#999" })
                ]
              }
            )
          ] }),
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { position: "relative" }, children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setIsDateDropdownOpen(!isDateDropdownOpen),
              style: {
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 12px",
                backgroundColor: "white",
                border: "1px solid #E6E6E6",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: "600",
                color: "#333",
                cursor: "pointer",
                minWidth: "100px",
                justifyContent: "space-between"
              },
              children: [
                /* @__PURE__ */ jsx("span", { children: selectedDate }),
                " ",
                /* @__PURE__ */ jsx(ChevronDown, { size: 14, color: "#999" })
              ]
            }
          ),
          isDateDropdownOpen && /* @__PURE__ */ jsx("div", { style: {
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: "4px",
            backgroundColor: "white",
            border: "1px solid #E6E6E6",
            borderRadius: "6px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            zIndex: 100,
            width: "140px",
            padding: "4px 0",
            overflow: "hidden"
          }, children: ["Today", "Yesterday"].map((dateOpt) => /* @__PURE__ */ jsxs(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                fontSize: "12px",
                color: "#333",
                cursor: "pointer",
                backgroundColor: selectedDate === dateOpt ? "#EAF3FA" : "transparent"
              },
              onClick: () => {
                setSelectedDate(dateOpt);
                setIsDateDropdownOpen(false);
              },
              children: [
                /* @__PURE__ */ jsx("div", { style: {
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                  border: `2px solid ${selectedDate === dateOpt ? "#A01E35" : "#ccc"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }, children: selectedDate === dateOpt && /* @__PURE__ */ jsx("div", { style: { width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#A01E35" } }) }),
                dateOpt
              ]
            },
            dateOpt
          )) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }, children: [
        /* @__PURE__ */ jsxs("div", { style: {
          backgroundColor: "white",
          padding: "12px 16px",
          borderRadius: "8px",
          border: "1px solid #eaeaea",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "12px" }, children: [
            /* @__PURE__ */ jsx("div", { style: {
              width: "32px",
              height: "32px",
              borderRadius: "6px",
              backgroundColor: "#F0F3FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#156DC4"
            }, children: /* @__PURE__ */ jsx(ArrowLeftRight, { size: 16 }) }),
            /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", fontWeight: "600", color: "#444" }, children: "Total No Of Transaction" })
          ] }),
          /* @__PURE__ */ jsx("span", { style: { fontSize: "18px", fontWeight: "800", color: "#1A1A1A" }, children: "0" })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: {
          backgroundColor: "white",
          padding: "12px 16px",
          borderRadius: "8px",
          border: "1px solid #eaeaea",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "12px" }, children: [
            /* @__PURE__ */ jsx("div", { style: {
              width: "32px",
              height: "32px",
              borderRadius: "6px",
              backgroundColor: "#FFF0F0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#A01E35"
            }, children: /* @__PURE__ */ jsx(CircleDot, { size: 16 }) }),
            /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", fontWeight: "600", color: "#444" }, children: "Total Amount" })
          ] }),
          /* @__PURE__ */ jsx("span", { style: { fontSize: "18px", fontWeight: "800", color: "#1A1A1A" }, children: "\u20B9 0" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { style: { flex: 1, padding: "32px" } }),
    showVpaModal && /* @__PURE__ */ jsx("div", { style: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.4)",
      zIndex: 1e3,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }, children: /* @__PURE__ */ jsxs("div", { style: {
      backgroundColor: "white",
      borderRadius: "8px",
      width: "420px",
      maxWidth: "90%",
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
    }, children: [
      /* @__PURE__ */ jsx("div", { style: { padding: "20px 24px", borderBottom: "1px solid #f0f0f0" }, children: /* @__PURE__ */ jsx("h2", { style: { margin: 0, fontSize: "16px", fontWeight: "700", color: "#333" }, children: "Select VPA" }) }),
      /* @__PURE__ */ jsxs("div", { style: { padding: "20px 24px" }, children: [
        /* @__PURE__ */ jsx("p", { style: { fontSize: "13px", color: "#666", margin: "0 0 16px 0" }, children: "Select a VPA to Proceed" }),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "12px", maxHeight: "300px", overflowY: "auto" }, children: vpaList.map((vpa, idx) => /* @__PURE__ */ jsxs(
          "label",
          {
            style: {
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              border: "1px solid #eee",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "all 0.2s",
              borderColor: modalSelectedVpaId === vpa.vpa_id ? "#A01E35" : "#eee"
            },
            onClick: () => setModalSelectedVpaId(vpa.vpa_id),
            children: [
              /* @__PURE__ */ jsx("div", { style: {
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                border: `2px solid ${modalSelectedVpaId === vpa.vpa_id ? "#A01E35" : "#ccc"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }, children: modalSelectedVpaId === vpa.vpa_id && /* @__PURE__ */ jsx("div", { style: { width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#A01E35" } }) }),
              /* @__PURE__ */ jsx("span", { style: { fontSize: "13px", color: "#333" }, children: vpa.vpa_id })
            ]
          },
          idx
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { padding: "16px 24px", display: "flex", justifyContent: "flex-end", gap: "12px", borderTop: "1px solid #f0f0f0" }, children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setShowVpaModal(false),
            style: {
              padding: "8px 20px",
              backgroundColor: "transparent",
              border: "none",
              color: "#666",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer"
            },
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
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
            onClick: () => {
              const newSelected = vpaList.find((v) => v.vpa_id === modalSelectedVpaId);
              if (newSelected) setSelectedVpa(newSelected);
              setShowVpaModal(false);
            },
            children: "Proceed"
          }
        )
      ] })
    ] }) })
  ] });
};
var Dashboard_default = Dashboard;
export {
  Dashboard_default as default
};
