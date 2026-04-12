import axios from 'axios';

// Endpoints mapped from user requirements
export const API_ENDPOINTS = {
  fetchByIdUrl: "https://auth-dev-stage.iserveu.online/pnb/fetch/fetchById",
  deviceDetailsUrl: "https://api-dev-stage.iserveu.online/pnb/TMS/soundbox/getDeviceStatus?deviceSno=",
  generateDynamicQrUrl: "https://services-cboi-uat.isupay.in/CBOI/merchant/get-qr-string",
  convertQRToBase64Url: "https://auth-dev-stage.iserveu.online/pnb/merchant/qr_convert_to_base64",
  getReportStatusUrl: "https://api-dev-stage.iserveu.online/pnb/sb/reports/get_report_status",
  reportUrl: "https://api-dev-stage.iserveu.online/pnb/sb/reports/querysubmit_user",
  getCurrentLanguageUrl: "https://auth-dev-stage.iserveu.online/pnb/isu_soundbox/user_api/current_language",
  fetchAllLanguageUrl: "https://auth-dev-stage.iserveu.online/pnb/isu_soundbox/lang/fetch_language",
  updateLanguageUrl: "https://auth-dev-stage.iserveu.online/pnb/isu_soundbox/lang/update_language",
  viewAllTicket: "https://auth-dev-stage.iserveu.online/pnb/helpandsupport/viewAllTickets",
  uploadFile: "https://auth-dev-stage.iserveu.online/pnb/helpandsupport/uploadfile",
  fetchForm: "https://services.txninfra.com/isu/elastic/fetch",
  deleteFile: "https://auth-dev-stage.iserveu.online/pnb/helpandsupport/deletefile",
  createTicket: "https://auth-dev-stage.iserveu.online/pnb/helpandsupport/createTicket",
  rateUs: "https://auth-dev-stage.iserveu.online/pnb/helpandsupport/rateUs",
  showComment: "https://auth-dev-stage.iserveu.online/pnb/helpandsupport/showComment",
  createComment: "https://auth-dev-stage.iserveu.online/pnb/helpandsupport/createComment",
  viewTicketById: "https://auth-dev-stage.iserveu.online/pnb/helpandsupport/viewTicket",
  closeStatus: "https://auth-dev-stage.iserveu.online/pnb/helpandsupport/closeStatus",
  reOpenStatus: "https://auth-dev-stage.iserveu.online/pnb/helpandsupport/reopenStatus",
  filterTicket: "https://auth-dev-stage.iserveu.online/pnb/helpandsupport/filterTickets",
  downloadAllTicket: "https://auth-dev-stage.iserveu.online/pnb/helpandsupport/download",
  downloadTicketById: "https://auth-dev-stage.iserveu.online/pnb/helpandsupport/downloadByID"
};

// Create an Axios instance
const apiClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor to attach token dynamically will be added in the App/Auth implementation
export const setupInterceptors = (getUserToken) => {
  apiClient.interceptors.request.use(
    async (config) => {
      const token = await getUserToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

// API Service Functions
export const apiService = {
  // User and Authentication
  async fetchUserById(userId) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.fetchByIdUrl, { userId });
      return response.data;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  },

  // Device Management
  async getDeviceDetails(deviceSno) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.deviceDetailsUrl}${deviceSno}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching device details:', error);
      throw error;
    }
  },

  // QR Code Management
  async generateDynamicQR(qrData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.generateDynamicQrUrl, qrData);
      return response.data;
    } catch (error) {
      console.error('Error generating QR:', error);
      throw error;
    }
  },

  async convertQRToBase64(qrData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.convertQRToBase64Url, qrData);
      return response.data;
    } catch (error) {
      console.error('Error converting QR to base64:', error);
      throw error;
    }
  },

  // Reports
  async getReportStatus(reportId) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.getReportStatusUrl}?reportId=${reportId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching report status:', error);
      throw error;
    }
  },

  async submitReport(reportData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.reportUrl, reportData);
      return response.data;
    } catch (error) {
      console.error('Error submitting report:', error);
      throw error;
    }
  },

  // Language Management
  async getCurrentLanguage() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.getCurrentLanguageUrl);
      return response.data;
    } catch (error) {
      console.error('Error fetching current language:', error);
      throw error;
    }
  },

  async fetchAllLanguages() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.fetchAllLanguageUrl);
      return response.data;
    } catch (error) {
      console.error('Error fetching all languages:', error);
      throw error;
    }
  },

  async updateLanguage(languageData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.updateLanguageUrl, languageData);
      return response.data;
    } catch (error) {
      console.error('Error updating language:', error);
      throw error;
    }
  },

  // Help and Support - Tickets
  async viewAllTickets() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.viewAllTicket);
      return response.data;
    } catch (error) {
      console.error('Error fetching all tickets:', error);
      throw error;
    }
  },

  async createTicket(ticketData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.createTicket, ticketData);
      return response.data;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  },

  async viewTicketById(ticketId) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.viewTicketById}?ticketId=${ticketId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ticket by ID:', error);
      throw error;
    }
  },

  async closeTicket(ticketId) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.closeStatus, { ticketId });
      return response.data;
    } catch (error) {
      console.error('Error closing ticket:', error);
      throw error;
    }
  },

  async reopenTicket(ticketId) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.reOpenStatus, { ticketId });
      return response.data;
    } catch (error) {
      console.error('Error reopening ticket:', error);
      throw error;
    }
  },

  async filterTickets(filterData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.filterTicket, filterData);
      return response.data;
    } catch (error) {
      console.error('Error filtering tickets:', error);
      throw error;
    }
  },

  async downloadAllTickets() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.downloadAllTicket);
      return response.data;
    } catch (error) {
      console.error('Error downloading all tickets:', error);
      throw error;
    }
  },

  async downloadTicketById(ticketId) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.downloadTicketById}?ticketId=${ticketId}`);
      return response.data;
    } catch (error) {
      console.error('Error downloading ticket by ID:', error);
      throw error;
    }
  },

  // File Management
  async uploadFile(fileData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.uploadFile, fileData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  async deleteFile(fileId) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.deleteFile, { fileId });
      return response.data;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  },

  // Comments
  async showComment(ticketId) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.showComment}?ticketId=${ticketId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  async createComment(commentData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.createComment, commentData);
      return response.data;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },

  // Other
  async rateUs(ratingData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.rateUs, ratingData);
      return response.data;
    } catch (error) {
      console.error('Error submitting rating:', error);
      throw error;
    }
  },

  async fetchForm(formData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.fetchForm, formData);
      return response.data;
    } catch (error) {
      console.error('Error fetching form:', error);
      throw error;
    }
  }
};

export default apiClient;
