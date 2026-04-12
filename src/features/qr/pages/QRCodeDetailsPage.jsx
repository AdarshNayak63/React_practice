import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import Notiflix from "notiflix";
import {
  User,
  Check
} from "lucide-react";
import { apiService } from "../../../services/apiService.js";
import { useVpa } from "../../../core/providers/VpaProvider.jsx";
const QRCodePage = () => {
  const { selectedVpa, loading: vpaLoading } = useVpa();
  if (vpaLoading && !selectedVpa) {
    return /* @__PURE__ */ jsx("div", { style: { height: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f8f9fa" }, children: /* @__PURE__ */ jsx("p", { style: { fontSize: "14px", color: "#666" }, children: "Loading QR Details..." }) });
  }
  const [qrType] = useState("Static");
  const isDynamicGenerated = false;
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [qrBase64, setQrBase64] = useState(null);
  const [upiId, setUpiId] = useState("");
  const [merchantName, setMerchantName] = useState("MERCHANT");
  const [staticQrString, setStaticQrString] = useState("");
  useEffect(() => {
    if (selectedVpa) {
      setUpiId(selectedVpa.vpa_id || "");
      setMerchantName(selectedVpa.merchant_name || "MERCHANT");
      setStaticQrString(selectedVpa.qr_string || "");
    }
  }, [selectedVpa]);
  useEffect(() => {
    if (!staticQrString) return;
    const qrString = staticQrString;
    const fetchQR = async () => {
      try {
        const res = await apiService.generateQRBase64(qrString);
        if (res.data?.base64Image) {
          setQrBase64(res.data.base64Image);
        }
      } catch (err) {
        console.error("QR Fetch Error:", err);
      }
    };
    fetchQR();
  }, [staticQrString, isDynamicGenerated]);
  const handleDownloadQR = () => {
    if (!qrBase64) {
      Notiflix.Notify.warning("QR Code not ready for download.");
      return;
    }
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${qrBase64}`;
    link.download = `PNB_QR_${upiId || "Merchant"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    Notiflix.Notify.success("QR Code download started.");
  };
  return /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", height: "100%", boxSizing: "border-box", backgroundColor: "#f8f9fa", overflowY: "auto" }, children: [
    /* @__PURE__ */ jsx("div", { style: { padding: "24px 32px 16px 32px" }, children: /* @__PURE__ */ jsx("h1", { style: { margin: "0 0 16px 0", fontSize: "18px", fontWeight: "800", color: "#1A1A1A" }, children: "QR Details" }) }),
    !(qrType === "Dynamic" && !isDynamicGenerated) && /* @__PURE__ */ jsx("div", { style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      padding: "0 32px 32px 32px",
      minHeight: 0
    }, children: /* @__PURE__ */ jsx("div", { style: {
      flex: 1,
      backgroundColor: "white",
      borderRadius: "8px",
      border: "1px solid #eee",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      padding: "24px",
      overflowY: "auto"
    }, children: /* @__PURE__ */ jsxs("div", { style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "8px"
      // tighter gap for all elements
    }, children: [
      !(qrType === "Dynamic" && isDynamicGenerated) && /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "8px" }, children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: "/pnb_logo.png",
            alt: "PNB Logo",
            style: { width: "90px", height: "auto", objectFit: "contain" }
          }
        ),
        /* @__PURE__ */ jsxs("p", { style: { fontSize: "9px", fontWeight: "700", color: "#555", marginTop: "4px", margin: 0 }, children: [
          "UPI ID : ",
          upiId
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", marginTop: "8px" }, children: [
        /* @__PURE__ */ jsx("div", { style: { width: "20px", height: "20px", borderRadius: "50%", backgroundColor: "#e0e0e0", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsx(User, { size: 12, color: "#888" }) }),
        /* @__PURE__ */ jsx("span", { style: { fontSize: "11px", fontWeight: "700", color: "#333" }, children: merchantName })
      ] }),
      qrBase64 ? /* @__PURE__ */ jsx(
        "img",
        {
          src: `data:image/png;base64,${qrBase64}`,
          alt: "QR Code",
          style: { width: "160px", height: "160px", backgroundColor: "white", padding: "8px", borderRadius: "8px" }
        }
      ) : /* @__PURE__ */ jsx("div", { style: { width: "160px", height: "160px", backgroundColor: "#fafafa", display: "flex", alignItems: "center", justifyContent: "center", color: "#999", fontSize: "12px" }, children: "Loading..." }),
      /* @__PURE__ */ jsxs("p", { style: { fontSize: "10px", fontWeight: "700", color: "#444", margin: "4px 0 16px 0" }, children: [
        "UPI ID : ",
        upiId
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleDownloadQR,
          style: {
            backgroundColor: "#A01E35",
            color: "white",
            padding: "10px 24px",
            borderRadius: "4px",
            border: "none",
            fontSize: "11px",
            fontWeight: "700",
            cursor: "pointer",
            marginBottom: "16px"
          },
          children: "Download QR Code"
        }
      ),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center" }, children: [
        /* @__PURE__ */ jsx("span", { style: { fontSize: "7px", fontWeight: "800", color: "#888", letterSpacing: "1px" }, children: "POWERED BY" }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "baseline", gap: "2px" }, children: [
          /* @__PURE__ */ jsx("span", { style: { fontSize: "18px", fontWeight: "900", color: "#666", fontStyle: "italic", letterSpacing: "-1px" }, children: "UPI" }),
          /* @__PURE__ */ jsx("div", { style: { width: "0", height: "0", borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderLeft: "10px solid #1e8e3e" } })
        ] }),
        /* @__PURE__ */ jsx("span", { style: { fontSize: "4px", color: "#999", marginTop: "2px" }, children: "UNIFIED PAYMENTS INTERFACE" })
      ] })
    ] }) }) }),
    showSuccessModal && /* @__PURE__ */ jsx("div", { style: {
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
      width: "400px",
      maxWidth: "90%",
      padding: "32px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
    }, children: [
      /* @__PURE__ */ jsx("h2", { style: { margin: "0 0 24px 0", fontSize: "18px", fontWeight: "800", color: "#1A1A1A" }, children: "Payment Successful!" }),
      /* @__PURE__ */ jsx("div", { style: {
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        backgroundColor: "#e6f4ea",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "24px",
        border: "6px solid #bce6c9"
      }, children: /* @__PURE__ */ jsx("div", { style: {
        width: "64px",
        height: "64px",
        borderRadius: "50%",
        backgroundColor: "#2dd36f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }, children: /* @__PURE__ */ jsx(Check, { size: 36, color: "white", strokeWidth: 3 }) }) }),
      /* @__PURE__ */ jsx("p", { style: { margin: "0 0 32px 0", fontSize: "13px", color: "#666", textAlign: "center" }, children: "Your transaction has been completed successfully." }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            setShowSuccessModal(false);
          },
          style: {
            width: "100%",
            padding: "12px",
            backgroundColor: "#A01E35",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "13px",
            fontWeight: "700",
            cursor: "pointer"
          },
          children: "Close"
        }
      )
    ] }) })
  ] });
};
var QRCodePage_default = QRCodePage;
export {
  QRCodePage_default as default
};

