import { AppState } from 'react-native'
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import { tokenStorage as mmkv } from '@/store/storage'
import { Database } from '@/database.types'

const supabaseUrl = "https://sicrlgmeulybwcxcpcyh.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpY3JsZ21ldWx5YndjeGNwY3loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxOTA4ODMsImV4cCI6MjA2MDc2Njg4M30.VPzwmsjfgWGoodOAQOce5AWjs1TZqldPvBepWRB4Jko"

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

AppState.addEventListener('change', (state) => {
  if (state === 'active') supabase.auth.startAutoRefresh()
  else supabase.auth.stopAutoRefresh()
})