# Public Procurement APIs Tutorial for TenderFlow AI

**Category**: Integrations  
**Time to Complete**: 20-30 minutes (all three connections)  
**Difficulty**: Easy  
**Recommended For**: Bid Managers, Administrators

---

## 📋 **TABLE OF CONTENTS**

1. [What These Connections Do](#what-these-connections-do)
2. [Why Public API Connections Matter](#why-public-api-connections-matter)
3. [Prerequisites](#prerequisites)
4. [Find a Tender Connection](#find-a-tender-connection)
5. [Contracts Finder Connection](#contracts-finder-connection)
6. [Proactis Connector Setup](#proactis-connector-setup)
7. [Understanding Sync Frequency](#understanding-sync-frequency)
8. [Filtering and Search Criteria](#filtering-and-search-criteria)
9. [What Happens After Connection](#what-happens-after-connection)
10. [Troubleshooting Failed Connections](#troubleshooting-failed-connections)
11. [When to Use Email Ingestion Instead](#when-to-use-email-ingestion-instead)
12. [Best Practice Tips](#best-practice-tips)
13. [Complete Example Workflow](#complete-example-workflow)

---

## 1️⃣ **WHAT THESE CONNECTIONS DO**

### **Find a Tender (FTS)**

**What it does:**
```
Find a Tender is the UK government's official platform for 
publishing public sector contract opportunities worth over 
£12,000. TenderFlow connects directly to Find a Tender's 
API and automatically downloads new tender notices based on 
your search criteria.
```

**What you get:**
- All UK government tenders (councils, NHS, police, schools)
- Updated multiple times per day
- Complete tender details (title, description, deadline, value)
- Direct links to full tender documents
- Automatic deduplication (no duplicates)

**Think of it as:**
```
Instead of visiting findatender.service.gov.uk every day and 
searching manually, TenderFlow does this automatically every 
few hours and drops results straight into your Inbox.
```

---

### **Contracts Finder**

**What it does:**
```
Contracts Finder is the UK's official portal for lower-value 
public sector contracts (£10,000 to £138,760). TenderFlow 
connects to Contracts Finder's API and pulls new contract 
notices matching your criteria.
```

**What you get:**
- Lower-value council and NHS contracts
- Smaller, local opportunities
- Quick wins and framework call-offs
- Less competition (many providers don't monitor Contracts Finder)
- Same automatic processing as Find a Tender

**Think of it as:**
```
The smaller sibling of Find a Tender. Often overlooked, but 
contains quick-win opportunities perfect for building 
relationships with new councils.
```

---

### **Proactis Portal Connector**

**What it does:**
```
Proactis is a procurement software used by many UK councils 
and NHS trusts. If your local councils use Proactis portals 
(e.g., kent.proactiscloud.com), TenderFlow can connect 
directly to monitor tender activity.
```

**What you get:**
- Real-time access to Proactis-hosted tenders
- Faster than email alerts (see tenders the moment they publish)
- Direct API connection (no email parsing needed)
- Automatic document download (if API key permits)

**Think of it as:**
```
A direct line to councils using Proactis. Like having an 
insider who tells you the moment a tender is published, 
before email alerts even go out.
```

**Important note:**
```
Proactis connections require API credentials from your council 
contact. If you don't have these, use Email Ingestion instead 
(see section 11).
```

---

## 2️⃣ **WHY PUBLIC API CONNECTIONS MATTER**

### **The Problem (Before API Connections)**

Emma is a Bid Manager at a Yorkshire care provider. Her old process:

**Monday, 9am:**
```
1. Opens findatender.service.gov.uk
2. Types "domiciliary care" in search
3. Filters by Yorkshire
4. Scans through 20 results
5. Opens each interesting tender
6. Copies details into spreadsheet
7. Repeats for Contracts Finder
8. Repeats for 3 different Proactis portals
Time taken: 90 minutes
```

**Tuesday, 9am:**
```
Repeats entire process to check for new tenders
Finds 2 new ones (rest are repeats from yesterday)
Time taken: 90 minutes (mostly wasted on duplicates)
```

**Every single working day:**
```
90 minutes checking portals manually
= 7.5 hours per week
= 390 hours per year
= 48 working days per year just searching for tenders!
```

**Plus:**
```
❌ Misses tenders published outside working hours
❌ Misses tenders on holidays/weekends
❌ Sometimes forgets to check a portal
❌ Wastes time on duplicates and irrelevant tenders
❌ High risk of missing deadlines
❌ Boring, repetitive work (demoralising)
```

---

### **The Solution (With API Connections)**

Emma sets up TenderFlow API connections once:

**One-time setup (Monday, 20 minutes):**
```
1. Connects Find a Tender API
   - Sets search: "domiciliary care OR supported living"
   - Sets location: Yorkshire
   - Sets minimum value: £50,000
   - Sync frequency: Every 6 hours

2. Connects Contracts Finder API
   - Same search criteria
   - Sync frequency: Every 6 hours

3. Connects Proactis for 3 local councils
   - Yorkshire Council
   - Manchester Council  
   - Leeds Council
   - Each syncs every 4 hours
```

**From then on (Every day, 5 minutes):**
```
1. Opens TenderFlow Inbox
2. Sees all new tenders from all sources
3. AI has already summarised them
4. AI has already scored them
5. Already deduplicated (no repeats)
6. Clicks interesting ones, ignores rest
Time taken: 5 minutes
```

**Time saved:**
```
Before: 90 minutes/day = 390 hours/year
After: 5 minutes/day = 22 hours/year

SAVED: 368 hours per year = 46 working days!
```

**Quality improvements:**
```
✅ Never misses a tender (checks 24/7)
✅ Catches weekend opportunities
✅ No duplicates (system deduplicates automatically)
✅ AI pre-filters irrelevant tenders
✅ Prioritises high-fit opportunities
✅ Emma focuses on winning bids, not searching
```

**The result:**
```
Emma now spends 46 extra working days per year on actual bid 
writing instead of searching. Her organisation wins 3 more 
contracts per year because their bids are stronger.

ROI: TenderFlow pays for itself many, many times over.
```

---

## 3️⃣ **PREREQUISITES**

### **Essential (You MUST Have These):**

✅ **Admin Access to TenderFlow**
```
Why: Only admins can create new connections
Check: Settings → Users → Your role shows "Admin"
If not: Ask your organisation admin to upgrade your account
```

✅ **Clear Search Criteria**
```
Why: Connections need to know what to search for
What you need:
- Service types (e.g., "domiciliary care", "residential care")
- Geographic areas (e.g., "Yorkshire", "Manchester", "South East")
- Minimum contract value (e.g., £50,000+)

Tip: Write these down before starting setup
```

✅ **10-15 Minutes Free Time**
```
Why: Setup requires concentration
Best time: Quiet morning, not during crisis
Avoid: Setting up while in meeting or rushing
```

---

### **Optional (Helpful But Not Essential):**

📋 **List of Local Councils You Work With**
```
Why: Helps you choose which Proactis portals to connect
Example list:
- Kent County Council
- Essex County Council
- Hampshire County Council
- Surrey County Council
```

🔍 **Recent Tender Examples**
```
Why: Test your filters work correctly
How: Keep email or URL of recent tender that was good fit
Use: After setup, check if TenderFlow would have found it
```

📧 **IT Team Contact**
```
Why: If your organisation's firewall blocks API connections
Rare but possible in high-security organisations
```

---

### **What You DON'T Need:**

❌ **API Keys** (for Find a Tender and Contracts Finder)
```
TenderFlow connects using public APIs - no keys required
```

❌ **Technical Knowledge**
```
No coding, no API knowledge needed
If you can fill in a form, you can set this up
```

❌ **Permission from Government**
```
These are public APIs, free to use
```

---

## 4️⃣ **FIND A TENDER CONNECTION**

### **Step-by-Step Setup Guide**

---

#### **Step 1: Navigate to Integrations Page**

**What to do:**
```
1. Log into TenderFlow AI
2. Click "Integrations" in left sidebar (🔌 icon)
3. Page loads showing "Portal Connections"
```

**What you should see:**
```
┌─────────────────────────────────────────┐
│ Portal Connections                      │
│                                         │
│ Connect to procurement portals and APIs │
│ to automatically fetch tender alerts    │
│                                         │
│               [Add Connection]          │
└─────────────────────────────────────────┘
```

---

#### **Step 2: Start New Connection**

**What to do:**
```
1. Click blue "Add Connection" button (top right)
2. Dialog appears: "Add Portal Connection"
3. Look for PUBLIC_API type
4. Click on "PUBLIC_API" card
```

**What you should see:**
```
Connection Types:

┌──────────────────┐  ┌──────────────────┐
│ 📧 EMAIL         │  │ 🌐 PUBLIC_API   │
│ Gmail OAuth      │  │ Gov APIs        │
└──────────────────┘  └──────────────────┘

┌──────────────────┐  ┌──────────────────┐
│ 🔐 PORTAL        │  │ 🔗 LINK_WATCHER │
│ Direct access    │  │ URL monitoring  │
└──────────────────┘  └──────────────────┘
```

Click: 🌐 PUBLIC_API

---

#### **Step 3: Choose "Find a Tender"**

**What to do:**
```
1. In the form, look for "Source Type" dropdown
2. Click dropdown
3. Select "find_a_tender" from options
```

**Source Type Options:**
```
▼ Source Type
  ├─ find_a_tender       ← SELECT THIS
  ├─ contracts_finder
  └─ proactis
```

---

#### **Step 4: Name Your Connection**

**What to do:**
```
In "Connection Name" field, type a descriptive name
```

**Good names (be specific):**
```
✅ "Find a Tender - Domiciliary Care Yorkshire"
✅ "FTS - Adult Social Care England"
✅ "Find a Tender - Care Homes South East"
```

**Bad names (too vague):**
```
❌ "Find a Tender"
❌ "API Connection"
❌ "Connection 1"
```

**Why specific names matter:**
```
You might have multiple Find a Tender connections:
- One for domiciliary care tenders
- One for supported living tenders
- One for urgent opportunities (different filters)

Clear names help you identify which connection found each tender.
```

---

#### **Step 5: Configure Search Keywords**

**What to do:**
```
In "Keywords" field, enter your search terms
```

**How keywords work:**
```
TenderFlow searches tender titles and descriptions for these 
words. Use OR and AND to combine terms:

- OR = tender must contain at least one term
- AND = tender must contain all terms
```

**Examples:**

**For domiciliary care provider:**
```
Keywords: domiciliary care OR home care OR homecare OR 
personal care

Why: Councils use different terms for same service
Result: Catches all variations
```

**For supported living provider:**
```
Keywords: supported living OR supported accommodation OR 
learning disabilities OR learning disabilities accommodation

Why: Catches both service type and client group
Result: More comprehensive results
```

**For residential care provider:**
```
Keywords: residential care OR care home OR nursing home OR 
elderly accommodation

Why: Multiple names for residential services
Result: Doesn't miss opportunities
```

**For multiple services:**
```
Keywords: (domiciliary care OR home care) OR (supported living 
OR supported accommodation)

Why: Brackets group related terms
Result: Finds tenders for any of your services
```

**Pro tip:**
```
Start broad, then narrow down after first sync if getting too 
many irrelevant results. Better to see too many at first than 
miss opportunities.
```

---

#### **Step 6: Set Geographic Filters**

**What to do:**
```
In "Location" field, enter your target areas
```

**How location filtering works:**
```
TenderFlow searches tender locations, authority names, and 
postcodes. Can use:
- Region names (e.g., Yorkshire)
- County names (e.g., Kent, Essex)
- City names (e.g., Manchester, Leeds)
- Postcodes (e.g., M1, LS1)
- Multiple areas separated by OR
```

**Examples:**

**Regional provider (Yorkshire):**
```
Location: Yorkshire OR York OR Leeds OR Bradford OR Sheffield 
OR Doncaster

Why: Covers major cities and region name
Result: Catches all Yorkshire tenders
```

**Multi-county provider (South East):**
```
Location: Kent OR Surrey OR Sussex OR Hampshire OR Berkshire

Why: Lists all counties you cover
Result: Finds opportunities across coverage area
```

**City-focused provider:**
```
Location: Manchester OR M1 OR M2 OR M3 OR M4 OR Salford OR 
Trafford

Why: Includes city name, postcodes, and boroughs
Result: Comprehensive Manchester coverage
```

**Nationwide provider:**
```
Location: [leave empty]

Why: No location filter = sees all UK tenders
Result: Most results, but also most irrelevant
```

**Pro tip:**
```
Start with specific locations (your current areas). After 
confirming it works, add new locations one at a time to 
gradually expand coverage.
```

---

#### **Step 7: Set Minimum Contract Value (Optional)**

**What to do:**
```
In "Minimum Value" field, enter lowest contract value you're 
interested in
```

**Why filter by value:**
```
- Saves time (skip tiny contracts not worth bidding)
- Focuses on contracts matching your capacity
- Reduces noise in Inbox
```

**Typical values for care providers:**

**Small care provider (10-30 staff):**
```
Minimum Value: £20,000

Why: Can handle smaller contracts
Sweet spot: £20K - £200K contracts
```

**Medium care provider (30-100 staff):**
```
Minimum Value: £50,000

Why: Focus on contracts matching capacity
Sweet spot: £50K - £500K contracts
```

**Large care provider (100+ staff):**
```
Minimum Value: £100,000

Why: Skip small contracts, focus on strategic opportunities
Sweet spot: £100K - £5M contracts
```

**Multi-location provider:**
```
Minimum Value: [leave empty or £0]

Why: Interested in contracts of all sizes
Accept: Everything from £10K spot purchases to £10M frameworks
```

**Important notes:**
```
- Many tenders don't list value in initial notice
- If you set minimum too high, might miss opportunities
- Can always ignore low-value tenders in Inbox later
- Recommendation: Start with no minimum, then adjust
```

---

#### **Step 8: Set Sync Frequency**

**What to do:**
```
In "Sync Frequency" dropdown, choose how often TenderFlow 
should check for new tenders
```

**Options:**
```
▼ Sync Frequency
  ├─ Every 1 hour
  ├─ Every 2 hours
  ├─ Every 4 hours
  ├─ Every 6 hours     ← RECOMMENDED for Find a Tender
  ├─ Every 12 hours
  └─ Every 24 hours
```

**How to choose:**

**Every 6 hours (RECOMMENDED):**
```
Best for: Most care providers
Why: Find a Tender updates several times per day, but not 
constantly
Checks: 4 times per day (3am, 9am, 3pm, 9pm)
Benefit: Catches new tenders same day without hammering API
```

**Every 4 hours (If you need faster):**
```
Best for: Competitive markets, urgent frameworks
Why: Get tenders faster than competitors
Checks: 6 times per day
Drawback: Slightly more server load (usually fine)
```

**Every 12 hours (If you're relaxed):**
```
Best for: Less competitive services, or supplementary connection
Why: Still check twice daily
Checks: Morning and evening
Benefit: Lighter server load
```

**Every 24 hours (NOT recommended for Find a Tender):**
```
Why not: Tenders often publish and close quickly
Risk: Miss urgent opportunities
Only use if: This is backup connection to email alerts
```

**Our recommendation:**
```
Start with Every 6 hours. After a few weeks, if you notice 
tenders publishing at specific times, adjust to catch them 
faster.
```

---

#### **Step 9: Save and Test Connection**

**What to do:**
```
1. Review all fields (name, keywords, location, value, frequency)
2. Click green "Create Connection" button
3. Wait while TenderFlow creates connection (2-3 seconds)
```

**What you should see:**
```
✅ Success message: "Connection created successfully"

New connection card appears:
┌─────────────────────────────────────────┐
│ 🌐 Find a Tender - Domiciliary Yorkshire│
│    PUBLIC_API • find_a_tender           │
│                                         │
│ Status: ⏳ Not synced yet               │
│ Last Sync: Never                        │
│ Frequency: Every 6h                     │
│                                         │
│ Configuration:                          │
│ • Keywords: domiciliary care OR home...│
│ • Location: Yorkshire OR Leeds OR...   │
│ • Min Value: £50,000                   │
│                                         │
│ [🔄 Sync Now] [⚙️ Edit] [🗑️ Delete]   │
└─────────────────────────────────────────┘
```

**Now test it:**
```
1. Click "Sync Now" button (🔄 icon)
2. Status changes to "🔄 Syncing..."
3. Wait 10-30 seconds (depends on how many results)
4. Status changes to "✅ Connected"
5. Shows "Last Sync: Just now"
6. Shows "X items fetched, Y items created"
```

**Example successful sync:**
```
✅ Connected
Last Sync: Just now
Fetched: 15 tenders
Created: 12 new records
Duplicates: 3 (already in system)
```

---

#### **Step 10: Check Your Inbox**

**What to do:**
```
1. Click "Inbox" in left sidebar
2. Filter by source: "Find a Tender"
3. See all tenders fetched from this connection
```

**What to expect:**

**First sync (initial backlog):**
```
TenderFlow fetches tenders from last 30 days matching your 
criteria. You might see 10-50 tenders on first sync.

Don't worry - most will be old (already past deadline). This 
is normal. Future syncs only fetch NEW tenders.
```

**Subsequent syncs (ongoing):**
```
Every 6 hours, TenderFlow checks for NEW tenders published 
since last sync. Usually 0-5 new tenders per sync.
```

**What each Inbox item shows:**
```
┌─────────────────────────────────────────┐
│ 🌐 Find a Tender  🟠 High  📅 15 May   │
│                                         │
│ Domiciliary Care Services - Leeds      │
│ Leeds City Council                     │
│                                         │
│ Leeds Council seeks domiciliary care   │
│ providers for elderly residents...     │
│                                         │
│ Value: £500,000/year                   │
│ Deadline: 15 May 2026                  │
│ Published: 2 days ago                  │
│                                         │
│ ⚡ Action Required                      │
│ Download tender documents and review   │
│ requirements                           │
│                                         │
│ [View Tender] [Mark Read] [Archive]   │
└─────────────────────────────────────────┘
```

---

### **Find a Tender: Configuration Summary**

**Quick reference for setting up Find a Tender connection:**

```
Connection Name: Find a Tender - [Your Service] [Your Region]
Source Type: find_a_tender
Keywords: [service type] OR [alternative terms]
Location: [your geographic coverage areas]
Minimum Value: £50,000 (or adjust for your capacity)
Sync Frequency: Every 6 hours (recommended)
```

**Common configurations:**

**Domiciliary Care, Yorkshire:**
```
Keywords: domiciliary care OR home care OR homecare OR personal care
Location: Yorkshire OR Leeds OR Bradford OR Sheffield
Min Value: £50,000
Frequency: Every 6 hours
```

**Supported Living, South East:**
```
Keywords: supported living OR supported accommodation OR learning disabilities
Location: Kent OR Surrey OR Sussex OR Hampshire
Min Value: £100,000
Frequency: Every 6 hours
```

**Residential Care, Nationwide:**
```
Keywords: residential care OR care home OR nursing home
Location: [empty - nationwide]
Min Value: £200,000
Frequency: Every 6 hours
```

---

## 5️⃣ **CONTRACTS FINDER CONNECTION**

Contracts Finder setup is almost identical to Find a Tender, 
with a few key differences.

---

### **What Makes Contracts Finder Different**

**Contract value range:**
```
Find a Tender: Usually £12,000+, often £100,000+
Contracts Finder: £10,000 to £138,760 (below OJEU threshold)

Result: Contracts Finder has smaller, quicker opportunities
```

**Competition level:**
```
Find a Tender: High competition (everyone monitors it)
Contracts Finder: Lower competition (many providers overlook it)

Result: Higher win rate on Contracts Finder
```

**Tender types:**
```
Find a Tender: Full tenders, frameworks, DPS
Contracts Finder: Quick quotes, spot purchases, mini-competitions

Result: Contracts Finder is faster turnaround
```

**Update frequency:**
```
Find a Tender: Multiple updates per day
Contracts Finder: Less frequent updates (several per day)

Result: Check Contracts Finder less often
```

---

### **Step-by-Step Setup Guide**

---

#### **Step 1-2: Navigate and Start Connection**

```
Same as Find a Tender:
1. Go to Integrations page
2. Click "Add Connection"
3. Select PUBLIC_API type
```

---

#### **Step 3: Choose "Contracts Finder"**

**What to do:**
```
In "Source Type" dropdown, select "contracts_finder"
```

**Source Type Options:**
```
▼ Source Type
  ├─ find_a_tender
  ├─ contracts_finder    ← SELECT THIS
  └─ proactis
```

---

#### **Step 4: Name Your Connection**

**Good names:**
```
✅ "Contracts Finder - Quick Wins Yorkshire"
✅ "CF - Small Contracts Kent"
✅ "Contracts Finder - Spot Purchases"
```

**Why "Quick Wins"?**
```
Contracts Finder tenders are usually:
- Lower value (£10K-£100K)
- Faster turnaround (1-2 weeks to submit)
- Less complex (simpler requirements)
- Good for building council relationships
```

---

#### **Step 5-7: Configure Search (Same as Find a Tender)**

**Keywords:**
```
Use same keywords as Find a Tender connection:
domiciliary care OR home care OR homecare
```

**Location:**
```
Use same location filters:
Yorkshire OR Leeds OR Bradford OR Sheffield
```

**Minimum Value:**
```
DIFFERENT from Find a Tender:

For Contracts Finder, set LOWER minimum:
- £10,000 (catches everything)
- £20,000 (skip tiny contracts)
- £30,000 (focus on substantial quick wins)

Don't set too high - you'll miss the best opportunities!
```

**Why lower minimum for Contracts Finder:**
```
£50,000 contract on Contracts Finder = 
- Less competition (many providers skip it)
- Easier to win
- Good stepping stone for future larger tenders
- Quick revenue

Same £50,000 contract on Find a Tender =
- High competition
- Harder to win
- More bidders

Focus on Contracts Finder's sweet spot: £20K-£100K
```

---

#### **Step 8: Set Sync Frequency (Different from Find a Tender)**

**Recommended for Contracts Finder:**
```
▼ Sync Frequency
  └─ Every 6 hours     ← RECOMMENDED
```

**Why Every 6 hours:**
```
Contracts Finder updates less frequently than Find a Tender.
Checking every 6 hours ensures you catch new opportunities 
without over-syncing.
```

**Alternative:**
```
Every 12 hours (If Contracts Finder is supplementary to your 
main Find a Tender connection)
```

---

#### **Step 9-10: Save, Test, and Check Inbox**

```
Same process as Find a Tender:
1. Click "Create Connection"
2. Click "Sync Now" to test
3. Check Inbox for results
4. Review first batch of tenders
```

**What to expect on first sync:**
```
Fetched: 5-15 contracts (usually fewer than Find a Tender)
Created: 5-12 new records
Duplicates: 0-3

Why fewer? Contracts Finder publishes less volume, but higher 
relevance for quick wins.
```

---

### **Contracts Finder: Configuration Summary**

**Quick reference:**

```
Connection Name: Contracts Finder - Quick Wins [Your Region]
Source Type: contracts_finder
Keywords: [same as Find a Tender]
Location: [same as Find a Tender]
Minimum Value: £20,000 (lower than Find a Tender!)
Sync Frequency: Every 6 hours
```

**Example configuration:**

```
Name: Contracts Finder - Quick Wins Yorkshire
Type: contracts_finder
Keywords: domiciliary care OR home care OR homecare
Location: Yorkshire OR Leeds OR Bradford
Min Value: £20,000
Frequency: Every 6 hours
```

---

### **Managing Both Find a Tender and Contracts Finder**

**Best practice: Set up BOTH connections**

**Why have both:**
```
Find a Tender = Your main tender source (larger contracts)
Contracts Finder = Your quick wins source (smaller contracts)

Together, they give you complete coverage of UK public sector 
opportunities.
```

**Example setup:**

**Connection 1:**
```
Name: Find a Tender - Main Tenders Yorkshire
Keywords: domiciliary care OR home care
Location: Yorkshire OR Leeds OR Bradford
Min Value: £50,000
Frequency: Every 6 hours
```

**Connection 2:**
```
Name: Contracts Finder - Quick Wins Yorkshire
Keywords: domiciliary care OR home care
Location: Yorkshire OR Leeds OR Bradford
Min Value: £20,000
Frequency: Every 6 hours
```

**Result:**
```
Your TenderFlow Inbox now contains:
- Large strategic tenders (Find a Tender)
- Quick win opportunities (Contracts Finder)
- Automatically deduplicated (if same tender on both, only 
  appears once)
- All in one place, ready to review
```

**Daily workflow:**
```
1. Open TenderFlow Inbox (5 minutes)
2. Filter by "Contracts Finder" → Quick scan for easy wins
3. Filter by "Find a Tender" → Detailed review of major 
   opportunities
4. Prioritise based on:
   - Deadline urgency
   - AI fit score
   - Strategic importance
   - Resource availability
```

---

## 6️⃣ **PROACTIS CONNECTOR SETUP**

Proactis is more complex than Find a Tender and Contracts 
Finder because it requires API credentials from the council.

---

### **What is Proactis?**

**Proactis is:**
```
A procurement software platform used by many UK councils and 
NHS trusts to publish and manage tenders.
```

**Examples of Proactis portals:**
```
- kent.proactiscloud.com (Kent County Council)
- manchester.proactiscloud.com (Manchester City Council)
- yorkshire.mytenders.com (Yorkshire councils)
- nhs-northwest.bipsolutions.com (NHS trusts)
```

**How to spot a Proactis portal:**
```
Look at tender email or URL:
- Contains "proactis" or "mytenders" or "bipsolutions"
- Login page says "Powered by Proactis"
- Email comes from "@proactis.com" or "@bipsolutions.com"
```

---

### **Two Ways to Connect to Proactis**

#### **Option 1: Direct API Connection (Best, but requires credentials)**

**What you need:**
```
1. Proactis portal URL (e.g., kent.proactiscloud.com)
2. API key or API token from the council
3. Your account username/ID on that portal
```

**How to get these:**
```
Contact your procurement officer at the council:

Email template:
---
Subject: API Access Request for Proactis Portal

Dear [Procurement Officer Name],

We're implementing TenderFlow AI to improve our tender 
monitoring and response quality. To connect our system 
to your Proactis portal, we need:

1. API key or token for programmatic access
2. Our account ID/username
3. Confirmation of allowed API rate limits

Could you please provide these details or direct me to 
your IT team?

Thank you,
[Your Name]
[Your Organisation]
---
```

**Reality check:**
```
✅ Some councils provide API access easily
❌ Many councils don't offer API access to suppliers
⚠️ Some councils charge for API access

If council won't provide API credentials, use Option 2 
(Email Ingestion) instead.
```

---

#### **Option 2: Email Ingestion (Easier, works without API credentials)**

**What you do:**
```
1. Don't connect to Proactis API
2. Instead, use Gmail Connection (see Gmail tutorial)
3. Set up email forwarding:
   - Forward all Proactis emails to your tender alerts Gmail
   - TenderFlow processes emails automatically
4. Benefit: Works without API credentials
5. Drawback: Slightly slower than direct API (waits for emails)
```

**When to use Email Ingestion:**
```
✅ Council won't provide API credentials
✅ You want simplest setup
✅ You're okay with email-speed updates (few hours delay)
✅ You already use Gmail Connection for other alerts
```

**When to use Direct API:**
```
✅ Council provides API credentials
✅ You want fastest possible updates (real-time)
✅ You want to download tender documents automatically
✅ You bid frequently on that council's tenders
```

**Our recommendation:**
```
Try asking for API credentials. If council says no or takes 
too long, use Email Ingestion instead. It works just as well 
for most purposes.
```

---

### **Step-by-Step Setup (Direct API Connection)**

**Only follow these steps if you have API credentials from 
the council. Otherwise, skip to Option 2 (Email Ingestion).**

---

#### **Step 1-2: Navigate and Start Connection**

```
Same as before:
1. Go to Integrations page
2. Click "Add Connection"
3. Select PORTAL_SESSION type (NOT PUBLIC_API!)
```

**Important:**
```
Proactis uses PORTAL_SESSION type because it requires 
authentication.

PUBLIC_API is only for open APIs (Find a Tender, Contracts 
Finder).
```

---

#### **Step 3: Choose "Proactis"**

**What to do:**
```
In "Source Type" dropdown, select "proactis"
```

---

#### **Step 4: Name Your Connection**

**Good names:**
```
✅ "Proactis - Kent County Council"
✅ "Proactis - Manchester Tenders"
✅ "BIP Solutions - Yorkshire NHS"
```

**Include:**
```
- Portal owner (Kent, Manchester, etc.)
- What makes it unique (if you have multiple)
```

---

#### **Step 5: Enter Portal URL**

**What to do:**
```
In "Portal URL" field, enter the Proactis portal address
```

**Format:**
```
https://kent.proactiscloud.com
```

**Common mistakes:**

**❌ Wrong:**
```
kent.proactiscloud.com              (missing https://)
https://kent.proactiscloud.com/     (don't include trailing slash)
https://kent.proactiscloud.com/tenders  (don't include path)
```

**✅ Correct:**
```
https://kent.proactiscloud.com
```

**How to find correct URL:**
```
1. Open Proactis email from that council
2. Click link to portal
3. Copy URL from browser address bar
4. Remove everything after the domain:
   From: https://kent.proactiscloud.com/tenders/view/12345
   To:   https://kent.proactiscloud.com
```

---

#### **Step 6: Enter API Key**

**What to do:**
```
In "API Key / Token" field, paste the API key the council 
provided you
```

**What it looks like:**
```
Usually long string of letters and numbers:
a3b2c1d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0

Or sometimes:
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Where to paste it:**
```
Copy entire key exactly as provided:
- Don't add spaces
- Don't add "Bearer" if not already there
- Don't modify in any way
- Just paste and move on
```

**Security note:**
```
TenderFlow encrypts API keys before storing. We NEVER store 
them in plain text. Council can revoke API key anytime.
```

---

#### **Step 7: Enter Your Account ID (Optional)**

**What to do:**
```
In "Account ID / Username" field, enter your Proactis username
```

**Why needed:**
```
Some Proactis portals require account ID to:
- Track which supplier is accessing API
- Apply permission filters
- Link tender views to your account
```

**What to enter:**
```
Usually your Proactis login username:
- your.email@company.com
- CompanyName_User
- Supplier12345

Check with council which format they use.
```

**If council didn't mention this:**
```
Leave blank. Try connecting. If it fails with "Account ID 
required" error, contact council for correct format.
```

---

#### **Step 8: Set Sync Frequency**

**Recommended for Proactis:**
```
▼ Sync Frequency
  └─ Every 4 hours     ← RECOMMENDED
```

**Why Every 4 hours:**
```
Proactis portals update frequently (several times per day).
Checking every 4 hours ensures you catch new tenders quickly.
```

**Why not more frequent:**
```
- Some councils have API rate limits (max requests per day)
- More frequent = risk hitting limit
- Every 4 hours = 6 requests per day (well within limits)
```

**Alternative:**
```
Every 2 hours (If this is very important council and you know 
they have generous rate limits)
```

---

#### **Step 9: Save and Test Connection**

**What to do:**
```
1. Review all fields (name, URL, API key, account ID, frequency)
2. Click "Create Connection"
3. Wait for success message
```

**What you should see:**
```
✅ "Connection created successfully"

Connection card appears:
┌─────────────────────────────────────────┐
│ 🔐 Proactis - Kent County Council      │
│    PORTAL_SESSION • proactis            │
│                                         │
│ Status: ⏳ Not synced yet               │
│ Last Sync: Never                        │
│ Frequency: Every 4h                     │
│                                         │
│ Configuration:                          │
│ • URL: kent.proactiscloud.com          │
│ • Has API Key: Yes ✓                   │
│                                         │
│ [🔄 Sync Now] [⚙️ Edit] [🗑️ Delete]   │
└─────────────────────────────────────────┘
```

**Now test:**
```
1. Click "Sync Now"
2. Status: "🔄 Syncing..."
3. Wait 10-20 seconds
4. Status: "✅ Connected" OR "❌ Error"
```

---

#### **Step 10: Handle Connection Results**

**If successful:**
```
✅ Connected
Last Sync: Just now
Fetched: 8 tenders
Created: 5 new records

Great! Your Proactis connection works. Check Inbox for results.
```

**If error:**
```
❌ Error
Connection failed: Invalid API key

This means the API key is wrong or expired. Double-check with 
council.

Common errors:
- "Invalid API key" → Wrong key, or key expired
- "Access denied" → Your account doesn't have API permissions
- "Rate limit exceeded" → Too many requests (wait 1 hour, try again)
- "Portal not found" → Wrong URL
- "Account ID required" → Need to enter account ID in Step 7
```

**If error persists:**
```
1. Copy error message exactly
2. Email council procurement officer:
   "When connecting TenderFlow to your Proactis API, I'm getting 
   this error: [paste error]. Could you check if my API key is 
   correct and active?"
3. While waiting, use Email Ingestion instead (see Option 2)
```

---

### **Proactis: Configuration Summary**

**If you have API credentials:**

```
Connection Name: Proactis - [Council Name]
Connection Type: PORTAL_SESSION
Source Type: proactis
Portal URL: https://[council].proactiscloud.com
API Key: [provided by council]
Account ID: [your username, if required]
Sync Frequency: Every 4 hours
```

**If you DON'T have API credentials:**

```
Skip Proactis direct connection.
Use Gmail Connection instead (see Gmail tutorial).
Set up forwarding for Proactis emails.
TenderFlow processes them automatically.
```

---

## 7️⃣ **UNDERSTANDING SYNC FREQUENCY**

### **How Syncing Works**

**What is a "sync"?**
```
A sync is when TenderFlow connects to a portal/API, checks for 
new tenders, downloads them, and adds them to your Inbox.
```

**Sync process (step-by-step):**
```
1. Sync time arrives (e.g., 9:00 AM, every 6 hours)
2. TenderFlow connects to API (Find a Tender, Contracts Finder, 
   or Proactis)
3. Asks: "Show me tenders matching [your filters] published 
   since [last sync time]"
4. API responds with list of matching tenders
5. TenderFlow downloads each tender's details
6. AI processes each tender:
   - Extracts key info (title, deadline, value, location)
   - Generates summary
   - Calculates fit score
   - Identifies required actions
7. Creates Inbox items for new tenders
8. Deduplicates (if tender already exists, skips it)
9. Sends notifications if urgent
10. Updates "Last Sync" time
11. Waits until next sync time
```

**Time taken:**
```
Typical sync: 10-30 seconds
- Fast if few new tenders (5-10 seconds)
- Slower if many new tenders (20-30 seconds)
- First sync (backlog): 1-2 minutes
```

---

### **Choosing the Right Frequency**

#### **Every 1 Hour**

**Best for:**
```
- Extremely time-sensitive opportunities
- Highly competitive markets
- Frameworks with rolling deadlines
```

**Pros:**
```
✅ Fastest possible updates
✅ Beat competitors to new tenders
✅ Catch urgent opportunities immediately
```

**Cons:**
```
❌ More server load (more API requests)
❌ Might hit API rate limits (Proactis)
❌ Usually overkill for most care providers
```

**Recommendation:**
```
Only use for supplementary high-priority connection, not your 
main connections. Example: "Urgent Frameworks" connection.
```

---

#### **Every 2 Hours**

**Best for:**
```
- Important councils you bid frequently
- Proactis portals (they update often)
- Competitive services (domiciliary care in cities)
```

**Pros:**
```
✅ Very frequent updates
✅ Still beats most competitors
✅ Good for urgent deadlines
```

**Cons:**
```
⚠️ 12 syncs per day (might be excessive)
⚠️ Risk rate limits on some Proactis portals
```

**Recommendation:**
```
Use for Proactis connections to important councils. Don't use 
for Find a Tender (unnecessary).
```

---

#### **Every 4 Hours**

**Best for:**
```
- Proactis portals (recommended)
- Important supplementary connections
- Councils that publish frequently
```

**Pros:**
```
✅ Good balance of speed and efficiency
✅ 6 syncs per day (morning, afternoon, evening)
✅ Well within rate limits
```

**Cons:**
```
⚠️ Might miss very urgent same-day deadlines
```

**Recommendation:**
```
Default for Proactis connections. Also good for a secondary 
Find a Tender connection with narrower filters.
```

---

#### **Every 6 Hours (RECOMMENDED FOR MOST)**

**Best for:**
```
- Find a Tender connections (recommended)
- Contracts Finder connections (recommended)
- Most care providers' main connections
```

**Pros:**
```
✅ Perfect balance of speed and efficiency
✅ 4 syncs per day (morning, afternoon, evening, night)
✅ Catches new tenders within 6 hours
✅ Very gentle on APIs (well within limits)
✅ Recommended by TenderFlow team
```

**Cons:**
```
⚠️ Up to 6-hour delay between publication and seeing tender
```

**Sync times (example):**
```
If first sync at 3:00 AM:
- 3:00 AM (overnight tenders)
- 9:00 AM (morning tenders)
- 3:00 PM (afternoon tenders)
- 9:00 PM (evening tenders)

Covers entire working day plus overnight.
```

**Recommendation:**
```
Start with Every 6 hours for all connections. This works 
perfectly for 95% of care providers. Adjust later if needed.
```

---

#### **Every 12 Hours**

**Best for:**
```
- Supplementary connections
- Low-priority regions
- Backup to email alerts
```

**Pros:**
```
✅ Very light server load
✅ Still checks twice daily
✅ Good for monitoring multiple regions
```

**Cons:**
```
❌ Up to 12-hour delay
❌ Might miss urgent same-day deadlines
```

**Sync times (example):**
```
- 9:00 AM (morning check)
- 9:00 PM (evening check)
```

**Recommendation:**
```
Use if you're monitoring many regions and need to keep sync 
load low. Or if this connection supplements faster connections.
```

---

#### **Every 24 Hours**

**Best for:**
```
- Very low priority connections
- Archival purposes
- Testing new filters
```

**Pros:**
```
✅ Minimal server load
✅ One daily check
```

**Cons:**
```
❌ Up to 24-hour delay
❌ Likely to miss urgent tenders
❌ Not recommended for active tender hunting
```

**Recommendation:**
```
Don't use for active tender monitoring. Only use for experimental 
connections or very low-priority supplementary checks.
```

---

### **Sync Frequency Best Practices**

**Recommended setup for typical care provider:**

```
Connection 1: Find a Tender - Main
Frequency: Every 6 hours
Why: Primary source, good balance

Connection 2: Contracts Finder - Quick Wins
Frequency: Every 6 hours
Why: Lower volume, same balance

Connection 3: Proactis - Kent Council
Frequency: Every 4 hours
Why: Important council, updates frequently

Connection 4: Proactis - Manchester Council
Frequency: Every 4 hours
Why: Important council, updates frequently

Connection 5: Gmail - All Tender Alerts
Frequency: Every 2 hours
Why: Supplement to catch emails faster
```

**Total syncs per day:**
```
Find a Tender: 4 syncs
Contracts Finder: 4 syncs
Proactis Kent: 6 syncs
Proactis Manchester: 6 syncs
Gmail: 12 syncs

Total: 32 syncs per day across all connections
```

**This is perfectly fine:**
```
✅ Within all API rate limits
✅ Minimal server load
✅ Catches all opportunities quickly
✅ Balanced across all sources
```

---

### **Adjusting Frequency Later**

**When to increase frequency (make more frequent):**
```
- You notice tenders publishing at specific times
- You're missing urgent same-day deadlines
- Competitors seem to see tenders before you
- Council publishes many quick-turnaround tenders
```

**When to decrease frequency (make less frequent):**
```
- Getting too many syncs (overwhelming your Inbox)
- API rate limit warnings
- Connection mostly finds duplicates (all tenders already seen)
- Low-value connection (not finding relevant tenders)
```

**How to adjust:**
```
1. Go to Integrations page
2. Find connection card
3. Click "Edit" (⚙️ icon)
4. Change "Sync Frequency" dropdown
5. Click "Save"
6. New frequency applies from next sync
```

---

## 8️⃣ **FILTERING AND SEARCH CRITERIA**

### **How Filtering Works**

**Three filter types:**
```
1. Keywords (WHAT you're looking for)
2. Location (WHERE you can operate)
3. Minimum Value (SIZE of contracts you want)
```

**Filter logic:**
```
All three filters work together with AND:

Tender must match:
  Keywords (service type match)
  AND
  Location (geographic match)
  AND
  Minimum Value (contract size match)

If tender fails any filter, it's excluded.
```

---

### **Keyword Filtering Deep Dive**

#### **How Keywords Are Searched**

**TenderFlow searches:**
```
- Tender title
- Tender description
- Service categories (if listed)
- Authority name (sometimes relevant)
```

**Search is case-insensitive:**
```
"Domiciliary Care" = "domiciliary care" = "DOMICILIARY CARE"

Don't worry about capitalisation.
```

**Partial word matching:**
```
"home" matches:
- "home care"
- "homecare"
- "care home"
- "home-based"

Useful for catching variations.
```

---

#### **Using OR Logic**

**Basic OR:**
```
Keywords: domiciliary care OR home care

Finds tenders containing:
- "domiciliary care" (phrase match)
- OR "home care" (phrase match)
- OR BOTH

Example matches:
✅ "Domiciliary Care Services - Leeds"
✅ "Home Care for Elderly Residents"
✅ "Domiciliary and Home Care Framework"
```

**Multiple ORs:**
```
Keywords: domiciliary care OR home care OR homecare OR personal care

Finds ANY of these phrases.

Why multiple? Councils use different terminology:
- Lancashire says "domiciliary care"
- Kent says "home care"
- Essex says "homecare" (one word)
- Surrey says "personal care"

Catch them all with OR.
```

---

#### **Using AND Logic (Implicit)**

**Spaces = AND (within phrase):**
```
Keywords: domiciliary care

Finds tenders containing BOTH words:
- "domiciliary care" (exact phrase) ✅
- "care domiciliary" (both words, different order) ✅
- "domiciliary" only ❌
- "care" only ❌
```

**Combining with OR:**
```
Keywords: (domiciliary care OR home care) AND elderly

Finds tenders containing:
- (domiciliary care OR home care) — at least one phrase
- AND "elderly" — must also contain this word

Example matches:
✅ "Domiciliary Care for Elderly Residents"
✅ "Home Care Services - Elderly Adults"
❌ "Domiciliary Care for Learning Disabilities" (no "elderly")
❌ "Elderly Day Services" (no home/domiciliary care)
```

**Use cases for AND:**
```
Narrow down to specific client groups:
- (domiciliary care) AND (elderly OR older adults)
- (supported living) AND (learning disabilities OR autism)
- (residential care) AND (dementia OR Alzheimer's)
```

---

#### **Advanced Keyword Patterns**

**Service + Client Group:**
```
Keywords: (domiciliary care OR home care) AND (elderly OR older 
adults OR seniors OR aged)

Why: Ensures tender is for your target demographic
Result: More relevant, fewer false positives
```

**Service + Geographic Specificity:**
```
Keywords: (domiciliary care OR home care) AND (Yorkshire OR Leeds)

Why: Catches tenders mentioning region in description, not just 
location field
Result: Higher accuracy in highly specific searches
```

**Multiple Services:**
```
Keywords: (domiciliary care OR home care) OR (supported living OR 
supported accommodation) OR (residential care OR care home)

Why: You provide multiple services, want to see all relevant 
tenders
Result: Comprehensive coverage of your service portfolio
```

**Exclusions (NOT logic - use carefully):**
```
TenderFlow doesn't support NOT natively, but you can work around:

Problem: Getting irrelevant "care" tenders (car care, lawn care)
Solution: Be more specific in keywords
Instead of: care
Use: domiciliary care OR social care OR care services

Problem: Getting children's tenders when you only do adults
Solution: Use AND filtering
Keywords: (domiciliary care) AND (adult OR elderly OR older)
```

---

### **Location Filtering Deep Dive**

#### **How Location Search Works**

**TenderFlow searches:**
```
- Tender location field (primary)
- Authority name (e.g., "Kent County Council")
- Tender description (if location mentioned)
- Postcode areas (if listed)
```

**Location matching is fuzzy:**
```
"Yorkshire" matches:
- "Yorkshire"
- "North Yorkshire"
- "South Yorkshire"
- "West Yorkshire"
- "York"
- "Yorkshire and Humber"

Useful for catching regional variations.
```

---

#### **Location Filter Strategies**

**Strategy 1: Regional (Broad Coverage)**
```
Location: Yorkshire OR Leeds OR Bradford OR Sheffield OR York 
OR Doncaster

Why: Covers region name + major cities
Result: Catches all Yorkshire tenders, regardless of how council 
phrases location
```

**Strategy 2: County (Medium Coverage)**
```
Location: Kent OR Surrey OR Sussex

Why: Covers specific counties you operate in
Result: More focused than regional, but still broad
```

**Strategy 3: City (Narrow Coverage)**
```
Location: Manchester OR M1 OR M2 OR M3 OR M4 OR Salford

Why: Very specific to Manchester area + postcodes + boroughs
Result: Highly relevant, but might miss nearby opportunities
```

**Strategy 4: Postcode (Very Narrow)**
```
Location: M1 OR M2 OR M3 OR M4 OR M5 OR M6 OR M7 OR M8

Why: Extremely specific to postcode areas
Result: Only tenders in exact postcodes (might miss some)
```

**Strategy 5: Nationwide (No Filter)**
```
Location: [leave empty]

Why: See ALL UK tenders, filter manually later
Result: Most volume, but also most noise
```

---

#### **Recommended Location Patterns**

**For small care providers (1-2 areas):**
```
Location: Kent OR Maidstone OR Ashford OR Canterbury OR ME1 OR 
ME2 OR CT1

Why: County + cities + postcodes = comprehensive local coverage
Result: Every Kent tender, nothing outside
```

**For medium care providers (3-5 areas):**
```
Location: Kent OR Surrey OR Sussex OR Hampshire

Why: Multiple counties, let TenderFlow sort by relevance
Result: All tenders in coverage areas
```

**For large care providers (regional/national):**
```
Location: South East OR Kent OR Surrey OR Sussex OR Hampshire OR 
Berkshire OR Oxfordshire

Why: Region + counties = complete regional coverage
Result: Every tender in South East England
```

**For national providers:**
```
Location: [empty] OR England OR Wales OR Scotland

Why: Full UK coverage
Result: Every UK tender (be prepared for high volume!)
```

---

### **Minimum Value Filtering**

#### **Why Filter by Value**

**Benefits of value filtering:**
```
✅ Skip tiny contracts not worth bidding
✅ Focus on contracts matching your capacity
✅ Reduce noise in Inbox
✅ Save time on irrelevant tenders
```

**Risks of value filtering:**
```
⚠️ Many tenders don't list value initially
⚠️ Set too high = miss opportunities
⚠️ Small contracts can lead to larger frameworks
```

---

#### **Value Filter Guidelines**

**For small care providers (10-30 staff):**
```
Minimum Value: £20,000 OR leave empty

Why:
- Can handle £20K-£200K contracts comfortably
- Values not always listed (don't want to miss unknowns)
- Small contracts build relationships for larger opportunities

Best approach: Leave empty initially, add filter if getting too 
many tiny contracts
```

---

**For medium care providers (30-100 staff):**
```
Minimum Value: £50,000

Why:
- Focus on contracts matching capacity
- Skip spot purchases and one-offs
- Still catches most relevant opportunities

Adjust up to £100K if getting too many small contracts.
```

---

**For large care providers (100+ staff):**
```
Minimum Value: £100,000

Why:
- Strategic contracts only
- Resource allocation (don't waste time on small bids)
- Focus on frameworks and multi-year contracts

Can go higher (£200K+) if truly only interested in major tenders.
```

---

**For framework specialists:**
```
Minimum Value: £500,000 OR £1,000,000

Why:
- Frameworks are usually high-value (£1M+)
- Skip individual call-offs
- Focus on strategic opportunities

Many frameworks don't list total value, so might still miss some.
```

---

#### **Value Filter Best Practices**

**Start with no minimum:**
```
Why: See full range of opportunities, understand what's available
Then: After 1-2 weeks, look at values of tenders in your Inbox
Finally: Set minimum to exclude bottom 25% (if they're irrelevant)
```

**Review quarterly:**
```
Every 3 months, review:
- What was minimum value of tenders you bid on?
- What was minimum value of tenders you won?
- Adjust filter to match reality
```

**Different minimums per connection:**
```
Find a Tender: £50,000 (larger contracts)
Contracts Finder: £20,000 (quick wins, lower threshold)
Proactis: £30,000 (varies by council)

This gives you coverage across all value ranges while focusing 
each connection appropriately.
```

---

## 9️⃣ **WHAT HAPPENS AFTER CONNECTION**

### **First Sync (Initial Backlog)**

**What to expect:**
```
Time taken: 1-3 minutes (longer than usual)
Results: 10-50 tenders (depends on filters)
Why so many? TenderFlow fetches tenders from last 30 days on 
first sync

Don't panic! Most will be old (already past deadline). This is 
completely normal.
```

**What you'll see in Inbox:**

**Example first sync results:**
```
┌─────────────────────────────────────────┐
│ 🌐 Find a Tender  ⚪ Low  📅 1 Mar     │
│ Domiciliary Care - Leeds (CLOSED)      │
│ Deadline passed 2 weeks ago            │
│ [Archive]                              │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 🌐 Find a Tender  🟡 Medium  📅 22 Mar │
│ Domiciliary Care - Bradford            │
│ Deadline in 2 days                     │
│ [View Tender]                          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 🌐 Find a Tender  🟠 High  📅 15 Apr   │
│ Supported Living - Sheffield           │
│ Deadline in 3 weeks                    │
│ [View Tender]                          │
└─────────────────────────────────────────┘

[... 15 more tenders ...]
```

**What to do:**
```
1. Sort by deadline (most recent first)
2. Archive all closed/past deadline tenders (quick cleanup)
3. Review active tenders (deadlines in future)
4. Focus on next 2 weeks (immediate opportunities)
5. Mark others as "Read" for later review

Time needed: 15-20 minutes to review and triage first batch
```

---

### **Ongoing Syncs (Steady State)**

**After first sync, what changes:**
```
Frequency: Every X hours (per your setting)
Results: 0-5 new tenders per sync (only NEW tenders since last sync)
Time taken: 10-30 seconds
Volume: Much more manageable
```

**Typical sync results:**

**Quiet day:**
```
Sync Time: 9:00 AM
Fetched: 0 new tenders
Created: 0 items
Status: ✅ Connected

Completely normal. Not every sync finds new tenders.
```

**Normal day:**
```
Sync Time: 3:00 PM
Fetched: 3 new tenders
Created: 2 items (1 duplicate)
Status: ✅ Connected

Check Inbox, see 2 new tenders published since 9:00 AM sync.
```

**Busy day:**
```
Sync Time: 9:00 AM
Fetched: 8 new tenders
Created: 7 items (1 duplicate)
Status: ✅ Connected

Mondays and Tuesdays often busier (councils publish over weekend).
```

---

### **Your Daily Workflow**

**Morning routine (5-10 minutes):**
```
1. Open TenderFlow Inbox
2. Filter by "Unread"
3. Scan for 🔴 Urgent or 🟠 High priority
4. Quick review:
   - Deadline within 2 weeks? → Open and assess
   - Good fit score (70%+)? → Open and assess
   - Rest → Mark as "Read" for later
5. Assign interesting tenders to team members
6. Set reminders for deadlines
```

**Weekly review (15-20 minutes, Friday afternoon):**
```
1. Open TenderFlow Inbox
2. Filter by "Action Required"
3. Complete or delegate all actions
4. Archive processed tenders
5. Review next week's deadlines
6. Check Sync History (all connections working?)
```

**Monthly review (30 minutes, first Monday of month):**
```
1. Check Sync History for all connections
2. Identify any recurring errors
3. Review filter effectiveness:
   - Too many irrelevant tenders? → Narrow filters
   - Missing opportunities? → Broaden filters
4. Adjust sync frequencies if needed
5. Review connection performance:
   - Which sources find most relevant tenders?
   - Which sources are noisy?
   - Adjust accordingly
```

---

### **Notifications and Alerts**

**What you'll receive:**

**Email notifications (configurable):**
```
Sent when:
- 🔴 Urgent priority tender found
- 🟠 High priority tender with deadline <1 week
- Tender matches your "favourite" keywords
- Clarification posted on tender you're tracking
```

**Mobile push notifications (if enabled):**
```
Sent when:
- 🔴 Urgent tender (deadline <48 hours)
- Tender score >90% fit
- Update to active bid
```

**In-app notifications:**
```
Badge on "Inbox" icon showing unread count
Real-time updates when new tenders arrive
```

**Configure notifications:**
```
1. Settings → Notifications
2. Choose:
   - Email: All / High Priority Only / Urgent Only / None
   - Push: All / Urgent Only / None
   - In-app: Always on
3. Save preferences
```

**Best practice:**
```
✅ Email: High Priority Only
✅ Push: Urgent Only
✅ In-app: On

This avoids notification fatigue while ensuring you never miss 
critical opportunities.
```

---

### **Automatic Deduplication**

**How TenderFlow prevents duplicates:**

**Method 1: External ID matching**
```
Every tender has unique ID from source (Find a Tender notice 
number, Contracts Finder ID, etc.)

If TenderFlow sees same ID again, it skips creating duplicate.
```

**Method 2: Content hashing**
```
TenderFlow creates "fingerprint" of each tender:
- Title
- Authority name
- Deadline
- Description excerpt

If fingerprint matches existing tender, skip duplicate.
```

**Example:**
```
Same tender published on:
- Find a Tender (ocid: ocds-123456)
- Contracts Finder (notice: CF-789012)
- Proactis portal (ref: KCC-2026-001)

TenderFlow:
1. First sees it on Find a Tender → Creates tender record
2. Later sees it on Contracts Finder → Detects duplicate by 
   content matching → Links to existing tender record (doesn't 
   create second record)
3. Later sees it on Proactis → Detects duplicate → Links to 
   existing tender record

Result: You see ONE tender record with THREE sources listed.
```

**Benefits:**
```
✅ No duplicate tenders cluttering your Inbox
✅ All information consolidated in one place
✅ See which sources published same tender
✅ Historical record of where tender appeared
```

---

## 🔟 **TROUBLESHOOTING FAILED CONNECTIONS**

### **Connection Status Types**

**✅ Connected (Green)**
```
Meaning: Everything working perfectly
Last Sync: Recent timestamp (within sync frequency)
Action: None needed - working as expected
```

**🔄 Syncing (Blue)**
```
Meaning: Currently fetching tenders
Last Sync: Timestamp of previous successful sync
Action: Wait 30-60 seconds for sync to complete
```

**⚠️ Warning (Yellow)**
```
Meaning: Minor issues, still partially working
Examples:
- Some tenders failed to process
- Slow API response
- Rate limit approaching
Action: Review warning message, investigate if persists
```

**❌ Error (Red)**
```
Meaning: Connection completely broken
Last Sync: Shows time of last successful sync (might be hours/days ago)
Action: Investigate immediately (see error-specific fixes below)
```

---

### **Common Errors and Fixes**

---

#### **Error 1: "API Key Invalid" (Proactis)**

**What you see:**
```
❌ Error
Connection failed: Invalid API key or token
Last successful sync: 2 days ago
```

**What this means:**
```
The API key you entered is wrong, expired, or revoked.
```

**How to fix:**

**Step 1: Verify API key**
```
1. Check email from council where they provided API key
2. Copy key exactly (including any "Bearer" prefix if present)
3. Go to TenderFlow → Integrations → Your connection → Edit
4. Paste key again carefully (no spaces, no extra characters)
5. Save and test with "Sync Now"
```

**Step 2: Contact council if still failing**
```
Email procurement officer:
---
Subject: API Key Not Working for Proactis Portal

Hi [Officer Name],

I'm trying to connect to your Proactis portal using the API 
key you provided: [first 10 characters]...

Getting error: "Invalid API key or token"

Could you:
1. Verify the API key is still active
2. Confirm I'm using correct format
3. Regenerate key if it expired

Thanks,
[Your Name]
---
```

**Step 3: Use Email Ingestion while waiting**
```
While waiting for council response, switch to Email Ingestion:
1. Delete broken Proactis connection
2. Set up Gmail Connection (see Gmail tutorial)
3. Forward Proactis portal emails to Gmail
4. TenderFlow processes them automatically
5. Once API key fixed, reconnect Proactis
```

---

#### **Error 2: "Rate Limit Exceeded"**

**What you see:**
```
❌ Error
Connection failed: Rate limit exceeded - too many requests
Retry at: 2:00 PM
```

**What this means:**
```
You've made too many API requests in short time. The API has 
temporarily blocked you.
```

**Why this happens:**
```
- Sync frequency too high (e.g., Every 1 hour on Proactis)
- Multiple connections to same portal
- Clicked "Sync Now" repeatedly
```

**How to fix:**

**Immediate (wait it out):**
```
1. Don't click "Sync Now" again (makes it worse!)
2. Wait until "Retry at" time passes
3. System will auto-retry
4. Connection should recover
```

**Permanent (prevent recurrence):**
```
1. Go to Integrations → Your connection → Edit
2. Reduce sync frequency:
   - From "Every 1 hour" → "Every 4 hours"
   - From "Every 2 hours" → "Every 6 hours"
3. Save
4. If you have multiple connections to same portal, consider 
   consolidating into one
```

**Prevention:**
```
- Don't set Proactis connections to "Every 1 hour"
- Don't manually sync more than once per hour
- If testing, wait 5 minutes between "Sync Now" clicks
```

---

#### **Error 3: "Connection Timeout"**

**What you see:**
```
❌ Error
Connection failed: Request timed out after 30 seconds
```

**What this means:**
```
TenderFlow tried to connect to API but got no response within 
30 seconds.
```

**Possible causes:**

**Cause 1: API temporarily down**
```
Check: Visit API website directly
- Find a Tender: findatender.service.gov.uk
- Contracts Finder: contractsfinder.service.gov.uk
- Proactis: [your council's portal URL]

If website won't load → API is down (not your problem)
If website loads fine → Continue to Cause 2
```

**Cause 2: Your internet down**
```
Check: Open google.com in browser
If can't load Google → Your internet is down
Fix: Check internet connection, try again when online
```

**Cause 3: Firewall blocking TenderFlow**
```
Check: Does it work from home but not office?
If yes → Office firewall likely blocking API connections

Fix: Contact IT team:
---
Hi IT Team,

TenderFlow AI needs to connect to these APIs:
- findatender.service.gov.uk
- contractsfinder.service.gov.uk
- *.proactiscloud.com
- api.openai.com (for AI features)

Please whitelist these domains in our firewall.

Thanks!
---
```

**Cause 4: API genuinely slow**
```
Sometimes APIs are just slow (council servers overloaded).

Fix: Wait 10 minutes, try "Sync Now" again
Usually: Temporary issue, resolves on its own
```

---

#### **Error 4: "No Results Found" (Not an error, but confusing)**

**What you see:**
```
✅ Connected
Last Sync: Just now
Fetched: 0 tenders
Created: 0 items
```

**What this means:**
```
Connection works perfectly, but no tenders matched your filters 
since last sync.
```

**Why this happens:**
```
- Your filters are too narrow (e.g., "Manchester AND dementia" 
  is very specific)
- No new tenders published in your area recently
- All tenders published were duplicates (already in system)
- This is completely normal! Not every sync finds new tenders
```

**What to do:**
```
Nothing! This is expected behaviour.

Only investigate if:
- 5+ consecutive syncs find 0 tenders (unusual)
- Other providers are seeing tenders you're missing
- You know for certain tenders were published
```

**If genuinely concerned:**
```
Test your filters:
1. Go to findatender.service.gov.uk manually
2. Search using your keywords and location
3. Do you see relevant tenders?
   - If yes → Your filters might be too narrow in TenderFlow
   - If no → Your filters are correct, just no tenders right now
```

---

#### **Error 5: "Authentication Failed" (Proactis)**

**What you see:**
```
❌ Error
Authentication failed: Invalid username or password
```

**What this means:**
```
Account ID/username you entered doesn't match what Proactis 
expects.
```

**How to fix:**

**Step 1: Check account ID format**
```
Proactis uses different formats:
- Email: your.email@company.com
- Username: CompanyName_User1
- Supplier ID: SUP12345

Ask council: "What format should I use for Account ID when 
connecting via API?"
```

**Step 2: Try different formats**
```
1. Edit connection
2. Try your Proactis login email
3. Save and test → Still failing?
4. Try your Proactis username
5. Save and test → Still failing?
6. Leave Account ID empty (some Proactis portals don't require it)
7. Save and test
```

**Step 3: Contact council**
```
If all formats fail:
---
Subject: Account ID Format for API Connection

Hi [Officer Name],

I'm connecting to your Proactis portal via TenderFlow AI and 
need clarification on Account ID format.

I've tried:
- my.email@company.com
- CompanyUser
- [empty]

All failing with "Authentication failed"

What format should I use for API authentication?

Thanks!
---
```

---

#### **Error 6: "Service Unavailable"**

**What you see:**
```
❌ Error
Connection failed: Service unavailable (503)
```

**What this means:**
```
The API is temporarily offline or undergoing maintenance.
```

**How to fix:**
```
You can't fix this - it's on the API provider's end.

What to do:
1. Check API status page:
   - Find a Tender: No official status page (check gov.uk news)
   - Contracts Finder: No official status page
   - Proactis: Contact council IT

2. Wait 30 minutes

3. Try "Sync Now" again

4. If still failing after 2 hours, contact TenderFlow support 
   (we can check if widespread issue)
```

**Prevention:**
```
None - this is rare and outside your control. Usually resolves 
within an hour.
```

---

## 1️⃣1️⃣ **WHEN TO USE EMAIL INGESTION INSTEAD**

Email Ingestion (via Gmail Connection) is often better than 
direct API connections. Here's when to use each.

---

### **Use Direct API Connection When:**

✅ **Council provides API credentials easily**
```
If council gives you API key without hassle, use direct connection.
Benefit: Faster, real-time, more reliable
```

✅ **You bid on this council frequently**
```
If you bid on 10+ tenders per year from this council, direct 
connection is worth setup effort.
Benefit: See tenders the moment they publish
```

✅ **Council uses Proactis and you want automatic document download**
```
Some Proactis APIs let TenderFlow download tender documents 
automatically (no manual downloading).
Benefit: Saves time, all docs in one place
```

✅ **You need real-time updates**
```
If council publishes urgent same-day tenders, direct connection 
catches them immediately.
Benefit: Beat competitors
```

---

### **Use Email Ingestion Instead When:**

✅ **Council won't provide API credentials**
```
Many councils don't offer API access to suppliers.
Reality: 70% of care providers end up using email ingestion
```

✅ **API setup is taking too long**
```
If council says "We'll get back to you in 2 weeks", use email 
ingestion immediately. Can always switch to API later.
```

✅ **You're short on time**
```
Email ingestion takes 5 minutes to set up. API connection can 
take days (waiting for council).
```

✅ **Connection keeps failing**
```
If API connection errors repeatedly despite troubleshooting, 
email ingestion is more reliable fallback.
```

✅ **You receive tender emails anyway**
```
If council already emails you alerts, why not leverage those 
emails? Email ingestion processes them automatically.
```

✅ **Council uses non-Proactis portal without API**
```
Many councils use custom portals with no API. Email ingestion 
is only automated option.
```

---

### **Email Ingestion Advantages**

**Simplicity:**
```
Setup: 5 minutes (vs 2 days for API credentials)
Maintenance: Zero (vs troubleshooting API errors)
Dependencies: None (vs API key expiry, rate limits)
```

**Reliability:**
```
Email rarely fails. APIs fail regularly.
Email has no rate limits. APIs do.
Email works 24/7. APIs have downtime.
```

**Completeness:**
```
Councils send comprehensive emails with:
- Tender title
- Deadline
- Link to full tender
- Contact details

API responses sometimes have missing fields.
```

**Universality:**
```
Works with ANY council (as long as they send emails)
Works with ANY portal (Proactis, Atamis, custom)
Works with Find a Tender (they send email alerts too)
```

---

### **Email Ingestion Disadvantages**

**Speed:**
```
Direct API: Real-time (see tender immediately)
Email: Delayed (wait for email alert to arrive, then 2 hours 
for Gmail sync)

Typical delay: 1-4 hours from publication to seeing in TenderFlow
```

**Dependency:**
```
Relies on council actually sending email alerts.
If council doesn't send email or sends late, you're delayed.
```

**Email content quality:**
```
Some councils send useless emails:
- "A new tender has been published" (no details)
- Must click link to see anything
- TenderFlow extracts what it can, but sometimes limited
```

**No automatic document download:**
```
Email ingestion can't download tender documents automatically.
You must click link and download manually.
```

---

### **Our Recommendation (Best Practice)**

**For most care providers:**
```
Start with Email Ingestion for all councils.

Why:
- Quick setup (done in 5 minutes)
- Works everywhere (100% coverage)
- Reliable (email rarely fails)
- Good enough (1-4 hour delay is fine for most tenders)

Then:
- After 3 months, review which councils you bid on most
- For your top 3-5 councils, request API credentials
- If they provide them easily, switch to direct API
- If they don't or take too long, stick with email
```

**This gives you:**
```
✅ Immediate coverage (email ingestion for all councils)
✅ Plus real-time for important councils (API for top 3-5)
✅ Best of both worlds
```

---

### **How to Switch from Email to API (or Vice Versa)**

**Switching to API from Email:**
```
1. Get API credentials from council
2. Create new Proactis connection in TenderFlow
3. Test with "Sync Now"
4. Once working, check: Does API find same tenders as emails?
5. If yes → You can stop forwarding emails from that council
6. If no → Keep both (belt and braces)
```

**Switching to Email from API:**
```
1. Set up Gmail Connection (if not already)
2. Forward portal emails to Gmail
3. Test: Wait for next email, check if TenderFlow processes it
4. Once working, delete broken API connection
5. Email ingestion takes over
```

**Running Both Simultaneously:**
```
You can run both API and email ingestion for same council.

TenderFlow automatically deduplicates:
- Same tender from API + same tender from email = One record 
  in TenderFlow
- Sources listed: "Proactis API + Gmail"
- Best of both worlds: Speed (API) + reliability (email backup)
```

---

## 1️⃣2️⃣ **BEST PRACTICE TIPS**

### **Tip 1: Start with Three Core Connections**

**The essential trio:**
```
1. Find a Tender (main source)
2. Contracts Finder (quick wins)
3. Gmail (backup + supplementary)

These three cover 95% of UK public sector opportunities.
```

**Setup time: 30 minutes total**
```
- Find a Tender: 10 minutes
- Contracts Finder: 10 minutes
- Gmail: 10 minutes (see Gmail tutorial)

After this, you're done. Everything flows automatically.
```

**Then expand:**
```
After 2-3 weeks, add Proactis connections for your most important 
councils (if they provide API credentials).
```

---

### **Tip 2: Use Descriptive Connection Names**

**Good naming convention:**
```
[Source Type] - [Service/Purpose] - [Geographic Scope]

Examples:
✅ "Find a Tender - Domiciliary Care - Yorkshire"
✅ "Contracts Finder - Quick Wins - South East"
✅ "Proactis - Kent County Council"
✅ "Gmail - Urgent Framework Alerts"
```

**Why this matters:**
```
In your Inbox, each tender shows source connection.

Clear names help you:
- Know where tender came from
- Identify which filters found it
- Troubleshoot connection issues
- Track which sources are most valuable
```

---

### **Tip 3: Review Connection Performance Monthly**

**What to check (15 minutes per month):**

**Step 1: Sync History**
```
For each connection:
1. Go to Integrations → Connection → View Sync History
2. Check success rate:
   - 90%+ successful syncs = Excellent
   - 80-90% = Acceptable
   - <80% = Investigate errors
3. Note any recurring errors
4. Fix or adjust as needed
```

**Step 2: Relevance Rate**
```
For each connection:
1. Look at last 20 tenders it found
2. How many were relevant (you'd actually bid)?
   - 15+ out of 20 (75%+) = Excellent
   - 10-15 out of 20 (50-75%) = Good
   - <10 out of 20 (<50%) = Adjust filters
3. If too much noise, narrow filters
4. If missing opportunities, broaden filters
```

**Step 3: Value Analysis**
```
1. Which connection found most high-value tenders?
2. Which found most bid-worthy opportunities?
3. Which found most noise (irrelevant tenders)?
4. Prioritise best performers:
   - Increase sync frequency for best
   - Decrease frequency for noisy ones
   - Consider removing worst performers
```

---

### **Tip 4: Layer Your Coverage**

**Don't rely on single source:**
```
Good: Find a Tender only
Better: Find a Tender + Contracts Finder
Best: Find a Tender + Contracts Finder + Gmail + Proactis (top 
councils)
```

**Why layer:**
```
- Some tenders only appear on one source
- API might fail (email backup catches it)
- Different sources publish at different times
- Comprehensive coverage ensures nothing missed
```

**Example layered setup:**
```
Layer 1 (Foundation):
- Find a Tender - Main Tenders - Yorkshire
- Contracts Finder - Quick Wins - Yorkshire

Layer 2 (Backup):
- Gmail - All Tender Alerts
  (Catches anything missed by APIs)

Layer 3 (Priority Councils):
- Proactis - Kent County Council
- Proactis - Essex County Council
  (Only for councils you bid on frequently)

Result: 99.9% coverage, nothing slips through
```

---

### **Tip 5: Adjust Filters Based on Win Rate**

**After 6 months, analyse:**
```
1. How many tenders did each connection find? (Volume)
2. How many did you bid on? (Relevance)
3. How many did you win? (Success)
```

**Example analysis:**

**Connection: Find a Tender - Domiciliary Care - Yorkshire**
```
Found: 120 tenders
Bid on: 15 tenders (12.5% of total)
Won: 5 bids (33% win rate)

Analysis: Good relevance (only bid on most suitable), excellent 
win rate
Action: Keep filters as-is
```

**Connection: Contracts Finder - Quick Wins - Yorkshire**
```
Found: 80 tenders
Bid on: 40 tenders (50% of total)
Won: 15 bids (37.5% win rate)

Analysis: Very high relevance and win rate (sweet spot!)
Action: Keep filters, possibly expand geographic scope to find 
more similar opportunities
```

**Connection: Gmail - All Tender Alerts**
```
Found: 200 tenders
Bid on: 10 tenders (5% of total)
Won: 2 bids (20% win rate)

Analysis: Lots of noise (95% irrelevant), but caught 2 winners 
that other connections missed
Action: Keep running as backup layer despite noise
```

**Use insights to refine:**
```
- Winning lots from Contracts Finder? → Expand CF geographic scope
- Winning nothing from certain councils? → Stop monitoring them
- Missing opportunities? → Broaden keywords
- Too much noise? → Narrow location or add minimum value filter
```

---

### **Tip 6: Set Up Different Connections for Different Strategies**

**Strategy 1: Geographic Focus**
```
Connection 1: Find a Tender - Home Territory (Your main area)
- Keywords: All your services
- Location: Your primary coverage area
- Min Value: £50,000
- Frequency: Every 6 hours
- Priority: High (check daily)

Connection 2: Find a Tender - Expansion Territory (Growth areas)
- Keywords: All your services
- Location: Adjacent counties
- Min Value: £100,000 (only pursue larger contracts in new areas)
- Frequency: Every 12 hours
- Priority: Medium (check weekly)
```

**Strategy 2: Service Focus**
```
Connection 1: Domiciliary Care (Core service)
- Keywords: domiciliary care OR home care
- Location: Your full coverage area
- Min Value: £30,000
- Frequency: Every 6 hours

Connection 2: Supported Living (Growth service)
- Keywords: supported living OR supported accommodation
- Location: Your full coverage area
- Min Value: £100,000 (strategic opportunities only)
- Frequency: Every 12 hours
```

**Strategy 3: Urgency Focus**
```
Connection 1: Standard Opportunities
- Keywords: All services
- Location: Your area
- Min Value: £50,000
- Frequency: Every 6 hours

Connection 2: Urgent Frameworks
- Keywords: framework OR DPS OR dynamic purchasing
- Location: National
- Min Value: £500,000
- Frequency: Every 4 hours (faster for urgent opportunities)
```

---

### **Tip 7: Document Your Setup for Team Handover**

**Create a simple document:**
```
Title: TenderFlow API Connections Guide
Location: Shared drive / TenderFlow Documents section
```

**Include:**
```
1. Connection List
   - Connection name
   - Source type
   - Keywords
   - Location
   - Min value
   - Sync frequency
   - Purpose/strategy
   - Owner (who manages this connection)

2. Performance Notes
   - Which connections find best opportunities
   - Which are noisy
   - Historical win rates per connection

3. Troubleshooting Quick Reference
   - Common errors and fixes
   - Council contact details (for API issues)
   - TenderFlow support contact

4. Review Schedule
   - Monthly: Check sync history (15 mins)
   - Quarterly: Analyse relevance and adjust filters (30 mins)
   - Annually: Full performance review (1 hour)
```

**Why document:**
```
- Holiday cover (someone can manage while you're away)
- New team members (quick onboarding)
- Troubleshooting (faster fixes with history)
- Continuous improvement (track changes and impact)
```

---

### **Tip 8: Use Sync History to Spot Patterns**

**Check sync history weekly:**
```
Pattern 1: Consistent daily activity
Example: 
- Monday-Friday: 2-5 new tenders per day
- Saturday-Sunday: 0-1 new tenders per day

Meaning: Normal healthy connection
Action: None needed
```

**Pattern 2: Weekly spikes**
```
Example:
- Monday: 10-15 new tenders
- Tuesday-Sunday: 2-3 per day

Meaning: Councils publish over weekend, tenders appear Monday
Action: Consider increasing Monday morning sync frequency (Every 
4 hours on Mondays)
```

**Pattern 3: Sudden drop-off**
```
Example:
- Week 1-4: 5-8 tenders per sync
- Week 5-8: 0-1 tender per sync

Meaning: Something changed (API broken, filters too narrow, or 
genuinely fewer tenders publishing)
Action: Investigate (see Troubleshooting section)
```

**Pattern 4: Increasing errors**
```
Example:
- Week 1-2: 100% success rate
- Week 3-4: 80% success rate  
- Week 5-6: 50% success rate

Meaning: Connection degrading (API key expiring, rate limits, 
or API instability)
Action: Investigate errors, contact council if Proactis, or 
switch to email ingestion
```

---

### **Tip 9: Test Filters Before Full Deployment**

**Before going live:**
```
1. Set up connection with your filters
2. Click "Sync Now"
3. Wait for results
4. Review first 20 tenders:
   - How many are relevant (you'd actually bid)?
   - How many are total noise?
5. Adjust filters based on results
6. Re-test with "Sync Now"
7. Repeat until 70%+ relevance rate
8. Then enable automatic syncing
```

**Don't:**
```
❌ Set up connection and walk away
❌ Hope filters work without testing
❌ Check results days later and discover irrelevant flood

Do:
✅ Test immediately
✅ Refine filters before enabling automatic syncing
✅ Start narrow, expand gradually
```

---

### **Tip 10: Leverage Community Intelligence**

**Join care provider networks:**
```
Many care provider associations share intel:
- Which councils are tendering frequently
- Which portals are reliable
- Which APIs work well
- Common issues and workarounds
```

**Share experiences:**
```
If you figure out great filter combinations or solve tricky 
Proactis connection issues, share with peers. They'll return 
the favour.
```

**TenderFlow user community:**
```
Join TenderFlow's user forum (coming soon):
- Share filter strategies
- Get help from other users
- Learn advanced techniques
- Suggest new features
```

---

## 1️⃣3️⃣ **COMPLETE EXAMPLE WORKFLOW**

Let's walk through complete realistic scenario from initial 
setup to steady-state operation.

---

### **Meet Sarah - Bids Manager at Yorkshire Care Services**

**Background:**
```
Organisation: Yorkshire Care Services Ltd
Services: Domiciliary care, supported living
Coverage: Yorkshire (Leeds, Bradford, Sheffield, York)
Team: Sarah (Bids Manager), 2 bid writers
Current process: Manual checking of Find a Tender 3x per week
Pain points: Missing urgent tenders, wasting time on duplicates
Goal: Automate tender monitoring, catch every opportunity
```

---

### **Week 1: Initial Setup (Monday Morning, 45 Minutes)**

#### **9:00 AM - Find a Tender Connection**

**Sarah's approach:**
```
"I'll start with Find a Tender - that's where most of our 
tenders come from."
```

**Setup:**
```
1. Logs into TenderFlow
2. Integrations → Add Connection → PUBLIC_API
3. Source Type: find_a_tender
4. Connection Name: "Find a Tender - Care Services Yorkshire"
5. Keywords: domiciliary care OR home care OR supported living OR 
   supported accommodation
6. Location: Yorkshire OR Leeds OR Bradford OR Sheffield OR York 
   OR Doncaster
7. Minimum Value: £50,000
8. Sync Frequency: Every 6 hours
9. Clicks "Create Connection"
10. Clicks "Sync Now" to test
```

**Results:**
```
✅ Connected
Fetched: 23 tenders
Created: 18 new records (5 duplicates)
```

**Sarah's review:**
```
"23 tenders in last 30 days - that's about right for Yorkshire. 
Let me check the Inbox..."

Opens Inbox:
- 12 tenders already past deadline (normal for first sync)
- 6 tenders with upcoming deadlines (2-4 weeks away)
- All look relevant! Good filters.

Action: Archive the 12 closed tenders, mark 6 upcoming for review.
Time taken: 10 minutes to review and triage.
```

---

#### **9:15 AM - Contracts Finder Connection**

**Sarah's approach:**
```
"Now Contracts Finder for quick wins. Same keywords and location, 
but lower minimum value since these are smaller contracts."
```

**Setup:**
```
1. Add Connection → PUBLIC_API
2. Source Type: contracts_finder
3. Connection Name: "Contracts Finder - Quick Wins Yorkshire"
4. Keywords: domiciliary care OR home care OR supported living OR 
   supported accommodation
5. Location: Yorkshire OR Leeds OR Bradford OR Sheffield OR York
6. Minimum Value: £20,000 (lower for quick wins)
7. Sync Frequency: Every 6 hours
8. Create and test
```

**Results:**
```
✅ Connected
Fetched: 12 tenders
Created: 10 new records (2 duplicates with Find a Tender)
```

**Sarah's review:**
```
"12 tenders, mostly £20K-£80K range. Perfect for quick wins. 
Only 2 duplicates with Find a Tender - TenderFlow caught them 
automatically!"

Action: Quick scan, mark 3 interesting ones for team review.
Time taken: 5 minutes.
```

---

#### **9:25 AM - Gmail Connection (Backup Layer)**

**Sarah's approach:**
```
"I already receive tender alerts by email. Let me connect Gmail 
so TenderFlow processes them automatically. Good backup in case 
APIs miss anything."
```

**Setup:**
```
1. Add Connection → EMAIL
2. Clicks "Connect with Google"
3. Signs in to tenderalerts@yorkshirecare.com
4. Grants permissions
5. Names connection: "Gmail - All Tender Alerts"
6. Sync frequency: Every 2 hours (faster than APIs for email backup)
7. Create and test
```

**Results:**
```
✅ Connected
Fetched: 8 emails
Created: 2 new records (6 duplicates with Find a Tender and 
Contracts Finder)

"Perfect! Gmail found same tenders as APIs, plus 2 that APIs 
hadn't picked up yet. Good backup layer!"
```

---

#### **9:35 AM - Proactis (Leeds Council)**

**Sarah's approach:**
```
"We bid on Leeds Council frequently. Let me see if they'll give 
API access..."

[Emails Leeds procurement officer]

10 minutes later:
"Sorry, we don't provide API access to suppliers."

"No problem, my Gmail connection will catch Leeds emails anyway. 
Email ingestion it is!"
```

---

**Total setup time: 45 minutes**
```
Find a Tender: 15 mins (including first sync review)
Contracts Finder: 10 mins
Gmail: 10 mins
Leeds investigation: 10 mins

Result: 3 working connections, full Yorkshire coverage
```

---

### **Week 1: Steady State (Tuesday Onwards)**

#### **Daily Routine (Tuesday Morning, 5 Minutes)**

**9:00 AM - Sarah's morning check:**
```
1. Opens TenderFlow Inbox
2. Filters by "Unread" → 4 new tenders since yesterday
3. Quick scan:
   - Tender 1: Leeds domiciliary care, £300K, deadline 3 weeks 
     → High priority, assign to bid writer
   - Tender 2: Bradford supported living, £150K, deadline 4 weeks 
     → Medium priority, review later this week
   - Tender 3: Sheffield home care, £40K, deadline 2 days 
     → Too urgent, skip (can't prepare quality bid in 2 days)
   - Tender 4: York care home (not our service) → Archive
4. Marks all as read
5. Moves on with day

Time taken: 5 minutes
```

**What changed from old process:**
```
Before: 45 minutes checking Find a Tender, Contracts Finder, 
emails manually
After: 5 minutes checking TenderFlow Inbox

Time saved: 40 minutes per day = 3.5 hours per week
```

---

#### **Weekly Review (Friday Afternoon, 15 Minutes)**

**4:00 PM - Sarah's weekly wrap-up:**
```
1. Opens Inbox → Filter by "Action Required"
2. Reviews:
   - 3 tenders with deadlines next week → Delegate tasks to team
   - 1 clarification response needed → Assign to subject matter 
     expert
   - 2 tenders to decide Bid/No-Bid → Schedule decision meeting
3. Archives all completed tenders from this week
4. Quick check of sync history:
   - All connections showing "Connected" ✅
   - No errors this week
   - Find a Tender: 15 new tenders found
   - Contracts Finder: 6 new tenders found
   - Gmail: 8 new tenders found (2 unique, 6 duplicates)
5. Plans for next week

Time taken: 15 minutes
```

---

### **Week 4: Monthly Review (30 Minutes)**

**Sarah's monthly analysis:**

#### **Connection Performance:**

**Find a Tender:**
```
Syncs: 120 (4 per day × 30 days)
Success rate: 100%
Tenders found: 45
Bid on: 8 (18% relevance)
Won: 2 (25% win rate on bids)

Analysis: Excellent source, good relevance, keep as-is
```

**Contracts Finder:**
```
Syncs: 120
Success rate: 100%
Tenders found: 24
Bid on: 12 (50% relevance!)
Won: 5 (42% win rate!)

Analysis: Amazing source! High relevance, high win rate. This is 
our sweet spot.
Action: Expand geographic scope to find more similar opportunities
```

**Gmail:**
```
Syncs: 360 (12 per day × 30 days)
Success rate: 100%
Tenders found: 60
Unique (not duplicates): 8
Bid on unique: 2
Won: 1

Analysis: Mostly duplicates (good - confirms APIs working), but 
caught 8 tenders APIs missed. Worth keeping as backup.
```

---

#### **Filter Refinement:**

**Sarah's decisions:**
```
1. Contracts Finder performing amazingly well
   Action: Create second Contracts Finder connection for adjacent 
   counties (Lancashire, Cumbria) to find more quick wins

2. Find a Tender getting some noise (care home tenders when we 
   only do domiciliary and supported living)
   Action: Narrow keywords to exclude "care home OR residential care"

3. All connections working reliably
   Action: No changes needed to sync frequencies

4. No Proactis connections due to councils not providing API access
   Action: Continue with email ingestion (working well)
```

---

### **Week 8: Expansion (Adding Contracts Finder - Lancashire)**

**Sarah's approach:**
```
"Contracts Finder Yorkshire is finding great opportunities. Let's 
expand to Lancashire - adjacent county, we can deliver there too."
```

**Setup:**
```
1. Add Connection → PUBLIC_API
2. Source Type: contracts_finder
3. Connection Name: "Contracts Finder - Quick Wins Lancashire"
4. Keywords: [same as Yorkshire connection]
5. Location: Lancashire OR Manchester OR Preston OR Bolton OR 
   Blackpool
6. Minimum Value: £20,000
7. Sync Frequency: Every 6 hours
8. Create and test
```

**First sync results:**
```
Fetched: 8 tenders
Created: 7 new records (1 duplicate)

Sarah's review:
"7 Lancashire tenders in last 30 days. Smaller volume than 
Yorkshire, but we can handle. Let's see how many are worth bidding."

Action: Review over next 2 weeks, assess quality
```

---

### **Week 12: Quarterly Review (1 Hour)**

**Sarah's comprehensive analysis:**

#### **Overall Performance (3 Months):**

**Tenders Found:**
```
Find a Tender: 135 tenders
Contracts Finder Yorkshire: 72 tenders
Contracts Finder Lancashire: 28 tenders
Gmail: 180 tenders (24 unique, 156 duplicates)
Total: 259 unique tender opportunities

Compared to manual process (checking 3x per week):
Estimated tenders would have found manually: ~150
Tenders TenderFlow found that manual would have missed: ~109

Result: TenderFlow increased our tender pipeline by 70%!
```

---

**Bids Submitted:**
```
Q1 (before TenderFlow): 8 bids
Q1 (with TenderFlow): 15 bids

Increase: 87% more bids submitted

Why? More opportunities found + time saved on searching = more 
time for bid writing
```

---

**Bids Won:**
```
Q1 (before TenderFlow): 2 wins, £600K total value
Q1 (with TenderFlow): 5 wins, £1.4M total value

Increase: 150% more wins, 133% more contract value

Why? More bids submitted + better quality bids (more time to write)
```

---

**Time Savings:**
```
Before TenderFlow:
- 45 mins per day checking portals manually
- 5 hours per week
- 65 hours per quarter

After TenderFlow:
- 5 mins per day checking Inbox
- 0.5 hours per week
- 6.5 hours per quarter

Time saved: 58.5 hours per quarter

What Sarah did with saved time:
- Improved bid quality (more time to write)
- Researched new frameworks
- Built better relationships with councils
- Trained team on bid writing best practices
```

---

**ROI Calculation:**
```
TenderFlow cost per year: £2,400 (example pricing)
Additional contracts won (Q1): £800,000 per year
Gross margin (10%): £80,000
ROI: £80,000 / £2,400 = 33x return on investment

Plus intangible benefits:
- Reduced stress (no panic about missing deadlines)
- Better work-life balance (no evening email checking)
- Team morale improved (more time for quality work)
```

---

**Sarah's reflection:**
```
"Before TenderFlow, I spent hours every week manually searching 
for tenders, copying details into spreadsheets, and worrying 
about what I might be missing.

Now, I spend 5 minutes per day reviewing a smart, AI-curated 
Inbox. TenderFlow finds opportunities I never would have seen, 
deduplicates automatically, and gives me hours back every week 
to focus on actually winning bids.

We've doubled our bid volume, more than doubled our win rate, 
and our contract value is up 133%. TenderFlow paid for itself 
in the first month and continues delivering massive value.

Best procurement decision we've ever made."
```

---

## 📞 **NEED HELP?**

**Support Contact:**
```
Email: support@tenderflow.ai
Phone: 0800 TENDERFLOW (during business hours)
Live Chat: app.tenderflow.ai (bottom right corner)
```

**Response Times:**
```
Urgent issues (connection broken): Within 2 hours
General questions: Within 24 hours
Feature requests: Logged and reviewed monthly
```

**Related Tutorials:**
```
- Gmail Connection Setup
- Tender Inbox Management
- AI Tender Analysis
- Document Generator
```

---

**Last Updated:** March 2026  
**Tutorial Version:** 1.0  
**Tested On:** TenderFlow AI v2.0

---

**We hope this guide helps you connect to UK procurement APIs 
successfully and win more tenders!** 🎉