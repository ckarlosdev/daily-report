import { useState } from "react";
import { useAuthStore } from "../hooks/authStore";
import { Button } from "react-bootstrap";
import { api } from "../hooks/apiConfig";
import dailyReportStore from "../stores/dailyReportStore";
import useManpowerStore from "../stores/useManpowerStore";
import useEquipmentStore from "../stores/useEquipmentStore";
import useRentalsStore from "../stores/useRentalsStore";
import useDumpsterStore from "../stores/useDumpsterStore";
import useToolStore from "../stores/useToolStore";

const LogoutButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const refreshToken = useAuthStore((state) => state.refreshToken);

  const { reset: resetDailyReport } = dailyReportStore();
  const { reset: resetManpower } = useManpowerStore();
  const { reset: resetEquipment } = useEquipmentStore();
  const { reset: resetTools } = useToolStore();
  const { reset: resetRentals } = useRentalsStore();
  const { reset: resetDumpsters } = useDumpsterStore();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      if (refreshToken) {
        await api.post("/auth/revoke", { refreshToken });
      }
    } catch (error) {
      console.error(
        "Error al revocar token, cerrando sesión localmente...",
        error
      );
    } finally {
      logout();
      handleReset();
      window.location.href = "https://ckarlosdev.github.io/login/";
    }
  };

  const handleReset = () => {
    resetDailyReport();
    resetManpower();
    resetEquipment();
    resetTools();
    resetRentals();
    resetDumpsters();
  };

  return (
    <Button
      onClick={handleLogout}
      disabled={isLoading}
      variant="outline-danger"
      style={{
        borderRadius: "10px",
        fontWeight: "bold",
        width: "120px",
        height: "40px",
      }}
    >
      {isLoading ? <span>Logging out</span> : <>Logout</>}
    </Button>
  );
};

export default LogoutButton;
