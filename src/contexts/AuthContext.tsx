import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { User, Organisation, authService } from "@/services/authService";

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
    authService.getSession().then(({ session }) => {
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
      if (data && data.profile) {
        // Cast the database profile to our User interface
        const userProfile: User = {
          id: data.profile.id,
          email: data.profile.email,
          full_name: data.profile.full_name,
          organisation_id: data.profile.organisation_id,
          role: data.profile.role as User["role"],
          created_at: data.profile.created_at || new Date().toISOString()
        };
        setProfile(userProfile);
        
        if (data.organisation) {
          const org: Organisation = {
            id: data.organisation.id,
            name: data.organisation.name,
            created_at: data.organisation.created_at || new Date().toISOString()
          };
          setOrganisation(org);
        }
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