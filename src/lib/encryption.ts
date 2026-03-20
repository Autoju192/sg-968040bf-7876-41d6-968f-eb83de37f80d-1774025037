import crypto from "crypto";

/**
 * Encryption utilities for secure token storage
 */

const algorithm = "aes-256-cbc";

function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  
  if (!key) {
    throw new Error(
      "ENCRYPTION_KEY not set in environment variables. Generate one with: openssl rand -hex 32"
    );
  }

  return Buffer.from(key.slice(0, 32));
}

/**
 * Encrypt sensitive data (OAuth tokens, API keys, etc.)
 */
export function encrypt(data: any): string {
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    
    let encrypted = cipher.update(JSON.stringify(data), "utf8", "hex");
    encrypted += cipher.final("hex");
    
    return `${iv.toString("hex")}:${encrypted}`;
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt data");
  }
}

/**
 * Decrypt sensitive data
 */
export function decrypt(encryptedData: string): any {
  try {
    const key = getEncryptionKey();
    const [ivHex, encrypted] = encryptedData.split(":");
    
    if (!ivHex || !encrypted) {
      throw new Error("Invalid encrypted data format");
    }
    
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    
    return JSON.parse(decrypted);
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Failed to decrypt data");
  }
}

/**
 * Check if Gmail tokens need refresh
 */
export function needsTokenRefresh(tokens: any): boolean {
  if (!tokens.expires_at) return true;
  // Refresh if expiring in next 5 minutes
  return Date.now() > tokens.expires_at - 5 * 60 * 1000;
}

/**
 * Refresh Gmail OAuth tokens
 */
export async function refreshGmailTokens(refreshToken: string): Promise<any> {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh Gmail tokens");
  }

  const data = await response.json();
  
  return {
    access_token: data.access_token,
    refresh_token: refreshToken, // Refresh token stays the same
    expires_at: Date.now() + data.expires_in * 1000,
  };
}