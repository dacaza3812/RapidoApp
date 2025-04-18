// service/authService.tsx
import { useCaptainStorage } from "@/store/captainStore";
import { tokenStorage } from "@/store/storage";
import { useUserStore } from "@/store/userStore";
import { resetAndNavigate } from "@/utils/Helpers";
import axios from "axios";
import { Alert } from "react-native";
import { BASE_URL } from "./config";

export const signin = async (
    payload: {
      role: "customer" | "captain";
      phone: string;
      firebasePushToken: string | null;
      forceSwitch?: true;     // ← Añadido opcional
    },
    updateAccessToken: () => void
  ) => {
    const { setUser } = useUserStore.getState();
    const { setUser: setCaptainUser } = useCaptainStorage.getState();
  
    try {
      console.log("Payload de signin:", payload);  // para depurar
      const res = await axios.post(`${BASE_URL}/auth/signin`, payload);
  
      if (res.data.user.role === "customer") {
        setUser(res.data.user);
        resetAndNavigate("/customer/home");
      } else {
        setCaptainUser(res.data.user);
        resetAndNavigate("/captain/home");
      }
  
      tokenStorage.set("access_token", res.data.access_token);
      tokenStorage.set("refresh_token", res.data.refresh_token);
      updateAccessToken();
    } catch (error: any) {
      Alert.alert("Error: ", error?.response?.data?.msg || "Error al iniciar sesión");
      console.log("Error: ", error?.response?.data?.msg || "Error al iniciar sesión");
    }
  };

export const logout = async (disconnect?: () => void) => {
  if (disconnect) {
    disconnect();
  }
  const { clearData } = useUserStore.getState();
  const { clearCaptainData } = useCaptainStorage.getState();

  tokenStorage.clearAll();
  clearCaptainData();
  clearData();
  resetAndNavigate("/role");
};
