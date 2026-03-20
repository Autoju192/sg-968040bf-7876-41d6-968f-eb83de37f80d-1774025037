# Complete Tutorial Example: Gmail Connection

**Category**: Integrations  
**Time to Complete**: 15 minutes  
**Last Updated**: March 2026

---

## 1. What This Feature Does

The Gmail Connection automatically reads your tender alert emails and adds them to TenderFlow. Instead of manually copying tender details from every email you receive, the system does it for you - saving hours each week and ensuring you never miss an opportunity.

## 2. Why It Matters

Most councils and procurement portals send tender alerts by email. Without Gmail Connection, you'd need to:
- Read every email manually
- Copy tender details into TenderFlow
- Remember to check your inbox regularly
- Risk missing urgent deadlines

With Gmail Connection, tender emails flow automatically into your TenderFlow Inbox, already summarised by AI and ready for action. It's like having a virtual assistant sorting your emails 24/7.

## 3. What You Need Before You Start

Before connecting Gmail, make sure you have:

- **A Gmail account** where you receive tender alerts (this works with Google Workspace accounts too)
- **Tender alert emails** already arriving in your Gmail (if not, sign up for alerts first)
- **Admin access** to your TenderFlow account (only admins can set up connections)
- **15 minutes** to complete the setup

**Note**: If you use Outlook or another email provider, don't worry - you can still use our Link Watcher feature or forward emails to TenderFlow manually.

## 4. Step-by-Step Setup

### Step 1: Navigate to Integrations

1. Log into TenderFlow AI
2. Click **"Integrations"** in the left sidebar (look for the plug icon 🔌)
3. You'll see the Integrations page with different connection options

**What you should see**: A page showing cards for Gmail, Find a Tender, Contracts Finder, and other connections.

---

### Step 2: Start Gmail Connection

1. Click the **"Add Connection"** button (green button in top right)
2. A dialog box appears with connection types
3. Click **"EMAIL"** (📧 icon)
4. You'll see a form for connecting your Gmail account

**What you should see**: A form asking for connection details and a blue "Connect with Google" button.

---

### Step 3: Connect Your Google Account

1. Click the **"Connect with Google"** button
2. You'll be redirected to Google's sign-in page (this is normal - it's Google's secure login, not ours)
3. Sign in with the Gmail account that receives your tender alerts
4. Google will ask: "TenderFlow AI wants to access your Google Account"

**What you should see**: A Google permissions screen listing what TenderFlow will access:
- Read emails
- View your email address

**Why we need these permissions**:
- **Read emails**: To find and process tender alerts
- **Email address**: To show which account is connected

---

### Step 4: Grant Permissions

