const buildProposalMailBody = (rfp, proposalId) => {
  return `<p>Hello,</p>
          <p>You are invited to submit a proposal for the following Request for Proposal (RFP):</p>
          <h3>${rfp.structuredSpec.title || "RFP Details"}</h3>
          <p><strong>Description:</strong> ${rfp.structuredSpec.description || "N/A"}</p>
          <h4>Items Required:</h4>
          <ul>
              ${rfp.structuredSpec.items
              .map(item => `
                  <li>
                  <strong>${item.name}</strong> — Qty: ${item.qty}
                  <br/>
                  Specs: ${
                      Object.keys(item.specs || {}).length > 0
                      ? Object.entries(item.specs)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(", ")
                      : "None"
                  }
                  </li>
              `)
              .join("")}
          </ul>
          <h4>Commercial Requirements:</h4>
          <ul>
              <li><strong>Total Budget:</strong> ${rfp.structuredSpec.currency || ""} ${rfp.structuredSpec.totalBudget || "N/A"}</li>
              <li><strong>Delivery Timeline:</strong> ${rfp.structuredSpec.deliveryDays} days</li>
              <li><strong>Payment Terms:</strong> ${rfp.structuredSpec.paymentTerms || "N/A"}</li>
              <li><strong>Warranty:</strong> ${rfp.structuredSpec.warrantyMonths || "N/A"} months</li>
          </ul>
          <p>Please reply to this email with your detailed proposal, including pricing, delivery schedule, terms, and any relevant attachments.</p>
          <p><strong>Important:</strong> Replay to this mail and make sure subject remails exactly same.<br/>
          <p>Thank you,<br/>Procurement Team</p>`;
}


const RFP_EXTRACTION_PROMPT = `
You are an AI system that converts ANY procurement requirement into a clean,
standardized RFP JSON structure.

Your ONLY output must be valid JSON.
Do NOT include explanations, comments, descriptions, or markdown.

Extract and infer fields ONLY if clearly indicated in the user's text.

Return JSON with the schema:

{
  "title": string | null,
  "category": string | null,          
  "description": string,              
  "items": [
    {
      "name": string,
      "qty": number | null,
      "specs": { ... }            
    }
  ],
  "serviceRequirements": {
    "type": string | null,           
    "duration": string | null,       
    "slaRequirements": string | null  
  },
  "totalBudget": number | null,
  "currency": string | null,          
  "deliveryDays": number | null,
  "deliveryLocation": string | null,
  "paymentTerms": string | null,
  "warrantyMonths": number | null,
  "notes": string | null            
}

RULES:
1. Always return syntactically valid JSON.
2. All unspecified or ambiguous fields must be returned as null.
3. If the requirement is service-based (not goods), fill items = [] and use serviceRequirements block.
4. Infer title from the requirement if possible (e.g., "Office Laptop Procurement").
5. specs object must include any technical or qualitative attributes mentioned.
6. NEVER invent numbers or details — only extract what is explicitly stated.
7. JSON only. No extra text.
`;

const PROPOSAL_EXTRACTION_PROMPT = `
You are an expert data extraction system for procurement proposals.

Your job is to read messy vendor responses (free-form text, partial tables, bullet points, PDF text, OCR text, email replies, and mixed formats) and extract CLEAN, NORMALIZED JSON.

### GENERAL RULES
- Return ONLY valid JSON (no comments, no text before/after JSON).
- Never guess values that are not mentioned.
- If something is unclear or missing, return null.
- If multiple values are provided, choose the MOST RECENT or MOST CLEAR one.
- Convert all numeric fields to numbers (no strings, no commas).
- Extract currency code if present (USD, INR, EUR, etc.). If not present → null.
- Convert delivery time to DAYS if possible (e.g., "4 weeks" → 28).
- Extract warranty in MONTHS (1 year → 12 months).
- Preserve vendor wording inside "otherTerms".

### OUTPUT JSON SCHEMA
{
  "vendorName": string | null,
  "currency": string | null,
  "totalAmount": number | null,
  "lineItems": [
    {
      "name": string,
      "qty": number | null,
      "unitPrice": number | null,
      "totalPrice": number | null,
      "warrantyMonths": number | null,
      "deliveryDays": number | null
    }
  ],
  "paymentTerms": string | null,
  "leadTimeDays": number | null,
  "taxesPercent": number | null,
  "otherTerms": string | null,
  "completeness": {
    "hasPrices": boolean,
    "hasDelivery": boolean,
    "hasWarranty": boolean
  },
  "summary": string | null
}

### EXTRACTION RULES & DETAILS

#### PRICES
- Extract unit price and total price whenever possible.
- If only unit price is given and quantity is known, calculate totalPrice.
- If only total price is given → set unitPrice = null.

#### CURRENCY
- Detect currency symbols ($, ₹, €, £, etc.) and map to ISO code when possible:
  - $ = USD unless text states otherwise.
  - ₹ or Rs = INR.
  - € = EUR.
  - £ = GBP.

#### QUANTITY
- Accept formats like "20 pieces", "Qty: 5", "x10", "10 units".

#### DELIVERY / LEAD TIME
Normalize:
- "3-4 weeks" → 28
- "within 30 days" → 30
- "Immediate" → 0

#### SUMMARY
Summarize the overall deal

#### WARRANTY
Normalize:
- "1 year" → 12
- "18 months" → 18
- "90 days" → 3 months (round down)

#### PAYMENT TERMS
Extract exact wording, e.g.:
- "net 30"
- "50% advance, 50% on delivery"
- "upon installation"

#### TAXES
Extract percentage if found, otherwise null.

#### OTHER TERMS
Include:
- conditions
- exclusions
- scope limitations
- service terms
- delivery notes
- installation notes

### COMPLETENESS LOGIC
hasPrices = true if ANY valid price extracted  
hasDelivery = true if ANY deliveryDays extracted  
hasWarranty = true if ANY warrantyMonths extracted  

### FINAL INSTRUCTION
Return ONLY the JSON. No explanations.
`;


