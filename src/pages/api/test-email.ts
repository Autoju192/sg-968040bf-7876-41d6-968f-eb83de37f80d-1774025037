import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

interface TestEmailRequest {
  to: string;
  settings: {
    smtp_host: string;
    smtp_port: string;
    smtp_username: string;
    smtp_password: string;
    from_email: string;
    from_name: string;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { to, settings } = req.body as TestEmailRequest;

    if (!to || !settings.smtp_host) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: settings.smtp_host,
      port: parseInt(settings.smtp_port),
      secure: false, // true for 465, false for other ports
      auth: {
        user: settings.smtp_username,
        pass: settings.smtp_password,
      },
    });

    // Send test email
    await transporter.sendMail({
      from: `"${settings.from_name}" <${settings.from_email}>`,
      to,
      subject: "TenderFlow AI - Test Email",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #7c3aed; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .success { background: #10b981; color: white; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>TenderFlow AI</h1>
            </div>
            <div class="content">
              <h2>Email Configuration Test</h2>
              <div class="success">
                <strong>✓ Success!</strong> Your email settings are configured correctly.
              </div>
              <p>This is a test email to verify your SMTP configuration.</p>
              <p><strong>Configuration Details:</strong></p>
              <ul>
                <li><strong>SMTP Host:</strong> ${settings.smtp_host}</li>
                <li><strong>SMTP Port:</strong> ${settings.smtp_port}</li>
                <li><strong>From Email:</strong> ${settings.from_email}</li>
                <li><strong>From Name:</strong> ${settings.from_name}</li>
              </ul>
              <p>You can now use this configuration to send automated notifications, deadline reminders, and tender alerts.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} TenderFlow AI. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return res.status(200).json({ 
      success: true,
      message: "Test email sent successfully" 
    });
  } catch (error) {
    console.error("Test email error:", error);
    return res.status(500).json({
      error: "Failed to send test email",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}