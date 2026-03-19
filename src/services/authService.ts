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
   * Sign up a new user with comprehensive error handling
   */
  async signUp(
    email: string,
    password: string,
    fullName: string,
    organisationName: string,
    role: "admin" | "bid_manager" | "contributor" = "bid_manager"
  ) {
    try {
      console.log("🚀 Starting signup process...", { email, organisationName, role });

      // First, check if organization exists (case-insensitive)
      console.log("🔍 Checking for existing organisation...");
      const { data: existingOrg, error: checkError } = await supabase
        .from("organisations")
        .select("id, name")
        .ilike("name", organisationName)
        .maybeSingle();

      if (checkError) {
        console.error("⚠️ Error checking existing organisation:", checkError);
        // Don't fail on check error, continue with creation attempt
      }

      let organisationId = existingOrg?.id;

      // Create organization if it doesn't exist
      if (!organisationId) {
        console.log("🏢 Creating new organisation:", organisationName);
        
        // Use direct SQL insert to bypass schema cache issues
        const { data: newOrg, error: orgError } = await supabase.rpc(
          "create_organisation",
          { org_name: organisationName }
        ).maybeSingle();

        // If RPC function doesn't exist, fall back to regular insert
        if (orgError && orgError.code === "42883") {
          console.log("📝 Using direct insert method...");
          const { data: directInsert, error: directError } = await supabase
            .from("organisations")
            .insert({ name: organisationName })
            .select("id")
            .single();

          if (directError) {
            console.error("❌ Organization creation failed:", directError);
            
            // Handle specific error codes
            if (directError.code === "42P01") {
              return {
                error: {
                  message: "Database table error. Please contact support or try again in a few minutes."
                }
              };
            }
            
            if (directError.code === "42501") {
              return {
                error: {
                  message: "Permission denied. Please contact support to enable organization creation."
                }
              };
            }

            if (directError.code === "23505") {
              return {
                error: {
                  message: "Organization name already exists. Please use a different name."
                }
              };
            }

            return {
              error: {
                message: `Failed to create organization: ${directError.message || "Unknown error"}`
              }
            };
          }

          organisationId = directInsert.id;
        } else if (orgError) {
          console.error("❌ RPC organization creation failed:", orgError);
          return {
            error: {
              message: `Failed to create organization: ${orgError.message || "Unknown error"}`
            }
          };
        } else {
          organisationId = newOrg?.id;
        }

        console.log("✅ Organisation created successfully:", organisationId);
      } else {
        console.log("✅ Using existing organisation:", organisationId);
      }

      if (!organisationId) {
        return {
          error: {
            message: "Failed to get organization ID. Please try again."
          }
        };
      }

      // Sign up the user with Supabase Auth
      console.log("👤 Creating auth user...");
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
        console.error("❌ Auth signup error:", authError);
        return { error: authError };
      }

      if (!authData.user) {
        return {
          error: {
            message: "Failed to create user account. Please try again."
          }
        };
      }

      console.log("✅ Auth user created:", authData.user.id);

      // Create user profile in database
      console.log("📝 Creating user profile...");
      const { error: profileError } = await supabase
        .from("users")
        .insert({
          id: authData.user.id,
          email: email,
          full_name: fullName,
          organisation_id: organisationId,
          role: role,
        });

      if (profileError) {
        console.error("⚠️ Error creating user profile:", profileError);
        // Continue anyway - the trigger should handle this
      } else {
        console.log("✅ User profile created successfully");
      }

      console.log("🎉 Signup completed successfully!");
      return { data: authData, error: null };
    } catch (error) {
      console.error("💥 Unexpected signup error:", error);
      return {
        error: {
          message: error instanceof Error ? error.message : "An unexpected error occurred"
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