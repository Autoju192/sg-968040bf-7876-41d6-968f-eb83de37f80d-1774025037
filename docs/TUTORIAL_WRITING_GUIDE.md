# Tutorial Writing Guide for TenderFlow AI

## Purpose

This guide helps you write clear, helpful tutorials that non-technical UK care providers can follow successfully.

---

## The Golden Rule

**If a care provider's office manager (with basic computer skills) can follow your tutorial without help, you've written it well.**

---

## Writing Principles

### 1. Assume Low Technical Confidence

Your readers:
- ✅ Can use email, Word, and basic websites
- ✅ Understand their care business deeply
- ❌ Don't know technical terms (API, OAuth, JSON, etc.)
- ❌ Haven't used SaaS tools beyond email
- ❌ Get frustrated when things don't work first time

### 2. Write Like You're Talking

**Good**: "Click the green button in the top right corner"  
**Bad**: "Navigate to the primary action control located in the upper-right quadrant of the interface"

**Good**: "TenderFlow checks your emails every 2 hours"  
**Bad**: "The system polls the IMAP endpoint at configurable intervals defaulting to 120 minutes"

### 3. Explain Why, Not Just How

Users follow instructions better when they understand the purpose.

**Good**: "Grant TenderFlow permission to read your emails. This lets us find tender alerts automatically, saving you hours of manual copying."  
**Bad**: "Click Allow to grant OAuth permissions."

### 4. Use UK English

- Organisation (not organization)
- Colour (not color)
- Centre (not center)
- Realise (not realize)
- Programme (not program)
- Analyse (not analyze)

### 5. Show, Don't Tell

Use specific examples instead of abstract descriptions.

**Good**: "You'll see a green button saying 'Connect Gmail'"  
**Bad**: "A connection interface will be presented"

**Good**: "For example: manchester@yorkshirecare.com"  
**Bad**: "Enter your email address"

---

## Structure Guidelines

### Section 1: What This Feature Does (50-75 words)

**Template**:
```
[Feature name] does [primary function]. Instead of [old manual way], 
it [automated way], which [benefit - time saved, fewer errors, etc.].
```

**Example**:
"The Gmail Connection automatically reads your tender alert emails and adds them to TenderFlow. Instead of manually copying tender details from every email, the system does it for you - saving hours each week and ensuring you never miss an opportunity."

**Tips**:
- Lead with the outcome, not the technology
- Compare to manual alternative
- Include a tangible benefit (time, accuracy, stress)

---

### Section 2: Why It Matters (75-100 words)

**Template**:
```
Without [feature], you'd need to:
- [Pain point 1]
- [Pain point 2]
- [Pain point 3]

With [feature], [positive outcome]. It's like [relatable analogy].
```

**Example**:
"Most councils send tender alerts by email. Without Gmail Connection, you'd need to read every email manually, copy details into TenderFlow, and remember to check your inbox regularly. With Gmail Connection, tender emails flow automatically into your Inbox, already summarised by AI. It's like having a virtual assistant sorting your emails 24/7."

**Tips**:
- Paint the "before" picture (pain)
- Show the "after" picture (relief)
- Use analogies to familiar situations

---

### Section 3: Prerequisites (3-5 items)

**Template**:
```
Before [starting/connecting/setting up], make sure you have:

- **[Requirement 1]** with [specific detail]
- **[Requirement 2]** where [context]
- **[Requirement 3]** to [purpose]
```

**Example**:
"Before connecting Gmail, make sure you have:
- **A Gmail account** where you receive tender alerts
- **Admin access** to your TenderFlow account
- **15 minutes** to complete the setup"

**Tips**:
- Be specific about versions, access levels, time needed
- Explain why each prerequisite matters
- Include "nice to have" vs "must have" items

---

### Section 4: Step-by-Step Setup (5-8 steps)

**Template for each step**:
```
### Step [N]: [Action verb + object]

1. [First instruction]
2. [Second instruction]
3. [What you should see]

**What you should see**: [Describe the result]
**Screenshot**: [filename.png] (if available)
```

**Example**:
```
### Step 1: Navigate to Integrations

1. Log into TenderFlow AI
2. Click "Integrations" in the left sidebar
3. Look for the plug icon (🔌)

**What you should see**: A page showing cards for Gmail, 
Find a Tender, and other connection options.
```

**Tips**:
- Use action verbs: Click, Type, Choose, Select
- Number every instruction
- Describe what success looks like
- Include UI element locations ("top right", "left sidebar")
- Reference icons and colours
- Never assume they'll find something obvious

---

### Section 5: Day-to-Day Usage

**Template**:
```
Once [feature] is set up, it runs [automatically/manually]. 
Here's your typical workflow:

### Daily ([time estimate])
1. **[Task 1]**
   - [Specific action]
   - [What to check]
   
### Weekly ([time estimate])
1. **[Task 1]**
   - [Specific action]

### When [event happens]
1. **[Immediate response]**
   - [Step-by-step]
```

