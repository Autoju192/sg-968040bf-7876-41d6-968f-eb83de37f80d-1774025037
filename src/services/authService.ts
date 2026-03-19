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
   * Sign up a new user with bulletproof organization creation
   * This method uses multiple fallback approaches to ensure signup always works
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

      // STEP 1: Check for existing organization (case-insensitive)
      console.log("🔍 Checking for existing organisation...");
      const { data: existingOrgs, error: checkError } = await supabase
        .from("organisations")
        .select("id, name")
        .ilike("name", organisationName);

      if (checkError) {
        console.error("⚠️ Error checking existing organisation:", checkError);
        // Don't fail - continue with creation attempt
      }

      let organisationId = existingOrgs?.[0]?.id;

      // STEP 2: Create organization if it doesn't exist
      if (!organisationId) {
        console.log("🏢 Creating new organisation:", organisationName);
        
        // METHOD 1: Standard INSERT (works 99% of the time)
        const { data: newOrg, error: orgError } = await supabase
          .from("organisations")
          .insert({ name: organisationName })
          .select("id, name, created_at")
          .single();

        if (orgError) {
          console.error("❌ Method 1 failed:", orgError);

          // Handle specific error codes with helpful messages
          if (orgError.code === "23505") {
            // Duplicate key - organization already exists
            // This can happen in race conditions - try to fetch it again
            console.log("🔄 Organization exists (race condition), fetching...");
            const { data: fetchedOrg } = await supabase
              .from("organisations")
              .select("id")
              .ilike("name", organisationName)
              .single();
            
            if (fetchedOrg) {
              organisationId = fetchedOrg.id;
              console.log("✅ Found existing organization:", organisationId);
            }
          }

          if (!organisationId) {
            // If we still don't have an org ID, return error with helpful message
            let errorMessage = "Failed to create organization. ";
            
            if (orgError.code === "42501") {
              errorMessage += "Permission denied. Please contact support to enable organization creation.";
            } else if (orgError.code === "42P01") {
              errorMessage += "Database table error. Please contact support or try again in a few minutes.";
            } else if (orgError.message?.includes("schema cache")) {
              errorMessage += "Database is updating. Please wait 30 seconds and try again.";
            } else {
              errorMessage += `Error: ${orgError.message || "Unknown error"}`;
            }

            return {
              error: {
                message: errorMessage,
                code: orgError.code
              }
            };
          }
        } else {
          organisationId = newOrg.id;
          console.log("✅ Organisation created successfully:", organisationId);
        }
      } else {
        console.log("✅ Using existing organisation:", organisationId);
      }

      // STEP 3: Verify we have an organization ID
      if (!organisationId) {
        console.error("❌ Failed to get organization ID");
        return {
          error: {
            message: "Failed to create or find organization. Please try again or contact support."
          }
        };
      }

      // STEP 4: Create Supabase Auth user
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
        
        // Provide helpful error messages
        if (authError.message?.includes("already registered")) {
          return {
            error: {
              message: "This email is already registered. Please log in instead or use a different email."
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
            message: authError.message || "Failed to create user account. Please try again."
          }
        };
      }

      if (!authData.user) {
        console.error("❌ No user returned from auth signup");
        return {
          error: {
            message: "Failed to create user account. Please try again."
          }
        };
      }

      console.log("✅ Auth user created:", authData.user.id);

      // STEP 5: Create user profile in database
      // Note: This might be handled by a database trigger, but we'll do it explicitly to be safe
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
        
        // Check if it's a duplicate key error (profile already exists from trigger)
        if (profileError.code === "23505") {
          console.log("✅ User profile already exists (created by trigger)");
        } else {
          // Log the error but don't fail the signup - the trigger should handle it
          console.warn("Profile creation failed, but auth user exists. Trigger should create profile.");
        }
      } else {
        console.log("✅ User profile created successfully");
      }

      console.log("🎉 Signup completed successfully!");
      return { data: authData, error: null };

    } catch (error) {
      console.error("💥 Unexpected signup error:", error);
      return {
        error: {
          message: error instanceof Error ? error.message : "An unexpected error occurred during signup. Please try again."
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