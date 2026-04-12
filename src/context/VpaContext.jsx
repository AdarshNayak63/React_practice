import { jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from "react";
import { apiService } from "../services/apiService";
import { useAuth } from "./AuthContext";
const VpaContext = createContext(void 0);
const VpaProvider = ({ children }) => {
  const [vpaList, setVpaList] = useState([]);
  const [selectedVpa, setSelectedVpaState] = useState(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchVpas = async (force = false) => {
    if (!user) {
      setLoading(false);
      return;
    }
    if (!force && vpaList.length > 0) return;
    setLoading(true);
    setError(null);
    try {
      const userName = user?.profile?.preferred_username || "PNBADMIN";
      const res = await apiService.fetchUserById({ user_name: userName });
      console.log("[VpaContext] API Response:", res.data);
      const { data: dataArr, status, message } = res.data || {};
      if (status === 0 && dataArr && Array.isArray(dataArr)) {
        const mappedVpas = dataArr.map((item) => ({
          ...item,
          // Map serial_number to terminal_id if tid is missing as per instructions
          terminal_id: item.terminal_id || item.serial_number
        }));
        setVpaList(mappedVpas);
        if (!selectedVpa && mappedVpas.length > 0) {
          setSelectedVpaState(mappedVpas[0]);
        }
      } else {
        throw new Error(message || "No VPAs found for this user");
      }
    } catch (err) {
      console.error("Failed to fetch VPA list:", err);
      setError(err.message || "Failed to load VPAs");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user) {
      fetchVpas();
    } else {
      setVpaList([]);
      setSelectedVpaState(null);
    }
  }, [user]);
  const setSelectedVpa = (vpa) => {
    setSelectedVpaState(vpa);
  };
  return /* @__PURE__ */ jsx(VpaContext.Provider, { value: {
    vpaList,
    selectedVpa,
    setSelectedVpa,
    loading,
    error,
    refreshVpas: () => fetchVpas(true)
  }, children });
};
const useVpa = () => {
  const context = useContext(VpaContext);
  if (context === void 0) {
    throw new Error("useVpa must be used within a VpaProvider");
  }
  return context;
};
export {
  VpaProvider,
  useVpa
};
