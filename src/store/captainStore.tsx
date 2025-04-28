import {create} from 'zustand'
import {createJSONStorage, persist} from 'zustand/middleware'
import {mmkvStorage} from './storage'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@supabase/supabase-js';

type CustomLocation = {
    latitude: number;
    longitude: number;
    address: string;
    heading: number;
} | null;

interface CaptainStoreProps {
    user: User | null;
    location: CustomLocation;
    onDuty: boolean;
    setUser: (data: any) => void;
    setOnDuty: (data: boolean) => void;
    setLocation: (data: CustomLocation) => void;
    clearCaptainData: () => void;
}

export const useCaptainStorage = create<CaptainStoreProps>()(
    persist(
        (set) => ({
            user: null,
            location: null,
            onDuty: false,
            setUser: (data) => set({ user: data }),
            setLocation: (data) => set({ location: data }),
            setOnDuty: (data) => set({ onDuty: data }), 
            clearCaptainData: () => set({ user: null, location: null, onDuty: false }),
        }),
        {
            name: "captain-store",
            partialize: (state) => ({
                user: state.user,
            }),
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);