# TenderFlow AI - API Documentation

Complete API reference for TenderFlow AI endpoints.

## Table of Contents

1. [Authentication](#authentication)
2. [Tenders](#tenders)
3. [AI Analysis](#ai-analysis)
4. [Documents](#documents)
5. [Evidence Library](#evidence-library)
6. [Reports](#reports)
7. [Email](#email)

---

## Authentication

All API requests require authentication via Supabase JWT token.

### Headers

```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

### Get Current User

```typescript
const { data: { user } } = await supabase.auth.getUser();
```

---

## Tenders

### POST /api/evaluate-tender

Evaluate a tender using AI scoring system.

**Request Body:**
```json
{
  "tenderId": "string",
  "tenderData": {
    "title": "string",
    "description": "string",
    "authority": "string",
    "location": "string",
    "value": "number",
    "serviceType": "string",
    "deadline": "string"
  },
  "companyProfile": {
    "name": "string",
    "cqc_registered": "boolean",
    "services": ["string"],
    "service_area": ["string"],
    "years_experience": "number"
  }
}
```

**Response:**
```json
{
  "decision": "Bid | Review | No Bid",
  "score": 85,
  "service_fit": 23,
  "geography_fit": 12,
  "compliance_fit": 18,
  "evidence_fit": 17,
  "commercial_viability": 9,
  "effort": 6,
  "why": ["reason 1", "reason 2"],
  "risks": ["risk 1", "risk 2"],
  "missing_evidence": ["evidence 1"],
  "next_steps": ["step 1", "step 2"]
}
```

**Scoring Criteria:**
- `service_fit` (0-25): How well services match tender requirements
- `geography_fit` (0-15): Location and coverage area match
- `compliance_fit` (0-20): CQC registration, certifications, accreditations
- `evidence_fit` (0-20): Case studies, past performance, references
- `commercial_viability` (0-10): Value, duration, resource requirements
- `effort` (0-10): Level of work required to bid

**Decision Logic:**
- Score ≥ 80: "Bid"
- Score 60-79: "Review"
- Score < 60: "No Bid"

---

### POST /api/parse-document

Parse uploaded tender document and extract text.

**Request Body:**
```json
{
  "fileUrl": "string",
  "fileType": "pdf | docx | xlsx"
}
```

**Response:**
```json
{
  "text": "string",
  "sections": ["string"],
  "wordCount": "number"
}
```

**Supported File Types:**
- PDF (`.pdf`)
- Word (`.docx`)
- Excel (`.xlsx`, `.csv`)

---

### POST /api/extract-questions

Extract questions from tender document using AI.

**Request Body:**
```json
{
  "text": "string",
  "tenderId": "string"
}
```

**Response:**
```json
{
  "questions": [
    {
      "question_text": "string",
      "category": "string",
      "is_mandatory": "boolean",
      "word_limit": "number",
      "weighting": "number"
    }
  ]
}
```

**Categories:**
- Service Delivery
- Mobilisation
- Safeguarding
- Staffing
- Quality Assurance
- Commercial
- Social Value
- Other

---

## AI Analysis

### POST /api/chat

Context-aware AI chat assistant for tender analysis.

**Request Body:**
```json
{
  "message": "string",
  "tenderId": "string",
  "conversationHistory": [
    {
      "role": "user | assistant",
      "content": "string"
    }
  ]
}
```

**Response:**
```json
{
  "response": "string (markdown formatted)",
  "context_used": ["tender_data", "evidence_library", "historical_bids"]
}
```

**Example Questions:**
- "Summarise this tender"
- "What are the main risks?"
- "What evidence is missing?"
- "Draft an answer for safeguarding section"
- "Compare this to past bids"

**AI Capabilities:**
- Access to tender documents
- Access to uploaded files
- Access to evidence library
- Access to historical bids
- Previous conversation context

---

### POST /api/generate-tender-response

Generate professional UK local authority tender response.

**Request Body:**
```json
{
  "questionText": "string",
  "category": "string",
  "wordLimit": "number",
  "tenderTitle": "string",
  "tenderAuthority": "string",
  "evidenceItems": ["string"],
  "companyProfile": {
    "name": "string",
    "description": "string"
  }
}
```

**Response:**
```json
{
  "response": "string (markdown formatted)",
  "wordCount": "number",
  "sections": ["string"]
}
```

**Response Format:**
- Structured headings (H2, H3)
- Concise paragraphs (3-4 sentences)
- Bullet points for lists
- Professional formal tone
- Evidence-based content
- UK local authority standards

**Guardrails:**
- Never invents case studies
- Never exaggerates capabilities
- No unsubstantiated claims
- Highlights missing evidence
- Flags potential risks

---

## Documents

### POST /api/upload-tender-file

Upload tender document to storage.

**Request:**
- Content-Type: `multipart/form-data`
- Field: `file` (File object)
- Field: `tenderId` (string)

**Response:**
```json
{
  "fileId": "string",
  "fileName": "string",
  "fileSize": "number",
  "fileType": "string",
  "url": "string"
}
```

**Storage:**
- Bucket: `tender-files`
- Path: `{organisation_id}/{tender_id}/{filename}`
- Max size: 10MB
- Allowed types: PDF, Word, Excel, images

---

### POST /api/export-document

Export tender response to Word document.

**Request Body:**
```json
{
  "title": "string",
  "authority": "string",
  "deadline": "string",
  "content": "string (markdown)",
  "companyName": "string"
}
```

**Response:**
- Content-Type: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- File download with proper formatting

**Document Features:**
- Professional formatting
- Company branding
- Structured headings
- Bullet points
- Tables support
- Page numbers
- Headers/footers

---

### POST /api/export-word

Export tender response to Word (.docx) format.

**Request Body:**
```json
{
  "title": "string",
  "authority": "string",
  "deadline": "string",
  "content": "string (markdown)",
  "companyName": "string"
}
```

**Response:**
- Binary file download
- Filename: `tender-response-{timestamp}.docx`

---

## Evidence Library

### Database Operations

Evidence library uses Supabase client directly:

```typescript
// Get evidence items
const { data, error } = await supabase
  .from("evidence_library")
  .select("*")
  .eq("organisation_id", orgId)
  .order("created_at", { ascending: false });

// Create evidence item
const { data, error } = await supabase
  .from("evidence_library")
  .insert([{
    organisation_id: "string",
    title: "string",
    category: "string",
    content: "string"
  }])
  .select()
  .single();

// Update evidence item
const { data, error } = await supabase
  .from("evidence_library")
  .update({ content: "string" })
  .eq("id", evidenceId)
  .select()
  .single();

// Delete evidence item
const { error } = await supabase
  .from("evidence_library")
  .delete()
  .eq("id", evidenceId);
```

**Categories:**
- Company Profile
- Safeguarding
- Quality Assurance
- Staffing & Recruitment
- Compliance & Certifications
- Case Studies
- Policies & Procedures

---

## Reports

Reports use direct database queries:

```typescript
// Get tender statistics
const { data, error } = await supabase
  .from("tenders")
  .select("*")
  .eq("organisation_id", orgId);

// Get win rate
const { data: won } = await supabase
  .from("historical_bids")
  .select("*")
  .eq("outcome", "won");

const { data: total } = await supabase
  .from("historical_bids")
  .select("*");

const winRate = (won.length / total.length) * 100;
```

---

## Email

### POST /api/test-email

Send test email to verify SMTP configuration.

**Request Body:**
```json
{
  "to": "string",
  "settings": {
    "smtp_host": "string",
    "smtp_port": "string",
    "smtp_username": "string",
    "smtp_password": "string",
    "from_email": "string",
    "from_name": "string"
  }
}
```

**Response:**
```json
{
  "success": "boolean",
  "message": "string"
}
```

**SMTP Providers:**
- Gmail: `smtp.gmail.com:587`
- Outlook: `smtp.office365.com:587`
- SendGrid: `smtp.sendgrid.net:587`
- Mailgun: `smtp.mailgun.org:587`

---

## Error Handling

All endpoints return errors in this format:

```json
{
  "error": "string",
  "details": "string",
  "code": "string"
}
```

**HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (missing/invalid parameters)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `405` - Method Not Allowed
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

---

## Rate Limiting

**Current Limits:**
- Auth endpoints: 10 requests/minute
- AI endpoints: 20 requests/minute
- File uploads: 5 requests/minute
- Other endpoints: 60 requests/minute

**Headers:**
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1234567890
```

---

## Webhooks (Future)

Planned webhook support for:
- Tender deadline approaching
- New tender added
- Bid status changed
- Document uploaded
- AI analysis completed

**Webhook Format:**
```json
{
  "event": "string",
  "timestamp": "string",
  "data": {}
}
```

---

## SDKs (Future)

Planned SDK support for:
- JavaScript/TypeScript
- Python
- Ruby
- PHP

---

## Support

For API support:
- Email: support@tenderflow.ai
- Documentation: https://docs.tenderflow.ai
- Status: https://status.tenderflow.ai

---

**Last Updated:** 2026-03-19
**API Version:** 1.0.0