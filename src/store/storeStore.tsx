import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { mmkvStorage } from "./storage";
import { Store, Product, Delivery } from "@/service/storeService";

interface StoreState {
  // Tienda actual
  currentStore: Store | null;
  stores: Store[];
  
  // Productos
  products: Product[];
  
  // Pedidos
  orders: Delivery[];
  
  // Loading states
  isLoading: boolean;
  
  // Actions
  setCurrentStore: (store: Store | null) => void;
  setStores: (stores: Store[]) => void;
  addStore: (store: Store) => void;
  updateStore: (storeId: string, updates: Partial<Store>) => void;
  
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  removeProduct: (productId: string) => void;
  
  setOrders: (orders: Delivery[]) => void;
  addOrder: (order: Delivery) => void;
  updateOrder: (orderId: string, updates: Partial<Delivery>) => void;
  
  setIsLoading: (loading: boolean) => void;
  clearStoreData: () => void;
}

export const useStoreStorage = create<StoreState>()(
  persist(
    (set) => ({
      currentStore: null,
      stores: [],
      products: [],
      orders: [],
      isLoading: false,
      
      setCurrentStore: (store) => set({ currentStore: store }),
      
      setStores: (stores) => set({ stores }),
      
      addStore: (store) =>
        set((state) => ({ stores: [...state.stores, store] })),
      
      updateStore: (storeId, updates) =>
        set((state) => ({
          stores: state.stores.map((s) =>
            s._id === storeId ? { ...s, ...updates } : s
          ),
          currentStore:
            state.currentStore?._id === storeId
              ? { ...state.currentStore, ...updates }
              : state.currentStore,
        })),
      
      setProducts: (products) => set({ products }),
      
      addProduct: (product) =>
        set((state) => ({ products: [...state.products, product] })),
      
      updateProduct: (productId, updates) =>
        set((state) => ({
          products: state.products.map((p) =>
            p._id === productId ? { ...p, ...updates } : p
          ),
        })),
      
      removeProduct: (productId) =>
        set((state) => ({
          products: state.products.filter((p) => p._id !== productId),
        })),
      
      setOrders: (orders) => set({ orders }),
      
      addOrder: (order) =>
        set((state) => ({ orders: [order, ...state.orders] })),
      
      updateOrder: (orderId, updates) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o._id === orderId ? { ...o, ...updates } : o
          ),
        })),
      
      setIsLoading: (loading) => set({ isLoading: loading }),
      
      clearStoreData: () =>
        set({
          currentStore: null,
          stores: [],
          products: [],
          orders: [],
          isLoading: false,
        }),
    }),
    {
      name: "store-storage",
      partialize: (state) => ({
        currentStore: state.currentStore,
        stores: state.stores,
      }),
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
