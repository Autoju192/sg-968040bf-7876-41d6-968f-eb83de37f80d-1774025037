# Gmail Connection Tutorial for TenderFlow AI

**Category**: Integrations  
**Time to Complete**: 15 minutes  
**Difficulty**: Beginner  
**Last Updated**: March 2026

---

## 📧 What Gmail Connection Does

Gmail Connection automatically reads your tender alert emails and adds them to TenderFlow AI. Instead of manually checking your inbox, copying tender details, and creating records yourself, the system does all this for you - every few hours, around the clock.

When a council emails you about a new tender, TenderFlow AI:
- Reads the email automatically
- Extracts the important details (deadline, value, contact)
- Summarises what the tender is about using AI
- Identifies what action you need to take
- Creates a new item in your TenderFlow Inbox
- Sends you a notification if it's urgent

**Result**: You save hours each week and never miss an opportunity because you were busy or forgot to check your emails.

---

## 🎯 Why This Matters

Most councils and procurement portals send tender alerts by email. Without Gmail Connection, your daily routine looks like this:

**Without Gmail Connection (Manual Process):**
- Check Gmail every 2 hours (30 minutes/day)
- Read each tender email carefully (15 minutes)
- Copy details into TenderFlow manually (20 minutes)
- Create tasks for your team (10 minutes)
- Risk missing weekend emails (whole opportunities lost)
- **Total time**: 75 minutes per day = 6.5 hours per week

**With Gmail Connection (Automated):**
- System checks Gmail every 2 hours automatically
- AI reads and summarises emails for you
- Details appear in TenderFlow ready to review
- Actions are suggested automatically
- Nothing missed, even at weekends
- **Total time**: 15 minutes per day = 2 hours per week

**You save 4.5 hours every week** - that's 234 hours per year, or nearly 6 working weeks. You can spend that time writing better bids instead of doing admin.

---

## ✅ What You Need Before You Start

Before connecting Gmail to TenderFlow, make sure you have:

**Essential Requirements:**
- ✅ **A Gmail account** where you receive tender alerts (e.g., alerts@yourcompany.com)
- ✅ **Tender emails arriving** in that Gmail account already
- ✅ **Admin access** to your TenderFlow AI account
- ✅ **15 minutes** to complete the setup without interruptions