**Example**:
```
Once Gmail Connection is set up, it runs automatically.

### Daily (5 minutes)
1. **Check your Inbox** in TenderFlow
2. New tender emails appear every 2 hours
3. Click "View Tender" to see details
4. Mark as "Read" once dealt with

### When urgent email arrives
1. Go to Integrations
2. Click "Sync Now" for immediate processing
```

**Tips**:
- Separate by frequency (daily/weekly/monthly)
- Include time estimates
- Show real workflow, not feature list
- Mention automation vs manual tasks

---

### Section 6: What Happens After Setup

**Template**:
```
Once [feature] is working:

### [Process name]
- [What happens automatically]
- [Timing/frequency]
- [Result]

### In [location/screen]
[What user sees]:
- **[Element 1]**: [Description]
- **[Element 2]**: [Description]
```

**Example**:
"Once Gmail Connection is working:

### Automatic Processing
- Every 2 hours, TenderFlow checks your Gmail
- Finds tender-related emails
- Uses AI to extract details
- Adds to your Inbox

### In Your Inbox
Each tender email becomes an item showing:
- **Summary**: What the tender is about
- **Priority**: Low, Medium, High, Urgent
- **Action**: What you need to do next"

**Tips**:
- Describe automated behaviour
- Show user perspective, not system internals
- Explain timing and triggers

---

### Section 7: Common Mistakes (3-5 items)

**Template**:
```
### ❌ Mistake: [What they do wrong]
**Problem**: [Why it's a problem]
**Instead**: [Correct approach]
```

**Example**:
```
### ❌ Mistake: Connecting personal Gmail instead of work Gmail
**Problem**: Personal Gmail doesn't receive tender alerts, so nothing syncs
**Instead**: Connect the Gmail account where councils actually send alerts
```

**Tips**:
- Use real mistakes from user testing/support tickets
- Explain the consequence
- Provide the correct approach
- Be empathetic, not judgemental

---

### Section 8: Troubleshooting (4-6 scenarios)

**Template**:
```
### Problem: [User-visible issue]

**Symptoms**: [What the user sees/experiences]

**Solution**:
1. [First diagnostic step]
2. [Check specific thing]
3. [Try this fix]
4. [If still not working, escalate]

Common causes:
- [Cause 1]: [How to identify]
- [Cause 2]: [How to identify]
```

**Example**:
```
### Problem: No emails syncing

**Symptoms**: Connected successfully, but after an hour, 
still no emails appear in TenderFlow Inbox

**Solution**:
1. Check connection status (should be green "Connected")
2. Check Gmail - do tender emails actually arrive?
3. Click "Sync Now" to force immediate sync
4. Wait 30 seconds and check Inbox again
5. Still nothing? Click "View Sync History" for error messages
6. Still stuck? Contact support with sync history screenshot

Common causes:
- Tender emails in Gmail spam folder
- Connected wrong Gmail account
- Gmail permissions revoked
```

**Tips**:
- Start with symptoms (what user sees)
- Provide step-by-step diagnosis
- Order steps by likelihood/ease
- Always provide an escalation path
- Mention "still stuck?" options
- Include screenshots of error messages

---

### Section 9: Best Practice Tips (5-8 tips)

**Template**:
```
### 💡 [Tip title as instruction]
[Explanation of benefit]

**How to do it**:
1. [Step 1]
2. [Step 2]

This [saves time/prevents errors/improves results] because [reason].
```

**Example**:
```
### 💡 Check sync history weekly
Every Monday morning, review your connection's sync history 
to catch issues early.

**How to do it**:
1. Go to Integrations
2. Click your Gmail connection
3. Click "View Sync History"
4. Check past week shows successful syncs

This prevents missed tenders because you'll spot sync 
failures before they accumulate.
```

**Tips**:
- Focus on time-saving tips
- Include specific timing (when to do it)
- Explain the benefit explicitly
- Share insights from power users
- Make tips actionable, not just advice

---

### Section 10: Example Workflow (Complete scenario)

**Template**:
```
### Scenario
[Name] is a [role] at [organisation type]. [Their situation/goal].

---

### [Day/Time] - [Task Name] ([Duration])

**[Time] - [Subtask]**
1. [Action 1]
2. [Action 2]
3. Result: [What happened]

[Continue with narrative...]

**Result**: [Outcome, time saved, lesson learned]

---

### Summary
**Before [feature]**:
- [Metric 1]: [Old value]
- [Metric 2]: [Old value]

**After [feature]**:
- [Metric 1]: [New value]
- [Metric 2]: [New value]

**Time saved**: [Calculation]
```

