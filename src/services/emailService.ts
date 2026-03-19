import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

interface TenderDeadlineReminderParams {
  userEmail: string;
  userName: string;
  tenderTitle: string;
  tenderAuthority: string;
  deadline: string;
  daysLeft: number;
  tenderUrl: string;
}

interface NewTenderAlertParams {
  userEmail: string;
  userName: string;
  tenderTitle: string;
  tenderAuthority: string;
  tenderValue: number;
  aiScore: number;
  decision: string;
  deadline: string;
  tenderUrl: string;
}

interface StatusUpdateParams {
  userEmail: string;
  userName: string;
  tenderTitle: string;
  oldStatus: string;
  newStatus: string;
  updatedBy: string;
  tenderUrl: string;
}

interface TeamMentionParams {
  userEmail: string;
  userName: string;
  mentionedBy: string;
  commentText: string;
  tenderTitle: string;
  tenderAuthority: string;
  tenderUrl: string;
}

interface WelcomeEmailParams {
  userEmail: string;
  userName: string;
  organizationName: string;
  loginUrl: string;
}

interface WeeklyDigestParams {
  userEmail: string;
  userName: string;
  weekStart: string;
  weekEnd: string;
  newTenders: number;
  submittedBids: number;
  upcomingDeadlines: Array<{
    title: string;
    deadline: string;
    url: string;
  }>;
  highFitTenders: Array<{
    title: string;
    score: number;
    url: string;
  }>;
}

