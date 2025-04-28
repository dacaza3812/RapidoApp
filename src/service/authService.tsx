import { supabase } from '@/lib/supabase'
import { useUserStore } from '@/store/userStore'
import { useCaptainStorage } from '@/store/captainStore'
import { resetAndNavigate } from '@/utils/Helpers'
import { Alert } from 'react-native'
import { makeRedirectUri } from 'expo-auth-session'

interface UserData {
  first_name: string;
  last_name: string;
  phone: string;
  province: string;
  fare: number;
  role: string;
  firebase?: string | null;
  captain_type_car?: 	"bike"| "auto"| "cab"| "auto_premium" | null
}

interface UserOptions {
  data: UserData;
}

interface User {
  email: string;
  password: string;
  phone: string;
  options: UserOptions;
}

// Signup (registro)
export const signup = async ({
  email,
  password,
  options: { data: {
    fare,
    firebase,
    first_name,
    last_name,
    phone,
    province,
    captain_type_car,
    role } } }: User) => {

  const redirectTo = makeRedirectUri();
  const { setUser } = useUserStore.getState();
  const { setUser: setCaptainUser } = useCaptainStorage.getState();
  const { data: userData, error } = await supabase.auth.signUp({
    email,
    password,
    phone,
    options: {
      data: {
        first_name: first_name,
        last_name,
        phone,
        province,
        fare,
        role,
        firebase,
        captain_type_car,
      },
      emailRedirectTo: `${redirectTo}/sign-in`
    }
  })

  if (error) throw error
  /*
    if (role === "customer") {
      setUser(userData.user);
      resetAndNavigate("/customer/home");
    } else {
      setCaptainUser(userData.user);
      resetAndNavigate("/captain/home");
    }
  */
}

type singInType = {
  email: string,
  password: string,
  role: "captain" | "customer"
}

// Signin (inicio de sesión)
export const signin = async ({ email, password, role }: singInType) => {
  const { setUser } = useUserStore.getState();
  const { setUser: setCaptainUser } = useCaptainStorage.getState();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error


  // const { data: userdata } = await supabase.auth.getUser()


  if (role === "customer") {
    try {
       await supabase
        .from('rapido_users')
        .update({ iscaptainnow: false })
        .eq('id', data.user.id)
        .select()
    } catch (error) {
      console.log(error)
    }
    setUser(data.user);
    resetAndNavigate("/customer/home");
  } else {
    try {
      await supabase
       .from('rapido_users')
       .update({ iscaptainnow: true })
       .eq('id', data.user.id)
       .select()
   } catch (error) {
     console.log(error)
   }
    setCaptainUser(data.user);
    resetAndNavigate("/captain/home");
  }
}

// Logout
export const logout = async (disconnect?: () => void) => {
  try {
    const {data: {session}} = await supabase.auth.getSession()
  if(session?.user.user_metadata.role === "captain"){
    await supabase
        .from('rapido_users')
        .update({ iscaptainnow: false })
        .eq('id', session.user.id)
        .select()
  }
  } catch (error) {
    console.log(error)
  }
  if (disconnect) disconnect()
  await supabase.auth.signOut()
  useUserStore.getState().clearData()
  useCaptainStorage.getState().clearCaptainData()
  resetAndNavigate('/(auth)/sign-in')
}