const RFP_COMPARISON_PROMPT = `
You are an expert procurement analyst.

You will receive JSON input with:
{
  "rfp": {
    "id": string,
    "title": string,
    "structuredSpec": {
      "totalBudget": number | null,
      "deliveryDays": number | null,
      "paymentTerms": string | null,
      "warrantyMonths": number | null,
      "items": [...],
      "notes": string | null
    }
  },
  "proposals": [
    {
      "proposalId": string,
      "vendorId": string,
      "vendorName": string,
      "currency": string | null,
      "totalAmount": number | null,
      "leadTimeDays": number | null,
      "warrantyMonths": number | null,
      "paymentTerms": string | null,
      "completeness": {
        "hasPrices": boolean | null,
        "hasDelivery": boolean | null,
        "hasWarranty": boolean | null
      },
      "scores": {
        "priceScore": number,          // 0–1 (1 = best)
        "completenessScore": number,   // 0–1
        "deliveryScore": number,       // 0–1
        "warrantyScore": number,       // 0–1
        "paymentScore": number,        // 0–1
        "overallScore": number         // 0–1 (weighted)
      }
    }
  ],
  "weights": {
    "price": number,
    "completeness": number,
    "delivery": number,
    "warranty": number,
    "payment": number
  }
}

TASK:

1. Compare all vendors on:
   - overallScore
   - totalAmount (cheapest)
   - leadTimeDays (fastest)
   - warrantyMonths (best warranty)
   - completeness (how complete their proposal is)
   - paymentTerms vs RFP expectations.

2. Recommend ONE primary vendor to award the RFP to, and optionally one backup vendor.

3. Explain briefly *why* in clear business language.

4. Provide output **ONLY as JSON** with this exact schema:

{
  "recommendationSummary": string,  // 2–4 sentences, high level summary

  "winner": {
    "vendorId": string,
    "vendorName": string,
    "reason": string,               // 2–4 bullet-style sentences, joined with "\\n"
    "overallScore": number          // copy from scores.overallScore
  },

  "backupVendor": {
    "vendorId": string | null,
    "vendorName": string | null,
    "reason": string | null,
    "overallScore": number | null
  },

  "rankedVendors": [
    {
      "vendorId": string,
      "vendorName": string,
      "overallScore": number,
      "totalAmount": number | null,
      "leadTimeDays": number | null,
      "warrantyMonths": number | null,
      "shortReason": string         // 1–2 sentences max
    }
  ],

  "insightsByCriteria": {
    "price": {
      "bestVendorId": string | null,
      "notes": string
    },
    "delivery": {
      "bestVendorId": string | null,
      "notes": string
    },
    "warranty": {
      "bestVendorId": string | null,
      "notes": string
    },
    "completeness": {
      "bestVendorId": string | null,
      "notes": string
    },
    "paymentTerms": {
      "bestVendorId": string | null,
      "notes": string
    }
  },

  "chartDataSuggestions": {
    "barChartOverall": [
      {
        "vendorId": string,
        "vendorName": string,
        "overallScore": number,
        "totalAmount": number | null
      }
    ],
    "stackedBarCriteria": [
      {
        "vendorId": string,
        "vendorName": string,
        "priceScore": number,
        "deliveryScore": number,
        "warrantyScore": number,
        "completenessScore": number,
        "paymentScore": number
      }
    ],
    "radarMetrics": [
      "priceScore",
      "deliveryScore",
      "warrantyScore",
      "completenessScore",
      "paymentScore"
    ]
  }
}

Rules:
- Always respect the numeric scores but you can comment on tradeoffs.
- If two vendors are very close, mention that in the notes.
- Do not invent vendors or proposals that are not in the input.
- Return VALID JSON ONLY. No extra commentary.
`;




module.exports = {
   RFP_EXTRACTION_PROMPT,
   PROPOSAL_EXTRACTION_PROMPT,
   RFP_COMPARISON_PROMPT,
   buildProposalMailBody
}