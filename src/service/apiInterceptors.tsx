import axios from 'axios'
import { BASE_URL } from './config'
import { supabase } from '@/lib/supabase'
import { logout } from './authService'

export const appAxios = axios.create({ baseURL: BASE_URL })

// Agrega el access token de Supabase en cada petición
appAxios.interceptors.request.use(async (config) => {
  const session = supabase.auth.getSession()
  const token = (await session).data?.session?.access_token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Manejo de errores 401
appAxios.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      // Supabase maneja auto-refresh; reenviar petición
      const { data, error } = await supabase.auth.refreshSession()
      if (error) {
        await logout()
        return Promise.reject(error)
      }
      err.config.headers.Authorization = `Bearer ${data.session?.access_token}`
      return axios(err.config)
    }
    return Promise.reject(err)
  }
)