1. Review the permissions (we only read emails - we can't send, delete, or modify anything)
2. Click **"Allow"** or **"Continue"**
3. Google will redirect you back to TenderFlow
4. You should see: "Gmail connected successfully" ✅

**What you should see**: You're back in TenderFlow, and a new connection card appears showing "Gmail - your@email.com" with a green "Connected" status.

---

### Step 5: Configure Sync Settings (Optional)

The connection works with default settings, but you can adjust:

1. Click on your Gmail connection card
2. You'll see:
   - **Connection name**: Change this to something memorable (e.g., "Work Gmail" or "Council Alerts")
   - **Sync frequency**: How often to check for new emails (default: every 2 hours)
   - **Email address**: Shows which Gmail account is connected

3. Click **"Save"** if you made changes

**What you should see**: Your updated settings saved, and the connection card reflects any name changes.

---

### Step 6: Test the Connection

1. Find your Gmail connection card
2. Click **"Sync Now"** button
3. Wait 5-10 seconds
4. You should see "Last synced: Just now" ✅

5. Now check your TenderFlow Inbox:
   - Click **"Inbox"** in the sidebar
   - Look for new items from the past week
   - You should see tender-related emails appear

**What you should see**: Your recent tender alert emails now appear in TenderFlow Inbox, with AI-generated summaries and action items.

---

## 5. How to Use It Day to Day

Once Gmail Connection is set up, it runs automatically. Here's your typical workflow:

### Daily (5 minutes)
1. **Check your Inbox** in TenderFlow (not Gmail)
2. New tender emails appear automatically every 2 hours
3. Each email has:
   - AI summary
   - Required action (e.g., "Review tender eligibility")
   - Priority level
   - Link to full tender (if available)

4. Click **"View Tender"** to see full details
5. Click **"Mark as Read"** once you've dealt with it

### Weekly (10 minutes)
1. **Review sync history**:
   - Go to Integrations
   - Click your Gmail connection
   - Click **"View Sync History"**
   - Check emails are syncing regularly

2. **Archive processed emails**:
   - In your Inbox, filter by "Read"
   - Archive items you've finished with
   - Keeps your Inbox tidy

### When you get a tender alert email
1. **Do nothing** - TenderFlow will automatically:
   - Find the email within 2 hours
   - Extract tender details
   - Summarise with AI
   - Add to your Inbox
   - Notify you if urgent

2. **Or speed it up**:
   - Go to Integrations
   - Click **"Sync Now"** to check immediately
   - Useful for urgent deadlines

---

## 6. What Happens After Setup

Once your Gmail Connection is working:

### Automatic Processing
- **Every 2 hours**, TenderFlow checks your Gmail
- Finds tender-related emails (ignores personal emails)
- Uses AI to extract:
  - Tender title
  - Council/authority name
  - Deadline
  - Link to full tender
  - Required actions

### In Your Inbox
Each tender email becomes an Inbox item showing:
- **Summary**: What the tender is about
- **Source**: "Gmail" badge
- **Type**: "New Tender", "Update", "Clarification", etc.
- **Priority**: Low, Medium, High, or Urgent
- **Action**: What you need to do next

### Matching to Existing Tenders
- If an email is about a tender you're already tracking, TenderFlow links them automatically
- You'll see the update in your tender's Activity timeline
- No duplicates created

### Notifications
- You get an in-app notification for:
  - New high-priority tenders
  - Urgent deadline changes
  - Clarification requests

- You can also enable email notifications (in Settings)

---

## 7. Common Mistakes to Avoid

### ❌ Mistake: Connecting personal Gmail instead of work Gmail
**Problem**: Your personal Gmail doesn't receive tender alerts, so nothing syncs  
**Instead**: Connect the Gmail account where councils actually send tender alerts. If you have multiple Gmail accounts, connect the right one first.

---

### ❌ Mistake: Expecting instant syncing
**Problem**: You connect Gmail and immediately check Inbox - nothing appears yet  
**Instead**: Wait a few minutes or click "Sync Now" to force an immediate check. The first sync takes longer as it processes recent emails.

---

### ❌ Mistake: Revoking Google permissions
**Problem**: You go to Google Account settings and remove TenderFlow access - syncing stops  
**Instead**: Leave permissions in place. If you need to disconnect, do it through TenderFlow (Integrations page) not Google.

---

### ❌ Mistake: Not setting up email forwarding rules
**Problem**: Tender emails go to a folder you don't check, so TenderFlow doesn't see them  
**Instead**: Ensure tender alert emails arrive in your main Gmail inbox, or set up Gmail filters to forward them automatically.

---

### ❌ Mistake: Connecting with read-only permissions
**Problem**: During Google authorization, you click "Deny" on some permissions  
**Instead**: Click "Allow" for all permissions. TenderFlow only reads emails - it can't send, delete, or modify anything.

---

## 8. Troubleshooting

### Problem: "OAuth error" during connection

**Symptoms**: After clicking "Connect with Google", you see an error page saying "OAuth error" or "Authorization failed"

**Solution**:
1. Check you're using the correct Gmail account (work, not personal)
2. Go back to TenderFlow Integrations
3. Try connecting again
4. When Google asks for permissions, make sure to click "Allow" (not "Deny")
5. Check your organisation's IT policy - some companies block third-party app connections
6. Still stuck? Your IT team may need to whitelist TenderFlow in Google Workspace admin

---

### Problem: No emails syncing

**Symptoms**: Connected successfully, but after an hour, still no emails appear in TenderFlow Inbox

**Solution**:
1. Check connection status:
   - Go to Integrations
   - Find your Gmail connection
   - Status should be green "Connected"

2. Check if tender emails are actually arriving:
   - Open Gmail in another tab
   - Do you have tender alert emails in the past week?
   - If not, sign up for alerts first

3. Force a manual sync:
   - Click your Gmail connection in Integrations
   - Click "Sync Now"
   - Wait 30 seconds
   - Check Inbox again

4. Check sync history:
   - Click "View Sync History" on your connection
   - Look for errors or "0 items fetched"
   - If errors appear, note the error message

5. Verify email format:
   - TenderFlow works best with HTML emails containing tender details
   - Some councils send text-only emails - these work too but may need AI training

6. Still nothing? Contact support with:
   - Your Gmail address (we won't see your emails, just connection logs)
   - Screenshot of sync history
   - Example of a tender email you expected to see

---

### Problem: Connection shows "Error" status

**Symptoms**: Gmail connection card shows red "Error" badge

**Solution**:
1. Click the connection card to see the error message
2. Common errors and fixes:

   **"Token expired"**:
   - Your Google authorization expired (happens after 6 months)
   - Solution: Disconnect and reconnect Gmail
   - Go to Integrations → Gmail → Delete Connection
   - Add new Gmail connection

   **"Permission denied"**:
   - Someone revoked TenderFlow access in Google settings
   - Solution: Reconnect and grant all permissions

   **"Rate limit exceeded"**:
   - Too many API requests (rare)
   - Solution: Wait 1 hour, system will retry automatically

3. If error persists after reconnecting, contact support

---

### Problem: Wrong emails being synced

**Symptoms**: Personal emails or spam appearing in TenderFlow Inbox

**Solution**:
- This is rare - our AI filters out non-tender emails
- If it happens:
  1. Mark the item as "Archived" in your Inbox
  2. Report it: Click the item → "Report Issue"
  3. Our AI learns and improves over time
  
- To reduce noise:
  - Set up Gmail filters to label tender emails
  - Only forward labeled emails to TenderFlow
  - (Advanced: requires Gmail filter rules - see our Gmail Filters guide)

---

### Problem: Syncing very slowly

**Symptoms**: Emails take 4-6 hours to appear in TenderFlow

**Solution**:
1. Check sync frequency:
   - Go to Integrations → Gmail connection
   - Default is "Every 2 hours"
   - You can change to "Every 1 hour" for faster syncing

2. Use "Sync Now" for urgent emails:
   - Manually trigger sync when you know a tender email just arrived
   - Faster than waiting for next scheduled sync

3. Note: Very frequent syncing (every 30 mins) may hit Google API limits
   - Stick with 1-2 hour frequency unless you need faster

---

## 9. Best Practice Tips

### 💡 Set up Gmail filters for automatic forwarding
Create a Gmail filter that forwards tender emails to TenderFlow automatically:
1. In Gmail, click Settings (⚙️) → "See all settings"
2. Go to "Filters and Blocked Addresses"
3. Create a new filter:
   - From: contains your council email domains
   - Subject: contains "tender" or "contract notice"
4. Forward to: your TenderFlow email address (we'll provide this)

This ensures TenderFlow sees tender emails even if your sync is delayed.

---

### 💡 Use multiple Gmail connections for different councils
If you manage tenders for multiple regions:
1. Set up separate Gmail accounts (or folders)
2. Connect each Gmail to TenderFlow separately
3. Name them clearly: "Manchester Gmail", "London Gmail"
4. Filter your Inbox by source to see tenders from each region

This keeps different workstreams organised.

---

### 💡 Check sync history weekly
Every Monday morning:
1. Go to Integrations
2. Click your Gmail connection
3. Click "View Sync History"
4. Check the past week shows successful syncs
5. If you see failures, investigate immediately

Proactive monitoring prevents missed tenders.

---

### 💡 Enable email notifications for urgent tenders
In Settings → Notifications:
1. Enable "Email notifications"
2. Choose "High priority only"
3. Enter your mobile email (e.g., yourphone@sms-gateway.com)

You'll get instant SMS-style alerts for urgent tenders.

---

### 💡 Archive processed Inbox items weekly
Every Friday afternoon:
1. Go to Inbox
2. Filter by "Read"
3. Select all processed items
4. Click "Archive"

Keeps your Inbox clean for Monday morning.

---

### 💡 Train the AI by reporting mis-classified emails
If an email is wrongly categorized (e.g., "Update" should be "New Tender"):
1. Click the Inbox item
2. Click "Report Issue"
3. Tell us the correct category
4. Our AI learns and improves for everyone

Your feedback makes the system smarter.

---

### 💡 Don't delete your Gmail tender alerts
Even though TenderFlow syncs them:
- Keep tender emails in Gmail as backup
- Use Gmail's archive feature (don't delete)
- Useful if you need to reference the original email
- TenderFlow stores summaries, not full email content

---

### 💡 Set up a dedicated tender alerts Gmail account
Instead of using your personal Gmail:
1. Create: tenders@yourcompany.com (Google Workspace)
2. Subscribe to all council tender alerts with this email
3. Connect this Gmail to TenderFlow
4. Share access with your team

Benefits:
- No personal emails mixed with work
- Team members can access if you're on holiday
- Professional appearance when contacting councils

---

## 10. Example Workflow

### Scenario
Emma is a Bid Manager at a care provider in Yorkshire. She wants to automate her tender email processing, which currently takes 2 hours a week.

---

### Monday, 9am - Initial Setup (15 minutes)

**9:00am - Connect Gmail**
1. Emma logs into TenderFlow
2. Goes to Integrations → "Add Connection"
3. Chooses "EMAIL" → "Connect with Google"
4. Signs in with her work Gmail: emma@yorkshirecare.com
5. Grants TenderFlow permission to read emails
6. Sees "Gmail connected successfully" ✅
7. Names the connection "Work Gmail - Tender Alerts"

**9:05am - Configure and Test**
1. Emma checks sync frequency: "Every 2 hours" ✓
2. Clicks "Sync Now" to test
3. Waits 10 seconds
4. Goes to Inbox in TenderFlow

**9:07am - First Sync Complete**
1. Emma sees 8 new Inbox items from the past week
2. Each shows:
   - Email subject as title
   - AI summary: "New tender for adult social care in Leeds"
   - Priority: "High"
   - Action: "Review tender eligibility"
3. She clicks one to view full details
4. Tender details automatically extracted: title, deadline, value, link

**Result**: Emma's past week of tender emails are now in TenderFlow, processed and ready for action.

---

### Tuesday, 10am - Daily Check (5 minutes)

**10:00am - Check TenderFlow Inbox**
1. Emma logs in
2. Clicks "Inbox" in sidebar
3. Sees 3 new items since yesterday (synced automatically)
4. One is marked "Urgent" with red badge
5. It's a deadline change email from Leeds City Council

**10:02am - Take Action**
1. Emma clicks the urgent item
2. Reads AI summary: "Tender deadline extended from March 25 to April 1"
3. Clicks "View Tender" to see full tender page
4. Updates the deadline in tender details
5. Marks Inbox item as "Read"
6. Adds a note: "Good news - extra week to prepare"

**10:05am - Quick Review**
1. Emma reviews the other 2 new items:
   - One is a clarification Q&A document posted
   - One is a weekly tender digest (not urgent)
2. She marks both as "Read"
3. Makes a note to download the Q&A document later

**Result**: Emma stays on top of tender updates without checking multiple emails. Total time: 5 minutes vs 30 minutes reading emails manually.

---

### Wednesday, 2pm - Urgent Email Arrives (2 minutes)

**2:00pm - Notification Arrives**
1. Emma receives an urgent tender alert email in Gmail
2. Subject: "URGENT: New tender - Domiciliary Care - Bradford"
3. She wants it in TenderFlow immediately (not wait 2 hours)

**2:01pm - Manual Sync**
1. Emma opens TenderFlow
2. Goes to Integrations
3. Finds "Work Gmail" connection
4. Clicks "Sync Now"
5. Waits 10 seconds

**2:02pm - Email Processed**
1. Goes to Inbox
2. New item appears at top:
   - Title: "URGENT: New tender - Domiciliary Care - Bradford"
   - Priority: "Urgent" (red badge)
   - Summary: "New tender opportunity in Bradford. Value £500K, deadline March 30. Requires CQC rating Good or Outstanding."
   - Action: "Review tender eligibility and AI score"
3. Emma clicks "View Tender"
4. Full tender opens, AI already scored it: 87% (high fit)
5. She assigns it to her colleague John: "Please prepare initial response by Friday"

**Result**: Emma processed an urgent tender in 2 minutes. Without TenderFlow, she would have spent 15 minutes copying details manually.

---

### Friday, 4pm - Weekly Review (10 minutes)

**4:00pm - Check Connection Health**
1. Emma goes to Integrations
2. Finds "Work Gmail" connection
3. Status shows: "Connected ✅"
4. Last synced: "2 hours ago"
5. Clicks "View Sync History"

**4:02pm - Review Sync Logs**
1. Emma sees 15 syncs this week:
   - Monday: 8 emails processed
   - Tuesday: 3 emails processed
   - Wednesday: 5 emails processed
   - Thursday: 4 emails processed
   - Friday: 2 emails processed
2. All syncs show "Success ✅"
3. Total: 22 tender emails automatically processed

**4:05pm - Archive Processed Items**
1. Emma goes to Inbox
2. Clicks filter: "Read"
3. Shows 20 processed items
4. She selects all
5. Clicks "Archive"
6. Inbox now shows only 2 unread items

**4:08pm - Plan for Next Week**
1. Emma notes that sync is working perfectly
2. She sets a calendar reminder: "Check TenderFlow sync - every Monday 9am"
3. She also enables email notifications for "Urgent" items only (Settings → Notifications)

**Result**: Emma's Gmail Connection processed 22 tender emails this week automatically. Saved approximately 2 hours of manual work. Everything syncing smoothly.

---

### Summary of Time Saved

**Before TenderFlow Gmail Connection**:
- Daily email checking: 30 mins
- Weekly total: 2.5 hours
- Manual data entry errors: Common
- Missed emails: Occasional

**After TenderFlow Gmail Connection**:
- Daily TenderFlow check: 5 mins
- Weekly total: 25 mins
- Manual data entry: None (automated)
- Missed emails: Never (syncs 24/7)

**Time saved per week**: 2 hours  
**Time saved per year**: 104 hours (2.5 working weeks!)

---

## Related Tutorials

- 📧 **Tender Inbox**: Learn how to manage your unified tender inbox
- 🔗 **Link Watcher**: Monitor tender portal URLs for changes
- 🌐 **Find a Tender**: Connect to UK's official tender portal
- 🤖 **AI Chat Assistant**: Ask AI about tender emails and updates

---

## Still Need Help?

- 💬 **Chat with AI**: Click "Ask AI Help Assistant" in the Help Centre
- 📧 **Email support**: support@tenderflow.ai
- 📞 **Call us**: 0800 123 4567 (Mon-Fri, 9am-5pm)
- 📖 **Video tutorial**: [Watch on YouTube](#) (coming soon)

---

**Last updated**: March 2026  
**Tutorial version**: 1.0  
**Tested on**: TenderFlow AI v2.0