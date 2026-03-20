import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

/**
 * Cron Job: Sync All Connections
 * Runs periodically to sync all active connections based on their schedule
 * 
 * Deploy with Vercel Cron:
 * vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/sync-connections",
 *     "schedule": "0 * * * *"
 *   }]
 * }
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Verify cron secret for security
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    console.log("🔄 Starting scheduled connection sync...");

    // Get all connections that are due for sync
    const { data: connections, error } = await supabase
      .from("portal_connections")
      .select("*")
      .eq("status", "connected")
      .lte("next_sync_at", new Date().toISOString());

    if (error) {
      throw error;
    }

    if (!connections || connections.length === 0) {
      console.log("✅ No connections due for sync");
      return res.status(200).json({
        success: true,
        message: "No connections due for sync",
        syncedCount: 0,
      });
    }

    console.log(`📊 Found ${connections.length} connections to sync`);

    const results = [];

    for (const connection of connections) {
      try {
        console.log(`🔄 Syncing: ${connection.connection_name}`);

        // Call sync API
        const syncResponse = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/sync-connection`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              connectionId: connection.id,
              organisationId: connection.organisation_id,
            }),
          }
        );

        const syncResult = await syncResponse.json();

        results.push({
          connectionId: connection.id,
          connectionName: connection.connection_name,
          success: syncResult.success,
          itemsFetched: syncResult.itemsFetched,
          itemsCreated: syncResult.itemsCreated,
        });

        // Update next sync time
        const nextSync = new Date();
        nextSync.setHours(nextSync.getHours() + (Number(connection.sync_frequency) || 6));

        await supabase
          .from("portal_connections")
          .update({
            next_sync_at: nextSync.toISOString(),
          } as any)
          .eq("id", connection.id);

        console.log(`✅ Synced: ${connection.connection_name}`);
      } catch (error: any) {
        console.error(`❌ Error syncing ${connection.connection_name}:`, error);
        results.push({
          connectionId: connection.id,
          connectionName: connection.connection_name,
          success: false,
          error: error.message,
        });
      }
    }

    console.log("🎉 Scheduled sync completed");

    return res.status(200).json({
      success: true,
      syncedCount: connections.length,
      results,
    });
  } catch (error: any) {
    console.error("❌ Cron job error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}