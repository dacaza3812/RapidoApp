import { useUserStore } from "@/store/userStore";
import { Banners } from "@/utils/types";
import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "./config";

export const useBannersByCity = () => {
    const [banners, setBanners] = useState<Banners[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const {location} = useUserStore()
    const [provincy, setProvincy] = useState<string | null>(null)
  
    const getBannersByCity = async () => {
      
      const strCity = location?.address || "";
      const partesCity = strCity.split(/\s*,\s*/);
      const city = partesCity[partesCity.length - 2];
      setLoading(true);
      try {
        if (!city) return
        setProvincy(city)
        const response = await axios.post(`${BASE_URL}/banner/by-city`, { cities: [city.toString()] });
        setBanners(response.data.banners);
      } catch (err) {
        console.error("Error al obtener banners por ciudad:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
  
    return { banners, loading, error, location, getBannersByCity, provincy };
  };