**Helpful (But Not Essential):**
- 📧 Tender alert emails organised in a Gmail label/folder (makes testing easier)
- 🔑 Password for your Gmail account handy (you'll need to sign in)
- 👥 IT team contact details (in case your organisation blocks third-party apps)

**What You Don't Need:**
- ❌ Technical knowledge - this guide explains everything
- ❌ Gmail API keys or developer credentials
- ❌ Permission from Google - standard Gmail accounts work fine

---

## 🔐 Understanding Google OAuth (In Simple Terms)

Before we connect Gmail, let's understand how Google keeps your account secure.

### What is OAuth?

OAuth is Google's secure way of letting TenderFlow AI access your Gmail without ever knowing your password. Think of it like a hotel key card:

**Old way (Passwords):**
- Give TenderFlow your Gmail password
- TenderFlow could do anything with your account
- If TenderFlow gets hacked, your password is stolen
- You have to change passwords everywhere

**New way (OAuth):**
- Google gives TenderFlow a special "key card"
- The key card only opens specific "doors" (permissions you choose)
- TenderFlow never sees your password
- You can cancel the key card anytime without changing your password

### How the Connection Process Works

Here's what happens step-by-step when you click "Connect with Google":

**Step 1: TenderFlow asks Google to start the secure process**
- You click "Connect with Google" in TenderFlow
- TenderFlow sends you to Google's secure website (not ours - this is safer)
- You see "accounts.google.com" in your browser address bar

**Step 2: You sign in to Google (not TenderFlow)**
- Enter your Gmail email and password on Google's website
- Google checks you're really you (might ask for 2-factor code)
- TenderFlow never sees your password at any point

**Step 3: Google shows you what permissions TenderFlow is requesting**
- Google shows a screen listing what TenderFlow wants to access
- You can see exactly what we're asking for (read emails, see your email address)
- You can say "Allow" or "No thanks"

**Step 4: Google creates a secure key card**
- If you click "Allow", Google creates two special codes:
  - **Access Token**: Works for 1 hour, lets TenderFlow read emails
  - **Refresh Token**: Never expires, lets TenderFlow get new access tokens
- Google sends these codes to TenderFlow (not your password!)

**Step 5: TenderFlow saves the codes securely**
- TenderFlow encrypts the codes (scrambles them so hackers can't read them)
- Stores them in our secure database
- Uses them to check Gmail every 2 hours

**Important**: At no point does TenderFlow AI ever know or store your Gmail password. That stays with Google forever.

### What Permissions You're Granting

When you connect Gmail, Google asks you to grant these specific permissions:

**1. Read your emails**
- **What it means**: TenderFlow can see emails in your inbox
- **Why we need it**: To find tender alerts and extract details
- **What we DON'T do**: We can't send, delete, or modify emails
- **When we use it**: Every 2 hours (or when you click "Sync Now")

**2. See your email address**
- **What it means**: TenderFlow can see your Gmail address (e.g., alerts@company.com)
- **Why we need it**: To show which Gmail account is connected in TenderFlow
- **What we DON'T do**: We don't share your email with anyone
- **When we use it**: Once, during setup

**That's it - just two permissions**. We deliberately keep this minimal. We can't:
- ❌ Send emails from your account
- ❌ Delete your emails
- ❌ Modify or mark emails as read
- ❌ Access your Google Drive, Calendar, or Contacts
- ❌ See your password
- ❌ Make any changes to your Gmail settings

### Can I Trust This?

Yes, for these reasons:

**Google Verified**: Google has reviewed TenderFlow AI and approved our access. You'll see "Verified by Google" on the permissions screen.

**Industry Standard**: Millions of apps use OAuth (Slack, Trello, Zoom, etc.). It's the secure way to connect services.

**You're in Control**: You can disconnect TenderFlow from your Gmail anytime:
- Through TenderFlow (Integrations → Delete connection)
- Through Google (myaccount.google.com → Security → Third-party apps → Remove TenderFlow)

**No Password Risk**: Because we never see your password, even if TenderFlow AI was hacked (which it won't be!), your Gmail stays secure.

**Audit Trail**: Google logs every time TenderFlow accesses your Gmail. You can review this anytime at myaccount.google.com → Security → Recent activity.

---

## 📋 Step-by-Step Setup Guide

Follow these steps carefully to connect your Gmail account to TenderFlow AI:

### Step 1: Navigate to Integrations Page

**What to do:**
1. Log into TenderFlow AI (tenderflow.ai)
2. Look at the sidebar on the left
3. Click on **"Integrations"** (it has a plug icon 🔌)
4. Wait for the page to load

**What you should see:**
- A page titled "Portal Connections"
- Several cards showing different connection types
- A blue **"Add Connection"** button in the top right

**If you don't see this:**
- Check you're logged in to TenderFlow (not just viewing the website)
- Check you have Admin access (ask your account owner if unsure)
- Try refreshing the page (press F5)

---

### Step 2: Start Gmail Connection

**What to do:**
1. Click the blue **"Add Connection"** button
2. A dialog box will appear
3. Look for the **EMAIL** option (it has a 📧 icon)
4. Click on the EMAIL card

**What you should see:**
- A form titled "Connect Email Account"
- A big blue button saying **"Connect with Google"**
- Some text explaining what will happen

**Don't fill in the form fields yet** - we'll do that after connecting to Google.

---

### Step 3: Start Google OAuth Process

**What to do:**
1. Click the big blue **"Connect with Google"** button
2. Your browser will redirect to a Google page
3. Check the address bar shows **"accounts.google.com"** (this means you're on Google's secure website, not ours)

**What you should see:**
- Google's logo at the top
- A sign-in screen (if you're not already signed in to Google)
- Or, a list of your Google accounts to choose from

**Important**: If the address bar doesn't show "accounts.google.com", STOP and contact support. Don't enter your password on any other website.

---

### Step 4: Sign In to Your Gmail Account

**What to do:**
1. **If you see a list of accounts**: Click on the Gmail account you use for tender alerts
2. **If you see a sign-in screen**: 
   - Enter your Gmail email address (e.g., alerts@yourcompany.com)
   - Click **"Next"**
   - Enter your Gmail password
   - Click **"Next"**
3. **If Google asks for 2-factor authentication** (a code from your phone):
   - Enter the code from your authenticator app or text message
   - Click **"Next"**

**What you should see:**
- After signing in, a screen titled "TenderFlow AI wants to access your Google Account"
- A list of permissions (see next step)

**Troubleshooting:**
- **Wrong account signed in?** Click "Use another account" at the bottom
- **Forgot password?** Click "Forgot password?" - but you'll need to reset it with Google first
- **Account locked?** Contact your IT team - they may need to unlock it

---

### Step 5: Review and Grant Permissions

**What to do:**
1. Read the permissions screen carefully
2. You should see these two permissions:
   - **Read your emails**: So TenderFlow can find tender alerts
   - **See your email address**: So TenderFlow knows which account is connected
3. **Important**: Check you're granting access to the RIGHT Gmail account (check the email shown at the top)
4. Click the blue **"Allow"** button

**What you should see after clicking Allow:**
- Your browser redirects back to TenderFlow AI
- The address bar now shows "app.tenderflow.ai" (you're back on our website)
- A success message saying "Gmail connected successfully"

**Troubleshooting:**
- **Different permissions shown?** Contact support - something is wrong
- **More than 2 permissions?** Contact support - we only need these two
- **Error after clicking Allow?** See "Common Errors" section below

---

### Step 6: Configure Your Gmail Connection

Now that Google has connected your account, let's configure how TenderFlow uses it.

**What to do:**
1. You should see a form with these fields:
   - **Connection Name**: Give it a descriptive name
   - **Sync Frequency**: How often to check Gmail
   - (Other fields are filled automatically from Google)

2. **Fill in Connection Name**:
   - Use a name that identifies this Gmail account
   - Good examples: "Main Tender Alerts", "Birmingham Emails", "Yorkshire Council Alerts"
   - Bad examples: "Gmail", "Email", "Connection 1"
   - Why this matters: If you connect multiple Gmail accounts later, you need to tell them apart

3. **Choose Sync Frequency**:
   - **Every 1 hour**: Choose this if you get lots of urgent tenders
   - **Every 2 hours** (recommended): Good balance for most care providers
   - **Every 6 hours**: Choose this if you get few tender emails
   - Why this matters: More frequent syncing catches urgent tenders faster, but uses more system resources

4. Click the green **"Save Connection"** button

**What you should see:**
- A new connection card appears on the Integrations page
- Status shows "Connected" with a green tick ✓
- Last sync shows "Never" (we haven't synced yet)
- Your connection name is displayed

**Example Configuration:**
```
Connection Name: Main Tender Alerts Gmail
Sync Frequency: Every 2 hours
Email: alerts@yorkshirecare.com
Status: Connected ✓
```

---

### Step 7: Test the Connection

Let's make sure everything is working before we finish.

**What to do:**
1. Find your new Gmail connection card on the Integrations page
2. Click the **"Sync Now"** button (it has a refresh icon 🔄)
3. Wait while TenderFlow checks your Gmail
4. Watch the status change to "Syncing..." with a blue spinning icon

**What happens during sync:**
1. TenderFlow connects to Gmail using the OAuth codes
2. Fetches your recent emails (up to 50 from the last 7 days)
3. AI analyses each email to find tender-related content
4. Extracts tender details (title, deadline, authority, etc.)
5. Creates items in your TenderFlow Inbox
6. Updates the connection status

**This process takes about 10-30 seconds** depending on how many emails you have.

**What you should see after sync completes:**
- Status changes to "Connected" (green tick ✓)
- "Last sync" shows "Just now"
- If it found tender emails, you'll see a count: "3 items created"

**Now check your TenderFlow Inbox:**
1. Click **"Inbox"** in the sidebar
2. Look for new items with "Gmail" badges
3. These are your tender alert emails, automatically processed!

**What if nothing appears in your Inbox?**
This is normal if:
- You have no tender-related emails in the last 7 days
- All your tender emails are older than 7 days
- Your tender emails don't look like typical alerts (AI couldn't identify them)

Don't worry - as new tender emails arrive in Gmail, they'll be processed automatically.

---

### Step 8: Set Up Email Forwarding (Optional But Recommended)

To ensure TenderFlow never misses a tender alert, set up automatic forwarding in Gmail.

**Why do this?**
- Some procurement portals send emails from no-reply addresses that might be filtered
- Gmail might move some emails to Spam or Promotions folders
- Forwarding ensures TenderFlow sees everything, regardless of folder

**What to do:**

1. **Open Gmail** (mail.google.com) and sign in
2. **Click the Settings gear icon** (top right) → "See all settings"
3. **Go to "Filters and Blocked Addresses" tab**
4. **Click "Create a new filter"**
5. **In the "From" field**, type: `*@*.gov.uk OR *@proactiscloud.com OR *@bipsolutions.com`
   - This catches emails from UK government sites and common procurement portals
   - You can add more later as you discover other portals
6. **Click "Create filter"**
7. **Tick the box**: "Forward it to"
8. **Choose**: The same Gmail address (or add a new forwarding address)
9. **Click "Create filter"**

**Alternative (Simpler) Method:**
If you receive tender alerts in a specific Gmail label/folder:

1. Create a filter for emails with that label
2. Forward all those emails to your tender alerts inbox
3. This catches everything automatically

**Important**: Make sure forwarding goes to the SAME Gmail account you connected to TenderFlow, or TenderFlow won't see the forwarded emails.

---

## 🔍 How Gmail Labels/Folders Work with TenderFlow

TenderFlow AI can read emails from any folder in your Gmail account, not just your inbox.

### Understanding Gmail Labels

Gmail uses "labels" instead of folders. Think of labels like sticky notes:
- An email can have multiple labels (unlike folders, where an email is in ONE place)
- Common labels: Inbox, Sent, Spam, Promotions, Social, etc.
- You can create custom labels like "Tenders", "Urgent Bids", "Kent Councils"

### How TenderFlow Handles Labels

**Current behaviour**: TenderFlow reads ALL emails in your account from the last 7 days, regardless of label.

**This means:**
- ✅ Emails in your Inbox → Read and processed
- ✅ Emails in a custom label → Read and processed
- ✅ Emails in Promotions or Social tabs → Read and processed
- ⚠️ Emails in Spam → Read and processed (but might not be real tenders)
- ❌ Emails in Bin/Trash → NOT read
- ❌ Emails older than 7 days → NOT read on first sync (but will be in future if still in last 7 days window)

### Best Practice for Organising Tender Emails

**We recommend this Gmail setup:**

**Option 1: Dedicated Tender Alerts Gmail Account (Best)**
- Create a separate Gmail just for tender alerts: tenderalerts@yourcompany.com
- Set up all procurement portals to send alerts to this email
- Connect this account to TenderFlow
- Benefit: No risk of TenderFlow processing personal emails, newsletters, etc.

**Option 2: Use Gmail Filters and Labels (Good)**
- Create a Gmail label called "Tenders"
- Set up filters to auto-label tender emails:
  - Emails from *@*.gov.uk → Label "Tenders"
  - Emails with subject containing "tender" OR "ITT" OR "RFP" → Label "Tenders"
- TenderFlow will still process all emails, but you can manually review the "Tenders" label
- Benefit: Easy to see what TenderFlow should be finding

**Option 3: Connect Your Main Email (OK)**
- Connect your main work Gmail
- TenderFlow's AI will filter out non-tender emails
- Benefit: Simple setup, no new email account needed
- Drawback: TenderFlow processes more emails (slower sync, possible false positives)

**What we DON'T recommend:**
- ❌ Connecting a shared Gmail account (hard to manage permissions)
- ❌ Connecting a personal Gmail with work emails mixed in (privacy concern)
- ❌ Using a Gmail that receives hundreds of emails per day (slow syncing)

---

## 🤖 How Tender Alerts Are Parsed and Classified

Let's understand what happens to your emails after TenderFlow reads them.

### The AI Email Analysis Process

When TenderFlow syncs your Gmail, here's what happens to each email:

**Step 1: Fetch Recent Emails**
- TenderFlow asks Gmail: "Show me the 50 most recent emails from the last 7 days"
- Gmail sends back a list of email IDs
- TenderFlow fetches the full content of each email

**Step 2: Initial Filtering**
TenderFlow's AI quickly scans each email to determine: "Is this tender-related?"

**Tender-related emails** typically contain words like:
- Tender, ITT, RFP, RFQ, Contract Notice, Opportunity
- Expressions of Interest, Pre-Qualification Questionnaire, PQQ
- Deadline, submission date, closing date
- Council names, procurement portal names
- Service types (domiciliary care, residential care, supported living, etc.)

**Non-tender emails** like:
- Personal emails
- Marketing newsletters
- System notifications
- Social media alerts
- Automated receipts

**Result**: Only tender-related emails continue to the next steps. Everything else is ignored (never stored or processed further).

---

### Step 3: Deep AI Analysis

For emails identified as tender-related, our AI (powered by OpenAI GPT-4o-mini) performs a detailed analysis:

**Information Extracted:**

**1. Tender Title**
- What: The name of the tender opportunity
- Example: "Provision of Domiciliary Care Services for Elderly Residents in Manchester"
- How AI finds it: Looks for prominent text in subject line or email body, often near "tender for" or "opportunity for"

**2. Authority Name**
- What: The organisation issuing the tender (council, NHS trust, etc.)
- Example: "Manchester City Council", "Kent County Council", "NHS Lancashire and South Cumbria"
- How AI finds it: Looks for organisation names, especially near "on behalf of" or in email signatures

**3. Tender Link (URL)**
- What: Web link to the full tender documents
- Example: "https://www.find-tender.service.gov.uk/Notice/123456"
- How AI finds it: Extracts clickable links from the email, prioritising portal domains

**4. Deadline**
- What: When the bid must be submitted by
- Example: "2026-05-15" (15th May 2026)
- How AI finds it: Looks for dates near words like "deadline", "closing date", "submit by", "due date"
- Format: Always converts to YYYY-MM-DD format for consistency

**5. Estimated Value**
- What: How much the contract is worth
- Example: £500,000 per year
- How AI finds it: Finds currency amounts (£, GBP) near words like "value", "worth", "budget"
- Note: Often missing from initial tender alerts (added later by user or from portal)

**6. Summary**
- What: A 2-3 sentence overview of what the tender is about
- Example: "Manchester City Council is seeking providers for domiciliary care services for elderly residents in the Manchester area. Services include personal care, medication support, and companionship. Contract runs for 3 years with possible 1-year extension."
- How AI creates it: Reads the full email body, identifies key information, summarises in plain English

**7. Email Type Classification**
TenderFlow AI categorises the email into one of these types:

**Type: New Tender**
- What it means: A completely new tender opportunity
- Indicators: Email says "new opportunity", "published today", "invitation to tender"
- What TenderFlow does: Creates a new tender record in your system
- Action suggested: "Review tender eligibility and AI score"

**Type: Clarification**
- What it means: An answer to a question about an existing tender
- Indicators: Email says "clarification", "question and answer", "response to query", reference number matches existing tender
- What TenderFlow does: Links to existing tender, creates Inbox item
- Action suggested: "Review clarification and update bid document"

**Type: Amendment**
- What it means: Changes to the tender requirements or documents
- Indicators: Email says "amendment", "revised specification", "updated documents"
- What TenderFlow does: Links to existing tender, flags as high priority
- Action suggested: "Review changes and assess impact on your bid"

**Type: Deadline Change**
- What it means: The submission deadline has been extended or brought forward
- Indicators: Email says "deadline extended", "new closing date", "revised submission date"
- What TenderFlow does: Links to existing tender, updates deadline in system
- Action suggested: "Note new deadline in calendar"

**Type: Update**
- What it means: General information about an existing tender
- Indicators: Email says "update", "notification", "reminder", reference number matches existing tender
- What TenderFlow does: Links to existing tender, creates Inbox item
- Action suggested: "Review update for important information"

**Type: Award Notification**
- What it means: Decision has been made on who won the tender
- Indicators: Email says "contract awarded", "successful bidder", "notification of award", "unsuccessful"
- What TenderFlow does: Links to existing tender if found, updates status
- Action suggested: "Review outcome and provide feedback to team"

---

### Step 4: Action Identification

For each email, AI determines:

**Is Action Required?**
- **Yes** if: Email contains a question, deadline, required response, or document to download
- **No** if: Email is purely informational (e.g., "We received your bid, thank you")

**What Action is Needed?**
AI suggests specific next steps:
- "Download tender documents and review requirements"
- "Respond to clarification question by [date]"
- "Review amended specification section 3.2"
- "Update your bid with new deadline"
- "Provide additional evidence requested"

**When is Action Due?**
AI extracts or suggests a deadline:
- If email mentions a date → Use that date
- If it's a clarification → Usually 2-3 days to respond
- If it's an amendment → Usually before original tender deadline
- If no date mentioned → AI suggests a reasonable timeframe

---

### Step 5: Priority Assignment

AI assigns a priority level to each email:

**Urgent (Red)**
- Deadline within 48 hours
- Clarification with short response time
- Amendment to active bid
- Contract award decision

**High (Orange)**
- New tender with good fit score
- Deadline within 1 week
- Important update to active bid

**Medium (Yellow)**
- New tender opportunity
- General updates
- Clarifications with time to respond

**Low (Grey)**
- Informational emails
- Thank you confirmations
- Award notifications for tenders you didn't bid on

---

### Step 6: Tender Matching

TenderFlow AI tries to match the email to an existing tender in your system:

**Matching Logic:**

**Method 1: Link Matching (Most Reliable)**
- Compares the tender link in the email to existing tenders
- If exact match found → Links to that tender
- Example: Email link "find-tender.service.gov.uk/123456" matches existing tender with same link

**Method 2: Title + Authority Matching**
- Compares tender title and authority name
- Uses "fuzzy matching" (allows small differences in spelling)
- If strong match found → Links to that tender
- Example: Email says "Manchester domiciliary care" matches existing "Domiciliary Care - Manchester City Council"

**Method 3: Reference Number Matching**
- Looks for reference numbers like "MC/2026/001" in email
- Compares to reference numbers in existing tenders
- If match found → Links to that tender

**If No Match Found:**
- TenderFlow creates a NEW tender record
- Marks it as requiring review
- Adds to your Inbox as "New tender candidate"
- You can review and decide whether to pursue it

**If Match Found:**
- Email is linked to the existing tender
- Appears in that tender's activity timeline
- Creates an Inbox item for the update
- You see the email when viewing the tender

---

### Step 7: Creating Inbox Items

Finally, TenderFlow creates an Inbox item for each tender-related email:

**What's in an Inbox Item:**

```
┌──────────────────────────────────────────────┐
│ 📧 Gmail  🔴 High  📅 15 May 2026           │
│                                              │
│ New Tender: Domiciliary Care - Manchester   │
│ Manchester City Council                      │
│                                              │
│ Manchester City Council is seeking providers │
│ for domiciliary care services for elderly    │
│ residents. Contract value: £500K. Deadline:  │
│ 15th May 2026.                               │
│                                              │
│ ⚡ Action Required                           │
│ Download tender documents and review         │
│ requirements                                 │
│ Due: 20 Mar 2026                             │
│                                              │
│ [View Tender] [Mark as Read] [Archive]      │
└──────────────────────────────────────────────┘
```

**Fields:**
- **Source**: Gmail (badge shows which connection)
- **Priority**: Colour-coded (Red/Orange/Yellow/Grey)
- **Deadline**: If applicable
- **Title**: AI-generated summary title
- **Authority**: Organisation name
- **Summary**: 2-3 sentence overview
- **Action Required**: Yes/No
- **Action Text**: What you need to do
- **Action Due Date**: When to do it by
- **Linked Tender**: If matched to existing tender

---

## 📬 How Clarifications and Updates Become Actions

Let's look at specific examples of how different email types are handled:

### Example 1: Clarification Question Posted

**Email Received:**
```
From: procurement@manchester.gov.uk
Subject: Clarification Q&A - Domiciliary Care Tender (Ref: MC/2026/001)

Dear Bidder,

A clarification question has been posted on the tender portal:

Question: "What are the minimum CQC rating requirements for this contract?"

Answer: "Providers must hold a CQC rating of 'Good' or 'Outstanding'. 
'Requires Improvement' providers may apply but will need to demonstrate 
an improvement plan."

Please review this information when preparing your bid.

Deadline for submission: 15th May 2026

Best regards,
Manchester City Council Procurement Team
```

**How TenderFlow AI Processes This:**

1. **Classification**: Identifies as "Clarification" type
2. **Matching**: Finds existing tender with reference "MC/2026/001"
3. **Extraction**:
   - Question: CQC rating requirements
   - Answer: Good or Outstanding, or Requires Improvement with plan
   - Deadline: 15 May 2026
4. **Action Identified**: "Review clarification and update Section 2 (Quality Standards) of your bid"
5. **Priority**: High (affects bid content)
6. **Due Date**: 48 hours before deadline (13 May 2026)

**Inbox Item Created:**
```
📧 Gmail  🟠 High  📅 13 May 2026

Clarification: CQC Rating Requirements
Manchester City Council

New clarification posted: Minimum CQC rating is Good or 
Outstanding. Requires Improvement providers must include 
improvement plan.

⚡ Action Required
Review clarification and update Section 2 (Quality Standards) 
of your bid document
Due: 13 May 2026
```

**What Happens Next:**
- Item appears in your Inbox (Clarification filter)
- Notification sent if you're assigned to this tender
- Task created: "Update bid with CQC clarification"
- When you click "View Tender", clarification appears in timeline
- You can comment, assign to team member, or mark as complete

---

### Example 2: Tender Amendment

**Email Received:**
```
From: noreply@bipsolutions.com
Subject: URGENT: Amendment to Tender Documents - Kent Supported Living

Important Notice - Tender Reference: KCC-SL-2026-04

An amendment has been issued to the tender documents:

CHANGE: Section 4.3 (Staffing Ratios) has been revised.

Previous requirement: 1:3 staff to resident ratio
NEW requirement: 1:2 staff to resident ratio during waking hours

Updated specification document available on portal:
https://bipsolutions.com/tender/KCC-SL-2026-04

This change may affect your pricing. Please review and update 
your bid accordingly.

Original deadline remains: 1st June 2026
```

**How TenderFlow AI Processes This:**

1. **Classification**: Identifies as "Amendment" type
2. **Matching**: Matches to existing tender "Kent Supported Living"
3. **Extraction**:
   - Section Changed: 4.3 (Staffing Ratios)
   - Previous: 1:3 ratio
   - New: 1:2 ratio
   - Impact: Affects pricing
   - Document Link: https://bipsolutions.com/tender/KCC-SL-2026-04
4. **Action Identified**: "Download amended specification, recalculate staffing costs, update pricing schedule"
5. **Priority**: Urgent (major change to costs)
6. **Due Date**: ASAP (allows time to revise bid before deadline)

**Inbox Item Created:**
```
📧 Gmail  🔴 Urgent  📅 1 Jun 2026

Amendment: Staffing Ratios Changed
Kent County Council

URGENT: Staffing ratio requirement increased from 1:3 to 1:2. 
This will significantly impact your pricing. Updated specification 
available on portal.

⚡ Action Required
Download amended specification (Section 4.3), recalculate 
staffing costs, and update your pricing schedule
Due: ASAP
```

**What Happens Next:**
- Item appears in Inbox marked URGENT
- Email/SMS notification sent to all team members on this bid
- Automatic task created: "Revise pricing for new staffing ratio"
- Task assigned to Finance team member
- Deadline flagged in calendar
- When you click "View Tender", amendment appears prominently in timeline

---

### Example 3: Deadline Extension

**Email Received:**
```
From: notifications@proactis.com
Subject: Deadline Extended - Yorkshire Adult Day Services

Tender Notice - Reference: YHCS-2026-012

The submission deadline for this tender has been EXTENDED:

Original deadline: 20th March 2026, 12:00 noon
NEW deadline: 27th March 2026, 12:00 noon

Reason: To allow bidders more time to prepare quality responses.

All other tender requirements remain unchanged.

Portal link: https://proactis.com/tender/YHCS-2026-012
```

**How TenderFlow AI Processes This:**

1. **Classification**: Identifies as "Deadline Change" type
2. **Matching**: Matches to existing tender "Yorkshire Adult Day Services"
3. **Extraction**:
   - Original Deadline: 20 March 2026, 12:00
   - New Deadline: 27 March 2026, 12:00
   - Extension: 7 days
   - Reason: More time for quality responses
4. **Action Identified**: "Update calendar with new deadline, inform team of extra week available"
5. **Priority**: Medium (positive news, not urgent)
6. **System Action**: Automatically updates tender deadline in database

**Inbox Item Created:**
```
📧 Gmail  🟡 Medium  📅 27 Mar 2026

Deadline Extended by 7 Days
Yorkshire Care Services

Good news: Submission deadline extended from 20th March to 
27th March 2026. You have an extra week to polish your bid.

ℹ️ Action Suggested
Update team calendar with new deadline and use extra time to 
improve bid quality
Due: No rush - informational
```

**What Happens Next:**
- Tender deadline updated automatically in TenderFlow
- All tasks with deadline 20 March moved to 27 March
- Team calendar updated
- Item appears in Inbox (Updates filter)
- Notification sent to bid team: "Great news - you have an extra week!"

---

### Example 4: Portal Update (Informational)

**Email Received:**
```
From: tenders@bristol.gov.uk
Subject: Reminder - Tender Submission via Portal Only

Dear Bidder,

This is a reminder for tender reference BCC-HC-2026-08:

IMPORTANT: All submissions must be made via the online portal. 
Email or postal submissions will NOT be accepted.

Portal access: https://bristoltenders.gov.uk
Your login credentials were sent on 1st March 2026.

If you've forgotten your password, use the "Reset Password" 
link on the portal.

Deadline: 10th April 2026, 16:00

Good luck with your bid.
```

**How TenderFlow AI Processes This:**

1. **Classification**: Identifies as "Update" type
2. **Matching**: Matches to existing tender "Bristol Home Care"
3. **Extraction**:
   - Key Info: Portal submission only, no email/post
   - Portal Link: https://bristoltenders.gov.uk
   - Deadline Reminder: 10 April 2026, 16:00
4. **Action Identified**: "No action required - informational reminder"
5. **Priority**: Low (just a helpful reminder)

**Inbox Item Created:**
```
📧 Gmail  ⚪ Low  📅 10 Apr 2026

Reminder: Portal Submission Only
Bristol City Council

Reminder: Submit bid via online portal only. Email or postal 
submissions not accepted. Deadline: 10th April, 16:00.

ℹ️ No Action Required
This is an informational reminder. Ensure you submit via portal 
before deadline.
```

**What Happens Next:**
- Item appears in Inbox (All filter)
- No notification sent (low priority)
- No task created (informational only)
- When you view the tender, this reminder appears in timeline
- You can mark as read and move on

---

## 🔄 How to Disconnect or Reconnect Gmail

### Disconnecting Your Gmail Account

You might want to disconnect Gmail if:
- You're changing to a different Gmail account
- You're testing the connection
- You're leaving the organisation
- You're troubleshooting connection issues

**How to Disconnect (via TenderFlow):**

1. Go to **Integrations** page in TenderFlow
2. Find your Gmail connection card
3. Click the **"Delete"** button (🗑️ trash icon)
4. Confirm by clicking **"Yes, delete connection"**
5. Connection is removed immediately

**What happens when you disconnect:**
- ✅ TenderFlow stops checking your Gmail
- ✅ OAuth access tokens are deleted from our database
- ✅ Existing Inbox items remain (historical record)
- ✅ Existing tenders remain (your data is safe)
- ❌ No new emails will be processed
- ❌ You won't get Gmail alerts in TenderFlow anymore

**Important**: Disconnecting in TenderFlow does NOT revoke access in Google. To fully disconnect:

**How to Revoke Access (via Google):**

1. Go to **myaccount.google.com**
2. Click **"Security"** in left sidebar
3. Scroll to **"Third-party apps with account access"**
4. Find **"TenderFlow AI"** in the list
5. Click **"Remove Access"**
6. Confirm by clicking **"OK"**

**This ensures:**
- TenderFlow can no longer access your Gmail at all
- Even if we tried, Google would reject the request
- Complete disconnect from Google's side

**We recommend doing both** (disconnect in TenderFlow AND revoke in Google) for complete security.

---

### Reconnecting Your Gmail Account

**If you disconnected accidentally:**
Just follow the setup steps again from Step 1. It takes 2 minutes to reconnect.

**If you want to connect a different Gmail account:**
1. Disconnect the old account first (see above)
2. Follow the setup steps again
3. When Google asks you to sign in, choose the new account
4. Grant permissions
5. Configure and save

**If your connection status shows "Error":**
Sometimes the connection breaks (Google revoked access, password changed, etc.). To fix:

1. Go to **Integrations** page
2. Find the Gmail connection card showing "Error"
3. Click **"Reconnect"** button
4. Follow the OAuth process again
5. Grant permissions
6. Connection restored

**You don't need to delete and recreate the connection** - reconnecting preserves your settings and history.

---

## 🔧 Common Errors and How to Fix Them

### Error 1: "OAuth Error - Invalid Client"

**What you see:**
After clicking "Connect with Google", you see an error page saying:
```
Error 400: invalid_client
The OAuth client was not found.
```

**What this means:**
TenderFlow's Google OAuth credentials are not configured correctly. This is a setup issue on our end, not yours.

**How to fix:**
1. Don't try to reconnect - this won't help
2. Contact TenderFlow support immediately: support@tenderflow.ai
3. Include a screenshot of the error
4. We'll fix our OAuth configuration and let you know when to try again
5. Usual fix time: Within 2 hours during business hours

**This is extremely rare** - it only happens if our developer accidentally broke the OAuth setup.

---

### Error 2: "Access Denied - Insufficient Permissions"

**What you see:**
After clicking "Allow" on Google's permissions screen, you're redirected to an error page:
```
Access denied
TenderFlow AI was not granted the required permissions
```

**What this means:**
You clicked "Deny" or cancelled the permissions screen, so Google didn't give TenderFlow access to your Gmail.

**How to fix:**
1. Go back to TenderFlow Integrations page
2. Try connecting Gmail again
3. When Google shows the permissions screen, **read it carefully**
4. Make sure you click **"Allow"** (not "Cancel" or "Deny")
5. If you're uncomfortable granting permissions, check with your manager first

**If you deliberately denied permissions:**
That's fine - TenderFlow won't work without them, but you've made an informed choice. Consider whether the benefits outweigh your privacy concerns.

---

### Error 3: "No Emails Syncing"

**What you see:**
Connection status shows "Connected ✓", but after clicking "Sync Now" and checking your Inbox:
- No new items appear
- Sync history shows "0 items fetched"
- But you KNOW you have tender emails in Gmail

**Possible causes and fixes:**

**Cause 1: No tender-related emails in the last 7 days**
- **Check**: Open Gmail and search for emails with "tender" in the last week
- **If none found**: This is normal - TenderFlow only fetches emails from the last 7 days on first sync
- **Fix**: Wait for new tender emails to arrive, they'll be processed automatically

**Cause 2: Tender emails don't look like typical alerts**
- **Check**: Open a tender email in Gmail - does it clearly mention tenders, deadlines, councils?
- **If it's very generic**: AI might not recognise it as tender-related
- **Fix**: Forward the email to support@tenderflow.ai with "Please add to tender detection" and we'll improve our AI

**Cause 3: All tender emails are in Spam or Bin**
- **Check**: Open Gmail Spam folder
- **If tender emails are there**: Gmail is filtering them incorrectly
- **Fix**: 
  1. Mark tender emails as "Not Spam" in Gmail
  2. Create a Gmail filter to never send these to Spam:
     - Settings → Filters → Create filter
     - From: *@*.gov.uk
     - Check "Never send to Spam"
  3. TenderFlow will process them on next sync

**Cause 4: Connected wrong Gmail account**
- **Check**: Look at the Gmail connection card - is the email address correct?
- **If wrong account**: You connected a different Gmail than you intended
- **Fix**: 
  1. Delete the connection
  2. Connect again
  3. When Google asks, choose the CORRECT Gmail account

**Cause 5: Sync is actually working, but slowly**
- **Check**: Click "Sync Now" and wait a full 60 seconds
- **If items appear after waiting**: Sync is working, just slower than expected (lots of emails to process)
- **Fix**: Be patient - first sync can take up to 2 minutes if you have 50+ emails

---

### Error 4: "Token Expired" or "Unauthorised"

**What you see:**
Connection status shows "Error ❌" with message:
```
Token expired - please reconnect
```
or
```
Unauthorised - access revoked
```

**What this means:**
The OAuth tokens TenderFlow uses to access your Gmail have expired or been revoked.

**Common reasons:**
- You changed your Gmail password → Google revoked all app access for security
- You revoked TenderFlow's access in Google settings
- You enabled 2-factor authentication on Gmail → Google requires re-authorisation
- Google detected suspicious activity → Revoked access as precaution
- OAuth token expired (rare - they auto-refresh normally)

**How to fix:**
1. On the Integrations page, click **"Reconnect"** button on the Gmail connection card
2. Follow the OAuth process again (same as initial setup)
3. Sign in to Google if prompted
4. Grant permissions again
5. Connection should now show "Connected ✓"

**If reconnecting doesn't work:**
1. Delete the connection completely
2. Set up Gmail connection again from scratch
3. This creates fresh OAuth tokens

**To prevent this happening:**
- Don't revoke TenderFlow access in Google unless you want to disconnect
- If you change your Gmail password, reconnect TenderFlow immediately after
- If you enable 2FA on Gmail, reconnect TenderFlow that same day

---

### Error 5: "Rate Limit Exceeded"

**What you see:**
After clicking "Sync Now" multiple times quickly, you see:
```
Sync failed - Rate limit exceeded
Please wait before trying again
```

**What this means:**
You've clicked "Sync Now" too many times in a short period. Google limits how often apps can access Gmail to prevent abuse.

**How to fix:**
1. **Wait 5 minutes** before trying again
2. Don't click "Sync Now" more than once per minute
3. Remember: TenderFlow syncs automatically every 2 hours - you rarely need to manually sync

**Why this limit exists:**
- Prevents apps from hammering Google's servers
- Protects against bugs or attacks that might spam Gmail API
- Standard across all apps that connect to Gmail

**Our recommendation:**
Only use "Sync Now" when:
- You just connected Gmail and want to test it
- You received an urgent tender email and need it processed immediately
- It's been several hours since last sync and you're checking for updates

For day-to-day use, let automatic syncing handle everything.

---

### Error 6: "Sync Partially Failed"

**What you see:**
Sync history shows:
```
⚠️ Partial Success
Fetched: 20 emails
Created: 15 items
Failed: 5 items
```

**What this means:**
TenderFlow successfully processed most emails, but some failed (usually due to malformed content or parsing errors).

**How to fix:**
1. Click **"View Sync History"** on the Gmail connection card
2. Look at the failed sync entry
3. Check if error message provides details
4. Common issues:
   - **"Could not extract date"**: Email doesn't have a clear deadline → Not critical, you can add manually
   - **"Malformed HTML"**: Email has broken formatting → TenderFlow did its best, check the Inbox item to see what was captured
   - **"Could not classify"**: Email is ambiguous (could be tender or not) → Review manually in Inbox

5. If same emails fail repeatedly:
   - Forward one failing email to support@tenderflow.ai
   - We'll investigate and improve our parsing

**This is normal and not critical** - 5 failed out of 20 means 75% success rate, which is acceptable for automated processing. The failed emails are usually:
- Marketing emails that slipped through AI filter
- Emails with no useful content
- Duplicate notifications

---

### Error 7: "Connection Timeout"

**What you see:**
After clicking "Sync Now", it spins for a long time (30+ seconds) then shows:
```
Sync failed - Connection timeout
Could not connect to Gmail
```

**What this means:**
TenderFlow couldn't reach Google's servers within the timeout period (30 seconds).

**Possible causes:**

**Cause 1: Internet connectivity issue**
- **Check**: Can you open mail.google.com in a browser?
- **If no**: Your internet is down or Google is blocked
- **Fix**: Check your internet connection, try again when online

**Cause 2: Firewall blocking TenderFlow**
- **Check**: Ask your IT team: "Is our firewall blocking api connections to gmail.googleapis.com?"
- **If yes**: IT team needs to whitelist Google Gmail API
- **Fix**: Contact your IT team with this request:
  ```
  Please whitelist these domains in our firewall:
  - gmail.googleapis.com
  - oauth2.googleapis.com
  - accounts.google.com
  
  These are required for TenderFlow AI's Gmail integration.
  ```

**Cause 3: Google's servers are temporarily down**
- **Check**: Visit downdetector.com/status/gmail - is Gmail having issues?
- **If yes**: Google's problem, not ours
- **Fix**: Wait 30 minutes and try again

**Cause 4: OAuth tokens corrupted**
- **Check**: Has this connection worked before, but stopped?
- **If yes**: Tokens might be corrupted
- **Fix**: Reconnect Gmail (see "Token Expired" error above)

---

### Error 8: "Too Many Connected Accounts"

**What you see:**
When trying to add a new Gmail connection:
```
Error: Maximum Gmail connections reached
You can connect up to 3 Gmail accounts
```

**What this means:**
TenderFlow limits each organisation to 3 Gmail connections to prevent abuse and keep syncing fast.

**How to fix:**

**Option 1: Delete an unused connection**
1. Go to Integrations page
2. Review your 3 existing Gmail connections
3. Find one you no longer use
4. Delete it
5. Now you can add a new connection

**Option 2: Use one Gmail for multiple sources**
Instead of connecting 3 different Gmails, consider:
- Using Gmail filters to organise emails into labels
- Connecting one main Gmail that receives ALL tender alerts
- Using email forwarding to send all alerts to one address

**Option 3: Request limit increase**
If you genuinely need more than 3 Gmail connections (e.g., large organisation with regional teams):
1. Contact support: support@tenderflow.ai
2. Explain your use case
3. We can increase your limit to 5 or 10 Gmail connections

**Why the limit exists:**
- Each connection syncs every 2 hours = More connections = More server load
- Prevents accidental duplicate connections
- Encourages proper email organisation (better to use labels than multiple accounts)

---

## 💡 Best Practice Tips

Here are 10 tips to get the most from your Gmail connection:

### 1. Use a Dedicated Tender Alerts Gmail Account

**Why:**
- Keeps tender emails separate from personal/general work emails
- Faster syncing (fewer emails to process)
- Cleaner Inbox in TenderFlow (no false positives)
- Easier to manage if you leave the organisation (account stays active)

**How to set up:**
1. Create new Gmail: tenderalerts@yourcompany.com
2. Set up all procurement portals to send alerts to this email
3. Set up email forwarding from your main work email (if councils email you directly)
4. Connect this dedicated account to TenderFlow

**Example structure:**
```
Personal Gmail: john.smith@gmail.com (not connected)
Work Gmail: john.smith@yorkshirecare.com (not connected)
Tender Alerts Gmail: tenderalerts@yorkshirecare.com (connected to TenderFlow)
```

---

### 2. Set Up Gmail Filters for Auto-Organisation

**Why:**
- Auto-labels tender emails so you can review them in Gmail too
- Helps you verify TenderFlow is catching everything
- Useful for training new team members
- Easy to spot emails TenderFlow might have missed

**Recommended filters:**

**Filter 1: Government Tender Alerts**
```
From: *@*.gov.uk OR *@*.nhs.uk
Label: "Tenders - Government"
Never send to Spam
```

**Filter 2: Procurement Portals**
```
From: *@proactis.com OR *@bipsolutions.com OR *@mytenders.com
Label: "Tenders - Portals"
Never send to Spam
```

**Filter 3: Urgent Keywords**
```
Subject: (urgent OR immediate OR deadline extended OR clarification)
Label: "Tenders - Urgent"
Star the message
```

---

### 3. Check Sync History Weekly

**Why:**
- Spot problems early (failing syncs, errors)
- Verify emails are being processed
- Track how many tenders you're finding
- Notice patterns (e.g., certain councils always send alerts on Fridays)

**What to look for:**
- ✅ **Success rate**: Should be 90%+ of syncs successful
- ⚠️ **Failed syncs**: Investigate any failures, especially if consecutive
- 📊 **Items per sync**: Track trends - are you getting more or fewer alerts?
- ⏱️ **Sync duration**: Should be under 30 seconds; if longer, might indicate issues

**How to review:**
1. Every Friday at 4pm (or your preferred time)
2. Go to Integrations → Gmail connection → View Sync History
3. Look at the last 7 days of syncs
4. Note any anomalies
5. Contact support if you see 3+ consecutive failures

---

### 4. Train TenderFlow's AI with Feedback

**Why:**
- AI gets better at recognising YOUR specific tender alerts
- Reduces false positives (non-tender emails processed)
- Improves summary quality over time
- Ensures critical details are never missed

**How to provide feedback:**

**When TenderFlow MISSES a tender email:**
1. Forward the email to: ai-training@tenderflow.ai
2. Subject line: "Missed Tender Email"
3. We'll analyse it and improve detection

**When TenderFlow INCORRECTLY classifies an email:**
1. Find the Inbox item
2. Click "Report Issue"
3. Select "Wrong classification"
4. Tell us what it should have been

**When a summary is inaccurate:**
1. Find the Inbox item
2. Click "Edit Summary"
3. Correct it
4. Click "Save and Submit Feedback"
5. AI learns from your correction

---

### 5. Use Multiple Gmail Connections for Different Regions/Services

**Why:**
- Easier to filter Inbox by region (e.g., "Show me only Kent tenders")
- Different team members can be assigned to different connections
- Prevents one busy connection from slowing down others
- Allows different sync frequencies per connection

**Example setup for large organisation:**

**Connection 1: Northern England**
- Gmail: tenders-north@company.com
- Receives alerts from: Yorkshire, Lancashire, Cumbria councils
- Sync frequency: Every 2 hours
- Team assigned: Northern Bids Team

**Connection 2: Southern England**
- Gmail: tenders-south@company.com
- Receives alerts from: Kent, Surrey, Hampshire councils
- Sync frequency: Every 2 hours
- Team assigned: Southern Bids Team

**Connection 3: NHS Tenders**
- Gmail: tenders-nhs@company.com
- Receives alerts from: NHS trusts, ICBs
- Sync frequency: Every 1 hour (often urgent)
- Team assigned: Healthcare Specialist Team

---

### 6. Set Up Auto-Forwarding from Council Direct Emails

**Why:**
- Some councils email you directly (not through portals)
- These emails might come from personal council email addresses
- Gmail Connection catches them if they're forwarded to your tender alerts account
- Ensures nothing slips through the cracks

**How to set up:**

**In your main work Gmail:**
1. Settings → Filters → Create new filter
2. From: Contains "@council.gov.uk OR @nhs.uk"
3. Subject: Contains "tender OR ITT OR opportunity"
4. Apply filter: Forward to tenderalerts@yourcompany.com
5. Also apply: Keep in inbox (don't archive)

**Result:**
- Council emails you directly about tenders
- Email stays in your main inbox (so you see it)
- Also forwarded to TenderFlow automatically
- TenderFlow processes it and creates Inbox item
- You never miss opportunities, even from uncommon sources

---

### 7. Bookmark Your TenderFlow Inbox for Daily Checks

**Why:**
- Quick access to new tender alerts
- Habit formation (check every morning)
- Don't rely solely on email notifications
- Catch urgent items faster

**How to create an efficient morning routine:**

**Every morning (5 minutes):**
1. Open TenderFlow Inbox (bookmark: app.tenderflow.ai/inbox)
2. Filter by "Unread"
3. Scan for 🔴 Urgent or 🟠 High priority items
4. Review summaries quickly
5. Click "View Tender" for anything interesting
6. Mark others as "Read" for later review

**Every Friday afternoon (15 minutes):**
1. Open Inbox
2. Filter by "Action Required"
3. Complete or delegate all actions
4. Archive processed items
5. Go into weekend knowing nothing is missed

---

### 8. Use TenderFlow Mobile Notifications

**Why:**
- Get alerted to urgent tenders immediately
- Don't miss deadlines because you weren't at your desk
- Quick triage - decide whether to act now or wait until office
- Peace of mind during busy periods

**How to set up:**
1. TenderFlow → Settings → Notifications
2. Enable: "Push notifications for Urgent priority items"
3. Enable: "Email notifications for High priority items"
4. Disable: "Notifications for Low priority items" (reduces noise)

**Example notification you'll receive:**
```
📱 TenderFlow AI

🔴 Urgent Tender Alert

Clarification deadline: Tomorrow 12pm

Kent County Council - Supported Living

Action: Respond to clarification question about 
staffing ratios

[View in TenderFlow]
```

**You can then:**
- Tap notification → Opens TenderFlow → Review and delegate
- Or: Ignore for now, deal with it when back at desk (if not urgent)

---

### 9. Review Your Gmail Spam Folder Weekly

**Why:**
- Gmail sometimes incorrectly marks tender emails as spam
- Especially emails from new procurement portals or councils
- If TenderFlow never sees them, you miss opportunities
- Quick check prevents this

**How to do it:**

**Every Monday morning:**
1. Open Gmail
2. Click "Spam" folder
3. Search for: "tender OR ITT OR council OR procurement"
4. Look for any legitimate tender emails
5. If found:
   - Mark as "Not Spam"
   - Create Gmail filter to prevent future spam (see Tip #2)
   - Manually add tender to TenderFlow (TenderFlow won't re-process old emails)

**If you find tender emails in spam regularly:**
- This indicates Gmail's spam filter is too aggressive
- Contact your IT team: "Can we whitelist *@*.gov.uk and *@proactis.com?"
- They can adjust your organisation's spam settings

---

### 10. Document Your Connection Settings for Team Handover

**Why:**
- If you leave or go on holiday, someone needs to manage Gmail connection
- Prevents "tribal knowledge" (only you know how it works)
- Makes troubleshooting easier
- Onboarding new team members faster

**What to document:**

Create a simple document (Google Doc or Word) with:

**Gmail Connection Details:**
- Gmail account email: tenderalerts@yorkshirecare.com
- Password location: Stored in [password manager/location]
- Connected to TenderFlow on: 20 March 2026
- Sync frequency: Every 2 hours
- Responsible person: Jane Smith (Bids Manager)

**Gmail Filters Setup:**
- Filter 1: Government emails → Label "Tenders - Government"
- Filter 2: Procurement portals → Label "Tenders - Portals"
- Filter 3: Urgent keywords → Star and label "Urgent"

**Troubleshooting Quick Reference:**
- If sync fails: Click "Reconnect" button in TenderFlow
- If no emails syncing: Check Gmail spam folder
- If connection shows error: Contact support@tenderflow.ai
- Sync history location: Integrations page → View Sync History

**Team Responsibilities:**
- Daily check (9am): Sarah reviews TenderFlow Inbox for new alerts
- Weekly review (Friday 4pm): John checks sync history and archives processed items
- Monthly audit (First Monday): Jane verifies all tender emails are being caught

**Store this document in:**
- Your team's shared drive
- TenderFlow (Documents section)
- Email to your manager and backup colleague

---

## 📖 Example Complete Workflow

Let's walk through a realistic scenario showing how Gmail Connection works in practice.

### The Organisation

**Yorkshire Care Services Ltd**
- 150 staff providing domiciliary care and supported living across Yorkshire
- Bids for 10-15 council tenders per year
- Small bids team: 
  - Emma (Bids Manager) - Coordinates all tenders
  - Sarah (Care Coordinator) - Writes care methodology
  - John (Finance Manager) - Handles pricing

### The Problem (Before Gmail Connection)

**Emma's typical week:**

**Monday morning:**
- Arrives at office, opens Gmail
- 47 unread emails over the weekend
- Scans through looking for tender alerts
- Finds 2 tender emails buried in the noise
- Copies details into Excel spreadsheet
- Takes 45 minutes

**Tuesday:**
- Receives tender alert email at 3pm
- Stuck in meeting, doesn't see it until 5pm
- Tender deadline is Friday (3 days away!)
- Panics, rushes to download documents
- Stays late to read specification

**Wednesday:**
- Council sends clarification email
- Email goes to John's inbox by mistake
- John ignores it (thinks it's spam)
- Clarification missed, bid is incomplete

**Thursday:**
- Emma remembers she saw a tender email last week
- Can't find it in Gmail (too many emails)
- Spends 20 minutes searching
- Gives up, possibly missed deadline

**Friday:**
- Weekend emails arrive
- Emma doesn't check work email at weekends
- Two urgent tender alerts sit unread until Monday
- By Monday, one deadline has passed

**Result:**
- 1 tender missed completely (Friday deadline)
- 1 incomplete bid (missed clarification)
- 10+ hours per week on email admin
- High stress, constant worry about missing opportunities

---

### The Solution (With Gmail Connection)

**Monday, 9am - Initial Setup (15 minutes):**

Emma follows this guide:
1. Creates dedicated Gmail: tenderalerts@yorkshirecare.com
2. Connects it to TenderFlow using OAuth
3. Configures sync frequency: Every 2 hours
4. Clicks "Sync Now" to test
5. Sees 8 tender emails from the last week processed immediately
6. TenderFlow Inbox now has 8 items, all summarised and prioritised

**Monday, 10am - First Check (5 minutes):**

Emma opens TenderFlow Inbox:
```
📧 Gmail  🔴 Urgent  📅 25 Mar 2026

New Tender: Domiciliary Care - Leeds City Council
Leeds City Council

Leeds Council seeks domiciliary care providers for 
elderly residents. Contract value: £800K/year. 
Deadline: 25th March 2026.

⚡ Action Required
Download tender documents and review requirements
Due: 22 Mar 2026
```

Emma clicks "View Tender" → Full details appear → Assigns to Sarah ("Review methodology requirements") → Task created automatically

---

**Tuesday, 2pm - Automatic Processing:**

While Emma is in a meeting, a new tender email arrives in Gmail at 2:15pm.

**What happens (Emma doesn't need to do anything):**

2:15pm: Email arrives in tenderalerts@yorkshirecare.com
```
From: procurement@bradford.gov.uk
Subject: New Tender Opportunity - Supported Living Services

Dear Provider,

Bradford Council has published a new tender for supported 
living services for adults with learning disabilities.

Tender reference: BC-SL-2026-15
Contract value: £1.2 million per year
Deadline: 5th April 2026, 12:00 noon

Portal: https://bradford.bipsolutions.com/tender/BC-SL-2026-15

Best regards,
Bradford Council Procurement
```

3:00pm: TenderFlow's scheduled sync runs
- Connects to Gmail
- Finds 1 new email (the Bradford tender)
- AI analyses it:
  - Type: New Tender
  - Authority: Bradford Council
  - Title: Supported Living Services
  - Value: £1.2M
  - Deadline: 5 April 2026
  - Priority: High (good match for Yorkshire Care's expertise)
  - Action: Download tender documents
- Creates Inbox item
- Creates tender record
- Sends notification to Emma's phone

3:01pm: Emma's phone buzzes
```
📱 TenderFlow AI

🟠 High Priority Tender

Bradford Council - Supported Living

New £1.2M tender opportunity matching your 
expertise. Deadline: 5th April.

[View Now]
```

Emma taps notification → Opens TenderFlow → Reviews summary → Assigns to team → Back to meeting in 2 minutes

**Result:** Urgent tender caught immediately, even though Emma was busy. No stress, no missed deadline.

---

**Wednesday, 11am - Clarification Handled:**

Bradford Council posts a clarification on their portal and sends this email:
```
From: noreply@bipsolutions.com
Subject: Clarification Posted - BC-SL-2026-15

Question: "What CQC rating is required?"

Answer: "Providers must have 'Good' or 'Outstanding' 
CQC rating. Requires Improvement providers may apply 
with evidence of improvement plan."

View on portal: https://bradford.bipsolutions.com/tender/...
```

**What happens:**

11:45am: Email arrives in tenderalerts@yorkshirecare.com

12:00pm: TenderFlow syncs (next scheduled check)
- Finds clarification email
- AI matches it to existing tender: "Bradford - Supported Living"
- Classifies as: Clarification
- Creates Inbox item linked to tender:
```
📧 Gmail  🟠 High  📅 5 Apr 2026

Clarification: CQC Rating Requirements
Bradford Council

Q: What CQC rating required?
A: Good or Outstanding. Requires Improvement with plan.

⚡ Action Required
Review clarification and update quality section of bid
Due: 2 Apr 2026
```

- Creates task: "Update Section 3 (Quality) with CQC clarification"
- Assigns to Sarah (she's writing methodology)
- Notification sent to Sarah

12:05pm: Sarah's phone buzzes → She sees the clarification → Updates bid document → Marks task as complete

**Result:** Clarification caught, assigned, and actioned within 5 minutes. Previously, this would have been missed or delayed by days.

---

**Thursday - Weekend Email Preparation:**

Emma reviews TenderFlow Inbox:
- 3 new tenders this week (all processed automatically)
- 1 clarification (already handled)
- 2 informational updates (marked as read)

Emma goes home Friday evening, relaxed - she knows:
- TenderFlow will check Gmail every 2 hours all weekend
- If urgent tender arrives, she'll get a phone notification
- On Monday, all weekend emails will be in TenderFlow Inbox, summarised and ready
- Nothing will be missed

---

**Monday, 9am - Weekly Review (10 minutes):**

Emma checks TenderFlow Inbox:
- 2 new tender emails arrived Saturday (both processed automatically)
- 1 is urgent (deadline Wednesday) - Emma saw phone notification Saturday, already assigned to team
- 1 is medium priority (deadline in 3 weeks) - Emma reviews now, decides to bid, assigns tasks

Emma checks Sync History:
- 12 syncs over the weekend (every 2 hours)
- All successful ✓
- 2 tender emails found and processed
- Total time processing: 15 seconds per sync

Emma feels in control - no panic, no scrambling, no late nights.

---

### The Results

**Time savings per week:**

**Before Gmail Connection:**
- Checking Gmail for tenders: 2 hours/week
- Copying details to spreadsheets: 1.5 hours/week
- Searching for old emails: 1 hour/week
- Stress and panic: Countless hours
- **Total: 4.5 hours/week**

**After Gmail Connection:**
- Daily TenderFlow Inbox check: 30 minutes/week
- Weekly sync review: 10 minutes/week
- **Total: 40 minutes/week**

**Saved: 3 hours 50 minutes per week = 200 hours per year**

**Quality improvements:**

**Before:**
- 15% of tenders missed due to buried emails
- 30% of clarifications missed
- High stress, reactive approach

**After:**
- 0% of tenders missed (TenderFlow catches everything)
- 0% of clarifications missed (all linked to tenders automatically)
- Low stress, proactive approach

**Business impact:**

**Over 12 months:**
- Bid on 3 additional tenders (previously missed)
- Won 1 additional contract (£600K value)
- Improved team morale (less scrambling, more time for quality bids)
- Emma has 200 extra hours to focus on bid quality instead of email admin

**ROI: TenderFlow AI pays for itself many times over**

---

## 🎓 Summary

Gmail Connection is one of TenderFlow AI's most powerful features. By automating the tedious work of checking emails, extracting tender details, and creating actions, it saves hours every week while ensuring you never miss an opportunity.

**Key takeaways:**

✅ **Set up once, benefit forever** - 15 minutes to connect, then automatic processing forever

✅ **Secure OAuth process** - Google-verified, your password never shared, you're in control

✅ **AI-powered intelligence** - Classifies emails, extracts details, suggests actions automatically

✅ **Nothing missed** - Syncs every 2 hours, even weekends, catches clarifications and amendments

✅ **Time saved** - Typical care provider saves 4+ hours per week on email admin

✅ **Better bids** - Spend saved time improving bid quality instead of searching emails

✅ **Peace of mind** - Know that TenderFlow is monitoring your inbox 24/7

---

## 📞 Need Help?

**Support Contact:**
- Email: support@tenderflow.ai
- Phone: 0800 TENDERFLOW (during business hours)
- Live chat: app.tenderflow.ai (bottom right corner)

**Typical response times:**
- Urgent issues (connection broken): Within 2 hours
- General questions: Within 24 hours
- Feature requests: We log and review monthly

**Related Tutorials:**
- [Portal Connections Overview](./portal-connections)
- [Find a Tender Connection](./find-a-tender)
- [Tender Inbox Management](./tender-inbox)
- [AI Chat Assistant](./ai-chat-assistant)

**Video Tutorial:**
[Coming soon - Subscribes will be notified]

---

**Last updated**: March 2026  
**Tutorial version**: 1.0  
**Tested on**: TenderFlow AI v2.0

---

**We hope this guide helps you connect Gmail successfully! If you have suggestions for improving this tutorial, please email docs@tenderflow.ai**