export const emailService = {
  // Core email sending function
  async sendEmail({ to, subject, html, from = "TenderFlow AI <notifications@tenderflow.ai>" }: SendEmailParams) {
    try {
      const { data, error } = await resend.emails.send({
        from,
        to,
        subject,
        html,
      });

      if (error) {
        console.error("❌ Email send error:", error);
        return { success: false, error };
      }

      console.log("✅ Email sent successfully:", data?.id);
      return { success: true, data };
    } catch (error) {
      console.error("❌ Email service error:", error);
      return { success: false, error };
    }
  },

  // Tender deadline reminder email
  async sendDeadlineReminder({
    userEmail,
    userName,
    tenderTitle,
    tenderAuthority,
    deadline,
    daysLeft,
    tenderUrl,
  }: TenderDeadlineReminderParams) {
    const urgencyColor = daysLeft <= 1 ? "#ef4444" : daysLeft <= 3 ? "#f59e0b" : "#10b981";
    const urgencyText = daysLeft === 0 ? "TODAY" : daysLeft === 1 ? "TOMORROW" : `${daysLeft} DAYS`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
          .header { background: linear-gradient(135deg, #7c3aed 0%, #9333ea 100%); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
          .content { padding: 40px 30px; }
          .alert-box { background: ${urgencyColor}; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px; }
          .alert-box h2 { margin: 0 0 10px 0; font-size: 32px; font-weight: 700; }
          .alert-box p { margin: 0; font-size: 16px; opacity: 0.9; }
          .tender-details { background: #f8fafc; border-left: 4px solid #7c3aed; padding: 20px; margin: 20px 0; border-radius: 4px; }
          .tender-details h3 { margin: 0 0 15px 0; font-size: 18px; color: #0f172a; }
          .detail-row { display: flex; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { font-weight: 600; color: #64748b; width: 120px; }
          .detail-value { color: #0f172a; flex: 1; }
          .cta-button { display: inline-block; background: #7c3aed; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px; }
          .cta-button:hover { background: #6d28d9; }
          .footer { background: #f8fafc; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 Tender Deadline Reminder</h1>
          </div>
          <div class="content">
            <div class="alert-box">
              <h2>⏰ ${urgencyText}</h2>
              <p>Deadline approaching for tender submission</p>
            </div>
            
            <p>Hi <strong>${userName}</strong>,</p>
            
            <p>This is a reminder that the deadline for the following tender is approaching:</p>
            
            <div class="tender-details">
              <h3>${tenderTitle}</h3>
              <div class="detail-row">
                <span class="detail-label">Authority:</span>
                <span class="detail-value">${tenderAuthority}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Deadline:</span>
                <span class="detail-value"><strong>${deadline}</strong></span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Time Left:</span>
                <span class="detail-value"><strong style="color: ${urgencyColor};">${urgencyText}</strong></span>
              </div>
            </div>
            
            <p><strong>Action Required:</strong></p>
            <ul>
              <li>Review all tender documents and requirements</li>
              <li>Complete outstanding sections and questions</li>
              <li>Gather supporting evidence and documentation</li>
              <li>Perform final quality review</li>
              <li>Submit before the deadline</li>
            </ul>
            
            <center>
              <a href="${tenderUrl}" class="cta-button">View Tender →</a>
            </center>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} TenderFlow AI. All rights reserved.</p>
            <p>You're receiving this because you have deadline reminders enabled.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: `⏰ Deadline ${urgencyText} - ${tenderTitle}`,
      html,
    });
  },

  // New tender alert email
  async sendNewTenderAlert({
    userEmail,
    userName,
    tenderTitle,
    tenderAuthority,
    tenderValue,
    aiScore,
    decision,
    deadline,
    tenderUrl,
  }: NewTenderAlertParams) {
    const scoreColor = aiScore >= 80 ? "#10b981" : aiScore >= 60 ? "#f59e0b" : "#ef4444";
    const decisionBadge = decision === "Bid" ? "#10b981" : decision === "Review" ? "#f59e0b" : "#ef4444";

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
          .header { background: linear-gradient(135deg, #7c3aed 0%, #9333ea 100%); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
          .content { padding: 40px 30px; }
          .badge { display: inline-block; background: ${decisionBadge}; color: white; padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; margin-bottom: 20px; }
          .score-box { background: linear-gradient(135deg, ${scoreColor}20 0%, ${scoreColor}10 100%); border: 2px solid ${scoreColor}; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
          .score-box h2 { margin: 0; font-size: 48px; font-weight: 700; color: ${scoreColor}; }
          .score-box p { margin: 10px 0 0 0; color: #64748b; }
          .tender-details { background: #f8fafc; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .detail-row { display: flex; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { font-weight: 600; color: #64748b; width: 120px; }
          .detail-value { color: #0f172a; flex: 1; }
          .cta-button { display: inline-block; background: #7c3aed; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px; }
          .footer { background: #f8fafc; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 New High-Fit Tender Alert</h1>
          </div>
          <div class="content">
            <span class="badge">Recommendation: ${decision.toUpperCase()}</span>
            
            <h2 style="margin-top: 10px; color: #0f172a;">${tenderTitle}</h2>
            
            <div class="score-box">
              <h2>${aiScore}%</h2>
              <p>AI Fit Score</p>
            </div>
            
            <p>Hi <strong>${userName}</strong>,</p>
            
            <p>A new tender matching your criteria has been added to your TenderFlow AI account. Our AI analysis indicates this is a ${aiScore >= 80 ? "strong" : aiScore >= 60 ? "good" : "moderate"} match for your organization.</p>
            
            <div class="tender-details">
              <div class="detail-row">
                <span class="detail-label">Authority:</span>
                <span class="detail-value">${tenderAuthority}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Value:</span>
                <span class="detail-value">£${tenderValue.toLocaleString()}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Deadline:</span>
                <span class="detail-value">${deadline}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">AI Score:</span>
                <span class="detail-value"><strong style="color: ${scoreColor};">${aiScore}%</strong></span>
              </div>
            </div>
            
            <p><strong>Why this tender is a good fit:</strong></p>
            <ul>
              <li>Strong alignment with your service capabilities</li>
              <li>Geographic coverage matches your service areas</li>
              <li>Compliance requirements can be met</li>
              <li>Evidence library supports key requirements</li>
            </ul>
            
            <center>
              <a href="${tenderUrl}" class="cta-button">View Tender Details →</a>
            </center>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} TenderFlow AI. All rights reserved.</p>
            <p>You're receiving this because you have new tender alerts enabled.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: `🎯 New ${decision} Tender - ${tenderTitle}`,
      html,
    });
  },

  // Status update email
  async sendStatusUpdate({
    userEmail,
    userName,
    tenderTitle,
    oldStatus,
    newStatus,
    updatedBy,
    tenderUrl,
  }: StatusUpdateParams) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
          .header { background: linear-gradient(135deg, #7c3aed 0%, #9333ea 100%); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
          .content { padding: 40px 30px; }
          .status-change { background: #f8fafc; padding: 30px; border-radius: 8px; text-align: center; margin: 20px 0; }
          .status-badge { display: inline-block; padding: 8px 20px; border-radius: 20px; font-weight: 600; margin: 0 10px; }
          .status-old { background: #e2e8f0; color: #64748b; }
          .status-new { background: #10b981; color: white; }
          .arrow { font-size: 24px; color: #64748b; margin: 0 10px; }
          .cta-button { display: inline-block; background: #7c3aed; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px; }
          .footer { background: #f8fafc; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 Tender Status Update</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${userName}</strong>,</p>
            
            <p>The status for "<strong>${tenderTitle}</strong>" has been updated:</p>
            
            <div class="status-change">
              <span class="status-badge status-old">${oldStatus}</span>
              <span class="arrow">→</span>
              <span class="status-badge status-new">${newStatus}</span>
            </div>
            
            <p><strong>Updated by:</strong> ${updatedBy}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            
            <center>
              <a href="${tenderUrl}" class="cta-button">View Tender →</a>
            </center>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} TenderFlow AI. All rights reserved.</p>
            <p>You're receiving this because you have status update notifications enabled.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: `📊 Status Changed: ${tenderTitle}`,
      html,
    });
  },

  // Team mention email
  async sendTeamMention({
    userEmail,
    userName,
    mentionedBy,
    commentText,
    tenderTitle,
    tenderAuthority,
    tenderUrl,
  }: TeamMentionParams) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
          .header { background: linear-gradient(135deg, #7c3aed 0%, #9333ea 100%); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
          .content { padding: 40px 30px; }
          .mention-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 4px; }
          .mention-box p { margin: 0; color: #78350f; font-style: italic; }
          .tender-info { background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .cta-button { display: inline-block; background: #7c3aed; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px; }
          .footer { background: #f8fafc; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💬 You were mentioned</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${userName}</strong>,</p>
            
            <p><strong>${mentionedBy}</strong> mentioned you in a comment:</p>
            
            <div class="mention-box">
              <p>"${commentText}"</p>
            </div>
            
            <div class="tender-info">
              <p><strong>Tender:</strong> ${tenderTitle}</p>
              <p><strong>Authority:</strong> ${tenderAuthority}</p>
            </div>
            
            <center>
              <a href="${tenderUrl}" class="cta-button">View Comment →</a>
            </center>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} TenderFlow AI. All rights reserved.</p>
            <p>You're receiving this because you have team mention notifications enabled.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: `💬 ${mentionedBy} mentioned you in ${tenderTitle}`,
      html,
    });
  },

  // Welcome email for new users
  async sendWelcomeEmail({
    userEmail,
    userName,
    organizationName,
    loginUrl,
  }: WelcomeEmailParams) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
          .header { background: linear-gradient(135deg, #7c3aed 0%, #9333ea 100%); color: white; padding: 50px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 32px; font-weight: 700; }
          .content { padding: 40px 30px; }
          .welcome-box { background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 30px; border-radius: 12px; margin: 20px 0; text-align: center; }
          .welcome-box h2 { margin: 0 0 10px 0; color: #0c4a6e; font-size: 28px; }
          .feature-list { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .feature-item { display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
          .feature-item:last-child { border-bottom: none; }
          .feature-icon { width: 40px; height: 40px; background: #7c3aed; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-size: 20px; }
          .cta-button { display: inline-block; background: #7c3aed; color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin-top: 20px; }
          .footer { background: #f8fafc; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to TenderFlow AI!</h1>
          </div>
          <div class="content">
            <div class="welcome-box">
              <h2>Hi ${userName}! 👋</h2>
              <p>You've been added to <strong>${organizationName}</strong></p>
            </div>
            
            <p>Welcome to TenderFlow AI, the intelligent platform for winning more tenders in the UK care sector.</p>
            
            <div class="feature-list">
              <div class="feature-item">
                <div class="feature-icon">🎯</div>
                <div>
                  <strong>AI Tender Scoring</strong><br>
                  <span style="color: #64748b; font-size: 14px;">Automatically evaluate tenders with 6-criteria AI scoring</span>
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon">🤖</div>
                <div>
                  <strong>AI Chat Assistant</strong><br>
                  <span style="color: #64748b; font-size: 14px;">Get instant answers about tenders, risks, and requirements</span>
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon">📝</div>
                <div>
                  <strong>Response Generator</strong><br>
                  <span style="color: #64748b; font-size: 14px;">Generate professional UK local authority tender responses</span>
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon">📚</div>
                <div>
                  <strong>Evidence Library</strong><br>
                  <span style="color: #64748b; font-size: 14px;">Store and reuse company content across multiple bids</span>
                </div>
              </div>
            </div>
            
            <p><strong>Next Steps:</strong></p>
            <ul>
              <li>Log in to your account</li>
              <li>Explore the dashboard and features</li>
              <li>Add your first tender</li>
              <li>Build your evidence library</li>
            </ul>
            
            <center>
              <a href="${loginUrl}" class="cta-button">Get Started →</a>
            </center>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} TenderFlow AI. All rights reserved.</p>
            <p>Need help? Contact support@tenderflow.ai</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: `🎉 Welcome to TenderFlow AI - ${organizationName}`,
      html,
    });
  },

  // Weekly digest email
  async sendWeeklyDigest({
    userEmail,
    userName,
    weekStart,
    weekEnd,
    newTenders,
    submittedBids,
    upcomingDeadlines,
    highFitTenders,
  }: WeeklyDigestParams) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
          .header { background: linear-gradient(135deg, #7c3aed 0%, #9333ea 100%); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
          .content { padding: 40px 30px; }
          .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
          .stat-card { background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center; border: 2px solid #e2e8f0; }
          .stat-number { font-size: 32px; font-weight: 700; color: #7c3aed; margin: 0; }
          .stat-label { color: #64748b; font-size: 14px; margin-top: 5px; }
          .section { margin: 30px 0; }
          .section h3 { color: #0f172a; margin-bottom: 15px; }
          .item-list { background: #f8fafc; border-radius: 8px; overflow: hidden; }
          .item { padding: 15px; border-bottom: 1px solid #e2e8f0; }
          .item:last-child { border-bottom: none; }
          .item-title { font-weight: 600; color: #0f172a; margin-bottom: 5px; }
          .item-meta { font-size: 14px; color: #64748b; }
          .cta-button { display: inline-block; background: #7c3aed; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px; }
          .footer { background: #f8fafc; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 Your Weekly Tender Summary</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">${weekStart} - ${weekEnd}</p>
          </div>
          <div class="content">
            <p>Hi <strong>${userName}</strong>,</p>
            
            <p>Here's your weekly summary of tender activity:</p>
            
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-number">${newTenders}</div>
                <div class="stat-label">New Tenders</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${submittedBids}</div>
                <div class="stat-label">Bids Submitted</div>
              </div>
            </div>
            
            ${upcomingDeadlines.length > 0 ? `
            <div class="section">
              <h3>⏰ Upcoming Deadlines</h3>
              <div class="item-list">
                ${upcomingDeadlines.map(deadline => `
                  <div class="item">
                    <div class="item-title">${deadline.title}</div>
                    <div class="item-meta">Deadline: ${deadline.deadline}</div>
                  </div>
                `).join('')}
              </div>
            </div>
            ` : ''}
            
            ${highFitTenders.length > 0 ? `
            <div class="section">
              <h3>🎯 High-Fit Tenders</h3>
              <div class="item-list">
                ${highFitTenders.map(tender => `
                  <div class="item">
                    <div class="item-title">${tender.title}</div>
                    <div class="item-meta">AI Score: <strong style="color: #10b981;">${tender.score}%</strong></div>
                  </div>
                `).join('')}
              </div>
            </div>
            ` : ''}
            
            <center>
              <a href="https://tenderflow.ai/dashboard" class="cta-button">View Dashboard →</a>
            </center>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} TenderFlow AI. All rights reserved.</p>
            <p>You're receiving this weekly digest. <a href="#" style="color: #7c3aed;">Manage preferences</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: `📊 Your Weekly Tender Summary - ${weekStart}`,
      html,
    });
  },
};