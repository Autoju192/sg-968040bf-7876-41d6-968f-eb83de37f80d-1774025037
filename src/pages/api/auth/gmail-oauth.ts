import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Gmail OAuth 2.0 Initiation
 * Redirects user to Google OAuth consent screen
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { organisationId } = req.query;

    if (!organisationId) {
      return res.status(400).json({ error: "Missing organisationId" });
    }

    // Build OAuth URL
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/gmail-callback`;
    
    if (!clientId) {
      return res.status(500).json({ error: "Google OAuth not configured. Add GOOGLE_CLIENT_ID to environment variables." });
    }

    const scopes = [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/userinfo.email",
    ];

    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.append("client_id", clientId);
    authUrl.searchParams.append("redirect_uri", redirectUri);
    authUrl.searchParams.append("response_type", "code");
    authUrl.searchParams.append("scope", scopes.join(" "));
    authUrl.searchParams.append("access_type", "offline");
    authUrl.searchParams.append("prompt", "consent");
    authUrl.searchParams.append("state", organisationId as string);

    // Redirect to Google OAuth
    res.redirect(authUrl.toString());
  } catch (error: any) {
    console.error("OAuth initiation error:", error);
    return res.status(500).json({ error: error.message });
  }
}