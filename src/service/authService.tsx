// service/authService.tsx
import { useCaptainStorage } from "@/store/captainStore";
import { tokenStorage } from "@/store/storage";
import { useUserStore } from "@/store/userStore";
import { resetAndNavigate } from "@/utils/Helpers";
import axios from "axios";
import { Alert } from "react-native";
import { BASE_URL } from "./config";

export interface AuthPayload {
  role: "customer" | "captain" | "store_owner";
  phone: string;
  firebasePushToken: string | null;
  forceSwitch?: boolean;
  name?: string;
  lastName?: string;
  email?: string;
  avatarUrl?: string;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  dni?: string;
  vehicle?: {
    type?: "bike" | "auto" | "car";
    licensePlate?: string;
    color?: string;
    model?: string;
  };
}

export const signin = async (
  payload: AuthPayload,
  updateAccessToken: () => void
) => {
  const { setUser } = useUserStore.getState();
  const { setUser: setCaptainUser } = useCaptainStorage.getState();

  try {
    console.log("Payload de signin:", payload);
    const res = await axios.post(`${BASE_URL}/api/v1/auth/signin`, payload);

    const user = res.data.user;
    const needsProfileSetup = !user.profile?.name || !user.profile?.lastName;

    tokenStorage.set("access_token", res.data.access_token);
    tokenStorage.set("refresh_token", res.data.refresh_token);
    updateAccessToken();

    if (res.data.user.role === "customer") {
      setUser(user);
      if (needsProfileSetup) {
        resetAndNavigate("/customer/profile-setup");
      } else {
        resetAndNavigate("/customer/home");
      }
    } else if (res.data.user.role === "captain") {
      setCaptainUser(user);
      // Check if captain has complete profile including vehicle
      const hasProfileData = user.profile?.name && user.profile?.lastName && user.profile?.dni;
      const hasVehicleData = user.vehicle?.licensePlate && user.vehicle?.type;
      const captainNeedsSetup = !hasProfileData || !hasVehicleData;
      
      if (captainNeedsSetup) {
        resetAndNavigate("/captain/profile-setup");
      } else {
        resetAndNavigate("/captain/home");
      }
    } else {
      setUser(user);
      resetAndNavigate("/customer/home");
    }
  } catch (error: any) {
    Alert.alert("Error: ", error?.response?.data?.msg || error?.message || "Error al iniciar sesión");
    console.log("Error: ", error?.response?.data?.msg || error?.message);
    throw error;
  }
};

export const updateProfile = async (profileData: {
  name?: string;
  lastName?: string;
  email?: string;
  avatarUrl?: string;
  gender?: string;
}) => {
  try {
    const res = await axios.patch(`${BASE_URL}/api/v1/auth/update-profile`, profileData);
    return res.data.user;
  } catch (error: any) {
    Alert.alert("Error", error?.response?.data?.msg || "Error al actualizar perfil");
    throw error;
  }
};

export const updateCaptainProfile = async (profileData: {
  name?: string;
  lastName?: string;
  email?: string;
  avatarUrl?: string;
  dni?: string;
  vehicle?: {
    type?: "bike" | "auto" | "car";
    licensePlate?: string;
    color?: string;
    model?: string;
  };
}) => {
  try {
    const res = await axios.patch(`${BASE_URL}/api/v1/auth/update-captain-profile`, profileData);
    return res.data.user;
  } catch (error: any) {
    Alert.alert("Error", error?.response?.data?.msg || "Error al actualizar perfil");
    throw error;
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
