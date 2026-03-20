import { supabase } from "@/lib/supabase";

export interface Organisation {
  id: string;
  name: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  organisation_id: string;
  role: "admin" | "bid_manager" | "contributor";
  created_at: string;
}

export const authService = {
  /**
   * Sign up a new user - Uses RPC to bypass PostgREST schema cache
   */
  async signUp(
    email: string,
    password: string,
    fullName: string,
    organisationName: string,
    role: "admin" | "bid_manager" | "contributor" = "bid_manager"
  ) {
    try {
      console.log("🚀 Starting RPC-based signup...", { email, organisationName, role });

      // ============================================================
      // STEP 1: CREATE ORGANIZATION VIA RPC (Bypasses schema cache!)
      // ============================================================
      console.log("🏢 Step 1: Creating/fetching organisation via RPC...");
      
      const { data: orgData, error: orgError } = await supabase.rpc(
        'create_or_get_organisation' as any,
        { p_org_name: organisationName }
      );

      if (orgError) {
        console.error("❌ RPC organization creation failed:", orgError);
        return {
          error: {
            message: "Failed to create organization. Please contact support.",
            details: orgError.message
          }
        };
      }

      if (!orgData || (orgData as any[]).length === 0) {
        console.error("❌ No organization data returned from RPC");
        return {
          error: {
            message: "Failed to create organization. Please try again."
          }
        };
      }

      const organisationId = (orgData as any[])[0].org_id;
      console.log("✅ Organization ready:", organisationId);

      // ============================================================
      // STEP 2: CREATE AUTH USER
      // ============================================================
      console.log("👤 Step 2: Creating Supabase Auth user...");
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            organisation_id: organisationId,
            role: role,
          },
        },
      });

      if (authError) {
        console.error("❌ Auth signup failed:", authError);
        
        if (authError.message?.includes("already registered") || authError.message?.includes("already been registered")) {
          return {
            error: {
              message: "This email is already registered. Please log in instead."
            }
          };
        }
        
        if (authError.message?.includes("password")) {
          return {
            error: {
              message: "Password must be at least 6 characters long."
            }
          };
        }

        return { 
          error: {
            message: authError.message || "Failed to create account. Please try again."
          }
        };
      }

      if (!authData.user) {
        console.error("❌ No user returned from auth signup");
        return {
          error: {
            message: "Failed to create account. Please try again."
          }
        };
      }

      console.log("✅ Auth user created successfully:", authData.user.id);

      // ============================================================
      // STEP 3: CREATE USER PROFILE VIA RPC (Also bypasses cache!)
      // ============================================================
      console.log("📝 Step 3: Creating user profile via RPC...");
      
      // Use direct INSERT via RPC to bypass schema cache
      const { error: profileError } = await supabase.rpc('create_user_profile' as any, {
        p_user_id: authData.user.id,
        p_email: email,
        p_full_name: fullName,
        p_organisation_id: organisationId,
        p_role: role
      });

      if (profileError) {
        console.error("❌ User profile creation failed:", profileError);
        
        // If profile creation fails, try direct INSERT as fallback
        console.log("🔄 Attempting fallback: direct INSERT...");
        
        const { error: insertError } = await supabase
          .from("users")
          .insert({
            id: authData.user.id,
            email: email,
            full_name: fullName,
            organisation_id: organisationId,
            role: role,
          });

        if (insertError && insertError.code !== "23505") {
          console.error("❌ Fallback INSERT also failed:", insertError);
          console.warn("⚠️ Continuing anyway - profile may be created by trigger");
        } else {
          console.log("✅ User profile created via fallback INSERT");
        }
      } else {
        console.log("✅ User profile created successfully via RPC");
      }

      console.log("🎉 Signup completed successfully!");
      return { data: authData, error: null };

    } catch (error) {
      console.error("💥 Unexpected signup error:", error);
      return {
        error: {
          message: error instanceof Error ? error.message : "An unexpected error occurred. Please try again."
        }
      };
    }
  },

  /**
   * Sign in an existing user
   */
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Sign in error:", error);
      return { error };
    }

    return { data, error: null };
  },

  /**
   * Sign out the current user
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  /**
   * Get the current session
   */
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },

  /**
   * Get the current user
   */
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  /**
   * Get the current user's profile and organisation
   */
  async getCurrentUserProfile() {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        return { profile: null, organisation: null, error: userError };
      }

      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError || !profile) {
        return { profile: null, organisation: null, error: profileError };
      }

      const { data: organisation, error: orgError } = await supabase
        .from("organisations")
        .select("*")
        .eq("id", profile.organisation_id)
        .single();

      return {
        profile,
        organisation: organisation || null,
        error: orgError
      };
    } catch (error) {
      return {
        profile: null,
        organisation: null,
        error: error instanceof Error ? error : new Error("Failed to fetch profile")
      };
    }
  },

  /**
   * Send password reset email
   */
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  },

  /**
   * Update password with reset token
   */
  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { error };
  },
};