**Example**:
"Emma is a Bid Manager at a Yorkshire care provider. She wants to automate tender email processing.

### Monday, 9am - Initial Setup (15 minutes)

**9:00am - Connect Gmail**
1. Emma logs into TenderFlow
2. Goes to Integrations → Add Connection
3. Chooses EMAIL → Connect with Google
4. Result: Gmail connected successfully ✅

**Result**: Emma's past week of tender emails processed automatically.

### Summary
**Before Gmail Connection**:
- Daily email checking: 30 mins
- Weekly total: 2.5 hours

**After Gmail Connection**:
- Daily TenderFlow check: 5 mins
- Weekly total: 25 mins

**Time saved per week**: 2 hours"

**Tips**:
- Use a realistic persona (role, organisation, goal)
- Show complete workflow, not isolated features
- Include timestamps and durations
- Show decision-making, not just clicking
- End with measurable benefit
- Make it aspirational but achievable

---

## Language Dos and Don'ts

### ✅ DO Use

**Clear action verbs**:
- Click, Type, Choose, Select, Enter, Open, Close, Review, Check

**Friendly language**:
- "You'll see", "Let's", "Now", "Next", "Finally"
- "Don't worry", "This is normal", "Take your time"

**Concrete references**:
- "green button", "left sidebar", "top right corner"
- "2 hours", "5 minutes", "within 30 seconds"
- "e.g., manchester@yorkshirecare.com"

**Explanations**:
- "This means...", "This helps...", "Why? Because..."
- "For example...", "Like...", "Similar to..."

### ❌ DON'T Use

**Technical jargon**:
- API, OAuth, JSON, REST, endpoint, payload
- Authentication, authorization, credentials
- Polling, sync, webhook, callback
- Unless explained: "OAuth (a secure way Google verifies who you are)"

**Vague instructions**:
- "Navigate to the settings"
- "Configure the connection"
- "Adjust the parameters"

**Passive voice**:
- "The email will be processed" → "TenderFlow processes the email"
- "Permissions must be granted" → "Grant permissions"

**Condescending language**:
- "Simply click..."
- "Just..."
- "Obviously..."
- "Of course..."

**Assumptions**:
- "As you know..."
- "Clearly..."
- "It's easy to..."

---

## Screenshot Guidelines

### When to Include Screenshots

**Always include for**:
- External sites (Google OAuth screen, council portals)
- Multi-step forms
- Error messages
- Success confirmations
- "What you should see" examples

**Don't bother for**:
- Simple buttons ("Click Save")
- Standard UI (sidebar, headers)
- Repetitive actions

### Screenshot Best Practices

**Do**:
- Use arrows or boxes to highlight key areas
- Crop tightly to relevant area
- Use actual UI, not mockups
- Show realistic data (not "test@test.com")
- Include filename reference in tutorial

**Don't**:
- Show personal data (real emails, names, phone numbers)
- Include browser tabs/bookmarks
- Leave dev tools open
- Use outdated screenshots

### Placeholder Format

If screenshot not ready:
```
**Screenshot**: gmail-oauth-screen.png (TBD)
```

---

## Quality Checklist

Before submitting your tutorial, verify:

### Content
- [ ] All 10 sections complete
- [ ] At least 5 setup steps
- [ ] At least 4 troubleshooting scenarios
- [ ] At least 5 best practice tips
- [ ] Complete example workflow (500+ words)
- [ ] Prerequisites clearly stated
- [ ] Success criteria defined

### Clarity
- [ ] No unexplained jargon
- [ ] Action verbs in every step
- [ ] "What you should see" after key actions
- [ ] Specific UI element references
- [ ] Time estimates provided

### Accuracy
- [ ] Steps tested by following exactly
- [ ] Screenshots up to date
- [ ] All links work
- [ ] Technical details verified
- [ ] Tested by someone unfamiliar with feature

### Tone
- [ ] Friendly, not condescending
- [ ] Encouraging, not patronising
- [ ] UK English throughout
- [ ] Benefits explained, not assumed
- [ ] Empathy shown for difficulties

### Formatting
- [ ] Consistent heading levels
- [ ] Bullet points for lists
- [ ] Numbered steps for sequences
- [ ] Bold for UI elements
- [ ] Code blocks for technical terms
- [ ] Emoji used sparingly (💡 for tips, ❌ for mistakes)

---

## Common Pitfalls

### 1. The Feature List Trap

**Bad**: "Gmail Connection offers these features:
- Email syncing
- AI categorization
- Automatic matching
- Conflict resolution"

**Good**: "Gmail Connection automatically reads your tender emails. Every 2 hours, it checks your Gmail, finds tender alerts, and adds them to your TenderFlow Inbox with a summary and action items."

**Why**: Users care about outcomes, not feature lists.

---

