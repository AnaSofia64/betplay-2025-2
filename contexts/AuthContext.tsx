import { supabase } from "@/lib/supabaseClient";
import { createContext, useEffect, useState } from "react";

interface AuthContextProps {
  user: any;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 🔄 Escuchar sesión
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        await fetchProfile(data.session.user.id);
      }
    };
    getSession();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  // 📝 Función auxiliar para traer perfil
  const fetchProfile = async (id: string) => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (profile) {
      setUser(profile);
    }
  };

  // 🔑 Login
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      if (data.user) {
        await fetchProfile(data.user.id);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 📝 Register
const register = async (name: string, email: string, password: string) => {
  setIsLoading(true);
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    const newUser = data?.user;
    if (!newUser) throw new Error("No se pudo obtener el usuario");

    // Guardar en tabla profiles
    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: newUser.id,
        email,
        name,
        username: email.split("@")[0],
        bio: "",
        avatar_url: null,
        created_at: new Date(),
      },
    ]);
    if (profileError) throw profileError;

    await fetchProfile(newUser.id);

    return newUser; // 👈 ya devuelve el user listo
  } finally {
    setIsLoading(false);
  }
};


  // 🚪 Logout
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
