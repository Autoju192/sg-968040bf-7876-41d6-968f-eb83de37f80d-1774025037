import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import * as authService from "@/services/authService";
import type { User, Organisation } from "@/services/authService";

interface AuthContextType {
  user: SupabaseUser | null;
  profile: User | null;
  organisation: Organisation | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, organisationName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [organisation, setOrganisation] = useState<Organisation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.getSession().then((session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile();
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await loadProfile();
      } else {
        setProfile(null);
        setOrganisation(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile() {
    try {
      const data = await authService.getCurrentUserProfile();
      if (data) {
        setProfile(data);
        setOrganisation(data.organisations as Organisation);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  }

  const signIn = async (email: string, password: string) => {
    await authService.signIn(email, password);
  };

  const signUp = async (email: string, password: string, fullName: string, organisationName: string) => {
    await authService.signUp(email, password, fullName, organisationName);
  };

  const signOut = async () => {
    await authService.signOut();
    setProfile(null);
    setOrganisation(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        organisation,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}