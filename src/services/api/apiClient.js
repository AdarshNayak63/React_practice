import axios from "axios";
import { userManager, login } from "../authService.js";
import Notiflix from "notiflix";
const STAGE_API_BASE = "/api-proxy";
const STAGE_AUTH_API_BASE = "/auth-proxy";
const ELASTIC_API_BASE = "https://services.txninfra.com";
const ENCR_BASE = "/encr-proxy";
const ENCR_KEY = "a6T8tOCYiSzDTrcqPvCbJfy0wSQOVcfaevH0gtwCtoU=";
const apiEncr = axios.create({ baseURL: ENCR_BASE });
async function encryptData(data) {
  try {
    const res = await apiEncr.post("/encr", data, { headers: { Key: ENCR_KEY } });
    const ciphertext = res.data?.RequestData || res.data?.ResponseData || res.data;
    if (typeof ciphertext !== "string") {
      console.warn("[apiService] Encryption returned non-string data:", res.data);
    }
    return ciphertext;
  } catch (err) {
    console.error("[apiService] Encryption failed:", err);
    throw err;
  }
}
async function decryptData(encrypted) {
  try {
    const res = await apiEncr.post("/decr", { req: encrypted }, { headers: { Key: ENCR_KEY } });
    return res.data;
  } catch (err) {
    console.error("[apiService] Decryption failed:", err);
    throw err;
  }
}
async function getAuthToken() {
  const user = await userManager.getUser();
  const token = user?.access_token || "";
  console.debug("[apiService] token present:", token);
  return token;
}
function formatDateDDMMYYYY(isoDate) {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}
function getTodayDDMMYYYY() {
  const d = /* @__PURE__ */ new Date();
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}
const createApiInstance = (baseURL) => {
  const instance = axios.create({ baseURL });
  instance.interceptors.request.use(async (config) => {
    const token = await getAuthToken();
    config.headers.Authorization = `Bearer ${token}`;
    config.headers["pass_key"] = "QC62FQKXT2DQTO43LMWH5A44UKVPQ7LK5Y6HVHRQ3XTIKLDTB6HA";
    return config;
  });
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response) {
        const { status, data } = error.response;
        console.error(`[apiService] Error ${status} from ${error.config.url}:`, data);
        if (status === 401) {
          Notiflix.Report.warning(
            "Session Expired",
            "Your session has expired. Please login again to continue.",
            "Login",
            () => {
              login();
            }
          );
        } else {
          const errorMsg = data?.status_desc || data?.statusDesc || data?.message || "Something went wrong";
          Notiflix.Notify.failure(errorMsg);
        }
      } else {
        Notiflix.Notify.failure("Network error. Please check your connection.");
      }
      return Promise.reject(error);
    }
  );
  return instance;
};
const apiStage = createApiInstance(STAGE_API_BASE);
const apiAuth = createApiInstance(STAGE_AUTH_API_BASE);
apiAuth.interceptors.response.use(async (response) => {
  const encData = response.data?.data || response.data?.Data || response.data?.ResponseData;
  if (typeof encData === "string" && encData.length > 20) {
    try {
      const decrypted = await decryptData(encData);
      response.data = decrypted;
      console.debug("[apiService] Decrypted response:", decrypted);
    } catch (err) {
      console.error("[apiService] Auto-decryption failed:", err);
    }
  }
  return response;
});
const apiElastic = createApiInstance(ELASTIC_API_BASE);
const apiService = {
  // ─── SDUI APIs ────────────────────────────────────────────────────────────
  fetchSDUI: (user_name) => apiStage.post("/pnb/sdui/fetch", { user_name }),
  fetchSelectiveSDUI: (screen, user_name) => apiStage.post("/pnb/sdui/fetch_selective", { user_name, required_screen: screen }),
  fetchElasticForm: (params) => apiElastic.post("/isu/elastic/fetch", params),
  // ─── User & Device APIs ─────────────────────────────────────────────────────
  // Returns: merchant_name, vpa_id, serial_number, qr_string, terminal_id, etc.
  fetchUserById: async (params) => {
    const user = await userManager.getUser();
    const current_user_name = params.user_name || user?.profile?.preferred_username;
    if (!current_user_name) throw new Error("User identity is missing");
    const encrypted = await encryptData({ ...params, user_name: current_user_name });
    return apiAuth.post("/pnb/fetch/fetchById", { RequestData: encrypted });
  },
  getDeviceStatus: (deviceSno) => apiStage.get(`/pnb/TMS/soundbox/getDeviceStatus?deviceSno=${deviceSno.padStart(14, "0")}`),
  // ─── Reports APIs ──────────────────────────────────────────────────────────
  // Mode: "both" (Today), "excel" (Monthly/Range)
  submitReportQuery: (data) => apiStage.post("/pnb/sb/reports/querysubmit_user", data),
  getReportStatus: (queryId) => apiStage.get(`/pnb/sb/reports/get_report_status/${queryId}`),
  // ─── Soundbox / Language APIs ──────────────────────────────────────────────
  fetchLanguages: () => apiAuth.get("/pnb/isu_soundbox/lang/fetch_language"),
  // Fetch Current Language (from Node Docs line 880)
  getCurrentLanguage: (tid) => apiAuth.get(`/pnb/isu_soundbox/user_api/current_language/${tid}`),
  // Step 3 update (Payload fixed: language -> update_language)
  updateLanguage: async (data) => {
    const encrypted = await encryptData(data);
    return apiAuth.post("/pnb/isu_soundbox/lang/update_language", { RequestData: encrypted });
  },
  // ─── QR APIs ───────────────────────────────────────────────────────────────
  // Step 2: Convert to Base64 (Payload fixed: qrString -> qr_string)
  generateQRBase64: async (qr_string) => {
    const user = await userManager.getUser();
    const user_name = user?.profile?.preferred_username;
    if (!user_name) throw new Error("User identity is missing");
    const encrypted = await encryptData({ qr_string, qrString: qr_string, user_name });
    return apiAuth.post("/pnb/merchant/qr_convert_to_base64", { RequestData: encrypted });
  },
  /*
  // Dynamic QR String Generation
  generateDynamicQrString: (params: any) =>
    apiCBOI.post('/CBOI/merchant/get-qr-string', params),
  */
  // ─── Help & Support APIs ───────────────────────────────────────────────────
  createTicket: async (data) => {
    const FIELD_SUBJECT = 900013325983;
    const FIELD_DESCRIPTION = 900013326003;
    const FIELD_ISSUE_TYPE = 32240028334873;
    const FIELD_ISSUE_SUB_TYPE = 32240169914009;
    const FORM_ID = 55401855259289;
    const user = await userManager.getUser();
    const user_name = user?.profile?.preferred_username || "PNBADMIN";
    const payload = {
      subject: data.subject,
      body: data.body || data.description || "No description provided",
      ticket_form_id: FORM_ID,
      user_name,
      custom_fields: [
        { id: FIELD_SUBJECT, value: data.subject },
        { id: FIELD_DESCRIPTION, value: data.body || data.description || "No description provided" },
        { id: FIELD_ISSUE_TYPE, value: "qr" },
        // Hardcoded as per documentation example
        { id: FIELD_ISSUE_SUB_TYPE, value: "damaged_qr" }
        // Hardcoded as per documentation example
      ]
    };
    console.debug("[apiService] Creating Ticket with payload:", payload);
    const encrypted = await encryptData(payload);
    return apiAuth.post("/pnb/helpandsupport/createTicket", { RequestData: encrypted });
  },
  viewAllTickets: async (user_name_param) => {
    const user = await userManager.getUser();
    const user_name = user_name_param || user?.profile?.preferred_username || "PNBADMIN";
    const encrypted = await encryptData({ user_name });
    return apiAuth.post("/pnb/helpandsupport/viewAllTickets", { RequestData: encrypted });
  },
  viewTicketById: async (ticket_id) => {
    const user = await userManager.getUser();
    const user_name = user?.profile?.preferred_username || "PNBADMIN";
    const encrypted = await encryptData({ ticket_id, user_name });
    return apiAuth.post("/pnb/helpandsupport/viewTicket", { RequestData: encrypted });
  },
  uploadFile: (formData) => apiAuth.post("/pnb/helpandsupport/uploadfile", formData),
  deleteFile: (file_id) => apiAuth.post("/pnb/helpandsupport/deletefile", { file_id }),
  rateUs: async (data) => {
    const encrypted = await encryptData(data);
    return apiAuth.post("/pnb/helpandsupport/rateUs", { RequestData: encrypted });
  },
  createComment: async (data) => {
    const encrypted = await encryptData(data);
    return apiAuth.post("/pnb/helpandsupport/createComment", { RequestData: encrypted });
  },
  showComment: async (ticket_id) => {
    const encrypted = await encryptData({ ticket_id });
    return apiAuth.post("/pnb/helpandsupport/showComment", { RequestData: encrypted });
  },
  closeStatus: async (ticket_id, remarks = "Resolved by merchant") => {
    const encrypted = await encryptData({ ticket_id, remarks });
    return apiAuth.post("/pnb/helpandsupport/closeStatus", { RequestData: encrypted });
  },
  reOpenStatus: async (ticket_id, remarks = "Reopened by merchant") => {
    const encrypted = await encryptData({ ticket_id, remarks });
    return apiAuth.post("/pnb/helpandsupport/reopenStatus", { RequestData: encrypted });
  },
  filterTickets: async (filters) => {
    const encrypted = await encryptData(filters);
    return apiAuth.post("/pnb/helpandsupport/filterTickets", { RequestData: encrypted });
  },
  downloadAllTickets: async () => {
    const encrypted = await encryptData({});
    return apiAuth.post("/pnb/helpandsupport/download", { RequestData: encrypted }, { responseType: "blob" });
  },
  downloadTicketById: async (ticket_id) => {
    const encrypted = await encryptData({ ticket_id });
    return apiAuth.post("/pnb/helpandsupport/downloadByTicketId", { RequestData: encrypted }, { responseType: "blob" });
  }
};
export {
  apiService,
  formatDateDDMMYYYY,
  getTodayDDMMYYYY
};
