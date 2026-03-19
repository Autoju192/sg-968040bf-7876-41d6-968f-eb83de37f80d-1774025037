import { supabase } from "@/lib/supabase";
import type { Tables } from "@/lib/supabase";

export type User = Tables<"users">;
export type Organisation = Tables<"organisations">;

/**
 * Sign up a new user with organisation
 */
export async function signUp(email: string, password: string, fullName: string, organisationName: string) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error("User creation failed");

  const { data: orgData, error: orgError } = await supabase
    .from("organisations")
    .insert({ name: organisationName })
    .select()
    .single();

  if (orgError) throw orgError;

  const { error: userError } = await supabase.from("users").insert({
    id: authData.user.id,
    organisation_id: orgData.id,
    email,
    full_name: fullName,
    role: "admin",
  });

  if (userError) throw userError;

  return { user: authData.user, organisation: orgData };
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

/**
 * Sign out current user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Get current user profile
 */
export async function getCurrentUserProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("users")
    .select("*, organisations(*)")
    .eq("id", user.id)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get current session
 */
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}