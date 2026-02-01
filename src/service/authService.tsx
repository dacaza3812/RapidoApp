import { Alert } from "react-native";
import { appAxios } from "./apiInterceptors";
import { router } from "expo-router";
import { resetAndNavigate } from "@/utils/Helpers";
import { tokenStorage } from "@/store/storage";
import { useUserStore } from "@/store/userStore";
import { useCaptainStorage } from "@/store/captainStore";

export interface RegisterPayload {
  role: "customer" | "captain" | "store_owner";
  phone: string;
  password: string;
  name: string;
  lastName: string;
  email?: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  // Captain specific
  dni?: string;
  vehicle?: {
    type: "bike" | "auto" | "car";
    licensePlate: string;
    color?: string;
    model?: string;
  };
  // Store specific
  businessName?: string;
  taxId?: string;
  // Push token
  firebasePushToken?: string | null;
}

export interface LoginPayload {
  phone: string;
  password: string;
  role: "customer" | "captain" | "store_owner";
  firebasePushToken?: string | null;
}

// REGISTRO - Solo crea usuarios nuevos
export const register = async (
  payload: RegisterPayload,
  updateAccessToken: () => void
) => {
  try {
    const { setUser } = useUserStore.getState();
    const { setUser: setCaptainUser } = useCaptainStorage.getState();

    const res = await appAxios.post("/api/v1/auth/register", payload);

    const user = res.data.user;

    tokenStorage.set("access_token", res.data.access_token);
    tokenStorage.set("refresh_token", res.data.refresh_token);
    updateAccessToken();

    // Redirigir según el rol
    if (user.role === "customer") {
      setUser(user);
      resetAndNavigate("/customer/home");
    } else if (user.role === "captain") {
      setCaptainUser(user);
      resetAndNavigate("/captain/home");
    } else if (user.role === "store_owner") {
      setUser(user);
      resetAndNavigate("/store/home");
    }

    return { success: true, user };
  } catch (error: any) {
    const errorMsg = error?.response?.data?.msg || "Error al registrar usuario";
    Alert.alert("Error", errorMsg);
    console.log("Register error:", error?.response?.data || error);
    throw error;
  }
};

// LOGIN - Solo autentica usuarios existentes
export const login = async (
  payload: LoginPayload,
  updateAccessToken: () => void
) => {
  try {
    const { setUser } = useUserStore.getState();
    const { setUser: setCaptainUser } = useCaptainStorage.getState();

    const res = await appAxios.post("/api/v1/auth/login", payload);

    const user = res.data.user;

    tokenStorage.set("access_token", res.data.access_token);
    tokenStorage.set("refresh_token", res.data.refresh_token);
    updateAccessToken();

    // Redirigir según el rol
    if (user.role === "customer") {
      setUser(user);
      resetAndNavigate("/customer/home");
    } else if (user.role === "captain") {
      setCaptainUser(user);
      resetAndNavigate("/captain/home");
    } else if (user.role === "store_owner") {
      setUser(user);
      resetAndNavigate("/store/home");
    }

    return { success: true, user };
  } catch (error: any) {
    const errorMsg = error?.response?.data?.msg || "Error al iniciar sesión";
    Alert.alert("Error", errorMsg);
    console.log("Login error:", error?.response?.data || error);
    throw error;
  }
};

export const updateProfile = async (profileData: {
  name?: string;
  lastName?: string;
  email?: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  gender?: string;
}) => {
  try {
    const res = await appAxios.patch(
      "/api/v1/auth/update-profile",
      profileData
    );
    return res.data.user;
  } catch (error: any) {
    Alert.alert(
      "Error",
      error?.response?.data?.msg || "Error al actualizar perfil"
    );
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
    const res = await appAxios.patch(
      "/api/v1/auth/update-captain-profile",
      profileData
    );
    return res.data.user;
  } catch (error: any) {
    Alert.alert(
      "Error",
      error?.response?.data?.msg || "Error al actualizar perfil"
    );
    throw error;
  }
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
  try {
    const res = await appAxios.patch("/api/v1/auth/change-password", {
      currentPassword,
      newPassword,
    });
    Alert.alert("Éxito", "Contraseña actualizada correctamente");
    return true;
  } catch (error: any) {
    Alert.alert(
      "Error",
      error?.response?.data?.msg || "Error al cambiar contraseña"
    );
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