### 2. The Assumption Trap

**Bad**: "Click the OAuth button to authenticate"

**Good**: "Click the blue 'Connect with Google' button. You'll be redirected to Google's sign-in page (this is normal - it's Google's secure login)."

**Why**: Users don't know what OAuth is, or that redirecting is expected.

---

### 3. The Vague Instruction Trap

**Bad**: "Configure your settings appropriately"

**Good**: "Set sync frequency to 'Every 2 hours' (the default). You can change this later if needed."

**Why**: Users need specific values, not judgment calls.

---

### 4. The Missing "Why" Trap

**Bad**: "Grant all permissions when prompted"

**Good**: "Grant all permissions when prompted. TenderFlow needs permission to read emails (to find tender alerts) and see your email address (to show which account is connected). We can't send, delete, or modify your emails."

**Why**: Users are rightly cautious about permissions. Explain why you need them.

---

### 5. The No Escape Route Trap

**Bad**: [After 6 troubleshooting steps] "If still not working, check your system logs"

**Good**: [After 3 troubleshooting steps] "Still stuck? Contact support at support@tenderflow.ai with a screenshot of your sync history. We'll help you within 2 hours."

**Why**: Users need a clear path to human help.

---

## Examples: Good vs Bad

### Example 1: Setup Step

**Bad**:
```
Configure the Gmail integration by authenticating 
via OAuth and setting polling frequency.
```

**Good**:
```
### Step 3: Connect Your Google Account

1. Click the "Connect with Google" button
2. You'll be redirected to Google's sign-in page
3. Sign in with the Gmail where you receive tender alerts
4. Google will ask: "TenderFlow AI wants to access your account"
5. Click "Allow"

**What you should see**: You're redirected back to TenderFlow 
with a success message: "Gmail connected successfully ✅"
```

**Why the good version works**:
- Numbered steps
- Explains redirect (unexpected for new users)
- Specifies which Gmail to use
- Shows exact button text
- Describes success state

---

### Example 2: Troubleshooting

**Bad**:
```
### Connection Error
If authentication fails, verify credentials and retry.
```

**Good**:
```
### Problem: "OAuth error" during connection

**Symptoms**: After clicking "Connect with Google", 
you see an error page

**Solution**:
1. Go back to TenderFlow Integrations
2. Try connecting again
3. When Google asks for permissions, click "Allow" 
   (not "Deny")
4. Check your IT policy - some companies block 
   third-party apps
5. Still stuck? Your IT team may need to whitelist 
   TenderFlow

**Common cause**: Clicking "Deny" on Google's 
permission screen
```

**Why the good version works**:
- Describes what user sees ("OAuth error")
- Provides step-by-step fix
- Mentions IT policies (common blocker)
- Gives escalation path
- Identifies most common cause

---

### Example 3: Best Practice Tip

**Bad**:
```
💡 Optimise your sync frequency for maximum efficiency
```

**Good**:
```
💡 Check sync history every Monday morning
Every Monday at 9am, spend 2 minutes checking your 
Gmail connection's sync history.

**How**:
1. Go to Integrations
2. Click your Gmail connection
3. Click "View Sync History"
4. Check past week shows successful syncs

**Benefit**: You'll catch sync failures before they 
accumulate. Early detection means fewer missed tenders.
```

**Why the good version works**:
- Specific timing (Monday 9am)
- Clear how-to steps
- Explains tangible benefit
- Time estimate (2 minutes)

---

## Review Process

### Self-Review
1. Read your tutorial aloud
2. Follow every step exactly as written
3. Give tutorial to someone unfamiliar with feature
4. Note every place they hesitate or ask questions
5. Revise those sections

### Peer Review
Ask reviewer to check:
- Can they complete the task without asking questions?
- Do they understand why each step matters?
- Are there any confusing terms?
- Is anything tedious or patronising?
- Would they recommend this to a colleague?

### User Testing (Ideal)
- Watch a care provider follow your tutorial
- Don't help them or answer questions
- Note where they struggle
- Revise based on observations

---

## Final Reminders

1. **You are not the user**: What's obvious to you is not obvious to them
2. **Empathy over efficiency**: Better to be clear and slow than fast and confusing
3. **Show, don't tell**: Concrete examples beat abstract descriptions
4. **Explain the why**: Users follow instructions better when they understand purpose
5. **Provide escape routes**: Always offer a path to human help

---

**Remember**: A great tutorial makes users feel confident and successful. A poor tutorial makes them feel stupid and frustrated. Your job is to make them feel like experts.

---

## Getting Help

Questions about writing tutorials?

- 💬 **Slack**: #tutorial-writers
- 📧 **Email**: docs@tenderflow.ai
- 📖 **Examples**: See `/docs/EXAMPLE_TUTORIAL_*.md`

---

**Happy writing!**