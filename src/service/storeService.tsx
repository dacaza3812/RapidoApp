import { Alert } from "react-native";
import { appAxios } from "./apiInterceptors";

export interface Store {
  _id: string;
  name: string;
  description?: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    latitude: number;
    longitude: number;
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  businessHours?: {
    monday?: { open: string; close: string };
    tuesday?: { open: string; close: string };
    wednesday?: { open: string; close: string };
    thursday?: { open: string; close: string };
    friday?: { open: string; close: string };
    saturday?: { open: string; close: string };
    sunday?: { open: string; close: string };
  };
  categories: string[];
  logo?: string;
  banner?: string;
  isActive: boolean;
  deliveryRadius: number;
  averageDeliveryTime: number;
  minimumOrderAmount: number;
  deliveryFee: number;
  taxRate: number;
  paymentMethods: string[];
  ratings?: {
    average: number;
    total: number;
  };
  totalOrders: number;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  store: string;
  images: string[];
  thumbnail: string;
  weight?: number;
  inventory: number;
  lowInventoryThreshold: number;
  isAvailable: boolean;
  isActive: boolean;
  tags?: string[];
  rating?: {
    average: number;
    total: number;
  };
  salesCount: number;
  featured: boolean;
  discount: number;
  discountValidUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Delivery {
  _id: string;
  orderNumber: string;
  trackingCode: string;
  deliveryType: string;
  store: string;
  customer: {
    _id: string;
    profile: {
      name: string;
      lastName: string;
    };
    phone: string;
  };
  captain?: {
    _id: string;
    profile: {
      name: string;
      lastName: string;
    };
  };
  items: {
    product: string;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
    notes?: string;
  }[];
  pickup: {
    address: {
      street: string;
      city: string;
    };
    latitude: number;
    longitude: number;
    estimatedTime?: string;
    actualTime?: string;
  };
  delivery: {
    address: {
      street: string;
      city: string;
    };
    latitude: number;
    longitude: number;
    instructions?: string;
    actualTime?: string;
  };
  pricing: {
    subtotal: number;
    tax: number;
    deliveryFee: number;
    total: number;
    currency: string;
    tip?: number;
    discount?: number;
  };
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  otp: string;
  createdAt: string;
  updatedAt: string;
}

// Obtener mis tiendas
export const getMyStores = async (): Promise<Store[]> => {
  try {
    const res = await appAxios.get("/api/v1/stores/my-stores");
    return res.data.stores || [];
  } catch (error: any) {
    Alert.alert("Error", error?.response?.data?.msg || "Error al obtener tiendas");
    throw error;
  }
};

// Obtener tienda por ID
export const getStoreById = async (storeId: string): Promise<Store> => {
  try {
    const res = await appAxios.get(`/api/v1/stores/${storeId}`);
    return res.data.store;
  } catch (error: any) {
    Alert.alert("Error", error?.response?.data?.msg || "Error al obtener tienda");
    throw error;
  }
};

// Actualizar tienda
export const updateStore = async (
  storeId: string,
  storeData: Partial<Store>
): Promise<Store> => {
  try {
    const res = await appAxios.patch(`/api/v1/stores/${storeId}`, storeData);
    Alert.alert("Éxito", "Tienda actualizada correctamente");
    return res.data.store;
  } catch (error: any) {
    Alert.alert("Error", error?.response?.data?.msg || "Error al actualizar tienda");
    throw error;
  }
};

// Cambiar estado de la tienda (activo/inactivo)
export const toggleStoreStatus = async (
  storeId: string,
  isActive: boolean
): Promise<void> => {
  try {
    await appAxios.patch(`/api/v1/stores/${storeId}/status`, { isActive });
    Alert.alert(
      "Éxito",
      isActive ? "Tienda activada" : "Tienda desactivada"
    );
  } catch (error: any) {
    Alert.alert("Error", error?.response?.data?.msg || "Error al cambiar estado");
    throw error;
  }
};

// Obtener productos de la tienda
export const getStoreProducts = async (storeId: string): Promise<Product[]> => {
  try {
    const res = await appAxios.get(`/api/v1/products/store/${storeId}`);
    return res.data.products || [];
  } catch (error: any) {
    Alert.alert("Error", error?.response?.data?.msg || "Error al obtener productos");
    throw error;
  }
};

// Crear producto
export const createProduct = async (
  storeId: string,
  productData: Partial<Product>
): Promise<Product> => {
  try {
    const res = await appAxios.post(
      `/api/v1/products/store/${storeId}`,
      productData
    );
    Alert.alert("Éxito", "Producto creado correctamente");
    return res.data.product;
  } catch (error: any) {
    Alert.alert("Error", error?.response?.data?.msg || "Error al crear producto");
    throw error;
  }
};

// Actualizar producto
export const updateProduct = async (
  productId: string,
  productData: Partial<Product>
): Promise<Product> => {
  try {
    const res = await appAxios.patch(`/api/v1/products/${productId}`, productData);
    Alert.alert("Éxito", "Producto actualizado correctamente");
    return res.data.product;
  } catch (error: any) {
    Alert.alert("Error", error?.response?.data?.msg || "Error al actualizar producto");
    throw error;
  }
};

// Eliminar producto
export const deleteProduct = async (productId: string): Promise<void> => {
  try {
    await appAxios.delete(`/api/v1/products/${productId}`);
    Alert.alert("Éxito", "Producto eliminado correctamente");
  } catch (error: any) {
    Alert.alert("Error", error?.response?.data?.msg || "Error al eliminar producto");
    throw error;
  }
};

// Actualizar inventario
export const updateProductInventory = async (
  productId: string,
  inventory: number
): Promise<Product> => {
  try {
    const res = await appAxios.patch(`/api/v1/products/${productId}/inventory`, {
      inventory,
    });
    return res.data.product;
  } catch (error: any) {
    Alert.alert("Error", error?.response?.data?.msg || "Error al actualizar inventario");
    throw error;
  }
};

// Obtener pedidos de la tienda
export const getStoreOrders = async (storeId: string): Promise<Delivery[]> => {
  try {
    const res = await appAxios.get(`/api/v1/stores/${storeId}/orders`);
    return res.data.orders || [];
  } catch (error: any) {
    Alert.alert("Error", error?.response?.data?.msg || "Error al obtener pedidos");
    throw error;
  }
};

// Obtener categorías de productos
export const getProductCategories = async (): Promise<string[]> => {
  try {
    const res = await appAxios.get("/api/v1/products/categories");
    return res.data.categories || [];
  } catch (error: any) {
    console.error("Error al obtener categorías:", error);
    return [];
  }
};
