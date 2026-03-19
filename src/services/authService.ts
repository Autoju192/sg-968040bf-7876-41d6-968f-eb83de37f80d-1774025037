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
   * Sign up a new user - AUTHENTICATION-FIRST APPROACH
   * 
   * This method creates the auth user FIRST, then creates the organization
   * while authenticated, which satisfies the RLS policy requirement.
   */
  async signUp(
    email: string,
    password: string,
    fullName: string,
    organisationName: string,
    role: "admin" | "bid_manager" | "contributor" = "bid_manager"
  ) {
    try {
      console.log("🚀 Starting authentication-first signup...", { email, organisationName, role });

      // ============================================================
      // STEP 1: CREATE AUTH USER FIRST (No org needed yet)
      // ============================================================
      console.log("👤 Step 1: Creating Supabase Auth user...");
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            // Don't include org_id yet - we'll add it later
          },
        },
      });

      if (authError) {
        console.error("❌ Auth signup failed:", authError);
        
        // Provide user-friendly error messages
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
      // STEP 2: NOW USER IS AUTHENTICATED - Check for existing org
      // ============================================================
      console.log("🔍 Step 2: Checking for existing organisation (now authenticated)...");
      
      const { data: existingOrgs, error: checkError } = await supabase
        .from("organisations")
        .select("id, name")
        .ilike("name", organisationName);

      if (checkError) {
        console.warn("⚠️ Error checking existing organisation:", checkError);
        // Don't fail - continue with creation
      }

      let organisationId = existingOrgs?.[0]?.id;

      // ============================================================
      // STEP 3: CREATE ORGANIZATION (User is authenticated now!)
      // ============================================================
      if (!organisationId) {
        console.log("🏢 Step 3: Creating organisation (user is authenticated)...");
        
        const { data: newOrg, error: orgError } = await supabase
          .from("organisations")
          .insert({ name: organisationName })
          .select("id, name, created_at")
          .single();

        if (orgError) {
          console.error("❌ Organization creation failed:", orgError);
          
          // Handle duplicate key error (race condition)
          if (orgError.code === "23505") {
            console.log("🔄 Duplicate org detected, fetching existing...");
            const { data: fetchedOrg } = await supabase
              .from("organisations")
              .select("id")
              .ilike("name", organisationName)
              .single();
            
            if (fetchedOrg) {
              organisationId = fetchedOrg.id;
              console.log("✅ Using existing organization:", organisationId);
            }
          }

          // If we still don't have an org ID, something is seriously wrong
          if (!organisationId) {
            // Clean up: delete the auth user we just created
            console.log("🧹 Cleaning up: deleting auth user...");
            await supabase.auth.admin.deleteUser(authData.user.id);
            
            return {
              error: {
                message: "Failed to create organization. Please contact support.",
                details: orgError.message
              }
            };
          }
        } else {
          organisationId = newOrg.id;
          console.log("✅ Organization created successfully:", organisationId);
        }
      } else {
        console.log("✅ Using existing organization:", organisationId);
      }

      // ============================================================
      // STEP 4: CREATE USER PROFILE (Link user to organization)
      // ============================================================
      console.log("📝 Step 4: Creating user profile...");
      
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
        console.error("❌ User profile creation failed:", profileError);
        
        // Check if profile already exists (from database trigger)
        if (profileError.code === "23505") {
          console.log("✅ User profile already exists (created by trigger)");
          
          // Update the existing profile with correct org_id
          const { error: updateError } = await supabase
            .from("users")
            .update({
              full_name: fullName,
              organisation_id: organisationId,
              role: role,
            })
            .eq("id", authData.user.id);
          
          if (updateError) {
            console.error("⚠️ Failed to update existing profile:", updateError);
          } else {
            console.log("✅ Updated existing profile with organization");
          }
        } else {
          // Profile creation failed for another reason
          console.error("❌ Unexpected profile error:", profileError);
          
          // Don't fail signup - the trigger should handle it
          console.warn("⚠️ Continuing anyway - trigger should create profile");
        }
      } else {
        console.log("✅ User profile created successfully");
      }

      // ============================================================
      // STEP 5: UPDATE AUTH USER METADATA (Add org_id)
      // ============================================================
      console.log("🔄 Step 5: Updating auth user metadata...");
      
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          organisation_id: organisationId,
          role: role,
        },
      });

      if (metadataError) {
        console.warn("⚠️ Failed to update user metadata:", metadataError);
        // Don't fail signup - metadata is non-critical
      } else {
        console.log("✅ User metadata updated");
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