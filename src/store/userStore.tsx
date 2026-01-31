import {create} from 'zustand'
import {createJSONStorage, persist} from 'zustand/middleware'
import {mmkvStorage} from './storage'

type CustomLocation = {
    latitude: number;
    longitude: number;
    address: string
} | null;

export interface FavoriteLocation {
    place_id: string;
    title: string;
    description: string;
    latitude?: number;
    longitude?: number;
}

interface UserStorageProps {
    user: any;
    location: CustomLocation;
    outOfRange: boolean;
    favorites: FavoriteLocation[];
    setUser: (data: any) => void;
    SetOutOfRange: (data: boolean) => void;
    setLocation: (data: CustomLocation) => void;
    addFavorite: (location: FavoriteLocation) => void;
    removeFavorite: (place_id: string) => void;
    isFavorite: (place_id: string) => boolean;
    clearData: () => void;
}

export const useUserStore = create<UserStorageProps>()(
    persist(
        (set, get) => ({
            user: null,
            location: null,
            outOfRange: false,
            favorites: [],
            setUser: (data) => set({ user: data }),
            setLocation: (data) => set({ location: data }),
            SetOutOfRange: (data) => set({ outOfRange: data }),
            addFavorite: (location) => set((state) => ({
                favorites: [...state.favorites.filter(f => f.place_id !== location.place_id), location]
            })),
            removeFavorite: (place_id) => set((state) => ({
                favorites: state.favorites.filter(f => f.place_id !== place_id)
            })),
            isFavorite: (place_id) => {
                return get().favorites.some(f => f.place_id === place_id)
            },
            clearData: () => set({ user: null, location: null, outOfRange: false, favorites: [] }),
        }),
        {
            name: "user-store",
            partialize: (state) => ({
                user: state.user,
                favorites: state.favorites,
            }),
            storage: createJSONStorage(() => mmkvStorage),
        }
    )
);