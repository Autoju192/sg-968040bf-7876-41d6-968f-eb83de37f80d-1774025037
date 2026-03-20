import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Sync Connection API
 * Triggers a sync for a specific portal connection
 * Routes to the appropriate ingestion handler
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { connectionId, connectionType, sourceType, config, organisationId, tenderId } =
      req.body;

    if (!connectionId || !connectionType || !organisationId) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    console.log(`🔄 Syncing connection: ${connectionId} (${connectionType})`);

    let result;

    // Route to appropriate handler based on connection type
    switch (connectionType) {
      case "PUBLIC_API":
        if (sourceType === "find_a_tender") {
          result = await fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/ingest/find-a-tender`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                connectionId,
                organisationId,
                keywords: config?.keywords,
                location: config?.location,
              }),
            }
          );
        } else if (sourceType === "contracts_finder") {
          result = await fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/ingest/contracts-finder`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                connectionId,
                organisationId,
                keywords: config?.keywords,
                location: config?.location,
              }),
            }
          );
        } else {
          throw new Error(`Unsupported source type: ${sourceType}`);
        }
        break;

      case "EMAIL":
        if (sourceType === "gmail") {
          // Note: Would need OAuth access token here
          result = await fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/ingest/gmail`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                connectionId,
                organisationId,
                accessToken: config?.accessToken || "demo-token",
              }),
            }
          );
        } else {
          throw new Error(`Unsupported source type: ${sourceType}`);
        }
        break;

      case "LINK_WATCHER":
        result = await fetch(
          `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/ingest/link-watcher`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              connectionId,
              organisationId,
              url: config?.url,
              tenderId,
            }),
          }
        );
        break;

      case "PORTAL_SESSION":
        // Future: Portal login integration
        throw new Error("Portal session integration not yet implemented");

      default:
        throw new Error(`Unsupported connection type: ${connectionType}`);
    }

    if (result && !result.ok) {
      const error = await result.json();
      throw new Error(error.error || "Sync failed");
    }

    const data = result ? await result.json() : { success: true };

    return res.status(200).json(data);
  } catch (error: any) {
    console.error("❌ Sync error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}