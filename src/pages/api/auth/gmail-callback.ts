import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";
import crypto from "crypto";

/**
 * Gmail OAuth 2.0 Callback
 * Exchanges authorization code for access/refresh tokens
 * Stores encrypted tokens in database
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { code, state: organisationId, error } = req.query;

    if (error) {
      return res.redirect(`/integrations?error=${error}`);
    }

    if (!code || !organisationId) {
      return res.redirect("/integrations?error=missing_parameters");
    }

    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/gmail-callback`,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error("Token exchange failed:", errorData);
      return res.redirect("/integrations?error=token_exchange_failed");
    }

    const tokens = await tokenResponse.json();

    // Get user email
    const userInfoResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      }
    );

    const userInfo = await userInfoResponse.json();

    // Encrypt tokens before storing
    const encryptedTokens = encryptTokens({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: Date.now() + tokens.expires_in * 1000,
    });

    // Create or update Gmail connection
    const { data: existingConnection } = await supabase
      .from("portal_connections")
      .select("id")
      .eq("organisation_id", organisationId)
      .eq("source_type", "gmail")
      .single();

    if (existingConnection) {
      // Update existing connection
      await supabase
        .from("portal_connections")
        .update({
          config: {
            email: userInfo.email,
          },
          credentials: encryptedTokens,
          status: "connected",
          error_message: null,
          error_count: 0,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingConnection.id);
    } else {
      // Create new connection
      await supabase.from("portal_connections").insert({
        organisation_id: organisationId as string,
        connection_name: `Gmail - ${userInfo.email}`,
        connection_type: "EMAIL",
        source_type: "gmail",
        config: {
          email: userInfo.email,
        },
        credentials: encryptedTokens,
        status: "connected",
        sync_frequency: 2, // Every 2 hours
        next_sync_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      });
    }

    // Redirect back to integrations page
    return res.redirect("/integrations?success=gmail_connected");
  } catch (error: any) {
    console.error("OAuth callback error:", error);
    return res.redirect(`/integrations?error=${encodeURIComponent(error.message)}`);
  }
}

/**
 * Encrypt tokens using AES-256-CBC
 */
function encryptTokens(tokens: any): string {
  const algorithm = "aes-256-cbc";
  const key = Buffer.from(
    process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString("hex").slice(0, 32)
  );
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(JSON.stringify(tokens), "utf8", "hex");
  encrypted += cipher.final("hex");

  return `${iv.toString("hex")}:${encrypted}`;
}