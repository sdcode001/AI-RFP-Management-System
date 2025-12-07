# 📘 AI-Powered RFP Management System
Streamlining procurement workflows using AI — from RFP creation → vendor communication → proposal extraction → intelligent comparison → final recommendation.

<img width="1000" height="500" alt="image" src="https://github.com/user-attachments/assets/551b6cd3-88c1-4e2d-8bd3-53004b27bc5e" />
<img width="1000" height="500" alt="image" src="https://github.com/user-attachments/assets/f766cf44-fda6-4209-ad54-6ccfabf54534" />

# ⚙️ Project Setup
## 1. Prerequisites

Node.js 18+

MongoDB (local or Atlas)

SendGrid Account (API Key + Set sender authentication)

Groq API Key

## 2. Installation
Clone repository
```
git clone https://github.com/sdcode001/AI-RFP-Management-System.git
cd AI-RFP-Management-System
```

Backend Setup
```
cd backend
npm install --force
npm start
```

Frontend Setup
```
cd frontend
npm install --force
npm start
```

# 🔐 Environment Variables

backend/.env (Replace with your credentials)
```
GROQ_API_KEY=
GROQ_LLM_MODEL=llama-3.1-8b-instant
MONGO_URI=
APP_SERVER_PORT = 3000
SENDGRID_API_KEY=
EMAIL_FROM=
INBOUND_REPLY_TO=
```

frontend/src/config.ts
```
API_BASE_URL: "http://127.0.0.1:3000"
```

# 🛠️ Tech Stack
## Frontend

Angular 17

Angular Material

ECharts (ngx-echarts)

## Backend

Node.js + Express.js

MongoDB + Mongoose

SendGrid (Email sending) 

Multer (file uploads)

## LLM

GROQ llama-3.1-8b-instant (RFP structuring, Proposal extraction, Proposal comparison + recommendation)


# 📡 API Documentation

## 1. Create RFP (Natural Language → Structured)

POST /api/structure-rfp

Body
```
{ "query": "I need 20 laptops with 16GB RAM..." }
```
Response
```
{
  "message": "RFP created successfully",
  "data": { "title": "...", "structuredSpec": { ... } ... }
}
```

## 2. Get Vendors

GET /api/vendors

Response
```
[{id: "123", name: "ABC Supplies", email: "abc@gmail.com"}, ...]
```

## 3. Add Vendor

POST /api/vendors

Body
```
{ "name": "ABC Supplies", "email": "abc@gmail.com" }
```
Response
```
{message: "Vendor created successfully", data: {id: "123", name: "ABC Supplies", email: "abc@gmail.com"}}
```

## 4. Inbound Email Webhook (Simulate vendor reply Email)

POST /api/inbound-mail

Body (multipart/form-data)
```
from: string(Vendor email address)
subject: string (Should contain ProposalId: "Proposal for RFP: <proposalId>")
body: string(Email body in plain text)
attachments[]: file(s)
```
Response
```
{ message: "Received", id: "abcd1234" }
```

## 5. Send RFP to Vendors

POST /api/send/:rfpId

Body
```
{ "vendorIds": ["v1", "v2"] }
```
Response
```
{ message: "RFP proposal sent to all the vendors.", data: [{vendorId: "123abcd", email: "abc@mail.com", status: "sent"}, ...] }
```

## 6. Compare Proposals + AI Recommendation

GET /api/compare/:rfpId

Response
```
{message: "Comparison completed", data: {vendors:{...}, globals:{...}, weights:{...}, aiAnalysis:{...}}
```

## 7. Get all RFP's with Proposals

GET /api/rfp-proposals

Response
```
{ message: "success", data: [{id:"abc123", rawText:"...", structuredSpec:{...}, proposals:[{...}, ...]]}
```

# 📌 Decisions & Assumptions

## Design Decisions

Natural language → structured RFP using Groq

Vendor responses extracted using LLM for consistent JSON

Email reply-to mapping identifies vendor automatically

Scoring kept deterministic + explainable

AI used only for reasoning, not scoring

## Assumptions

Vendors reply with- (Same email subject, Body text + attatchments files)

Inbound email webhook API delivers email correctly

Currency normalization is not required for MVP

All vendors priced in the same currency (MVP assumption)

One user (single-tenant) system initially


# 📌 AI Tools Usage

Groq is used for LLM.

Learned how LLMs improve accuracy when guided by strict JSON schemas.

Improved prompt design by adding clarity, constraints, and examples, which dramatically reduced errors.

Used a comparison prompt combining deterministic scores + LLM reasoning for final vendor recommendation.

Adopted a two-step extraction pipeline (attachments → text → LLM) for messy vendor emails.


