const path = require("path");
const Groq = require("groq-sdk");
const { RFP_EXTRACTION_PROMPT, PROPOSAL_EXTRACTION_PROMPT, RFP_COMPARISON_PROMPT } = require("../constant/Prompt");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });


const client = new Groq({
  apiKey: process.env.GROQ_API_KEY, 
});


const extractRfpStructure = async (userText) => {
  const response = await client.chat.completions.create({
    model: process.env.GROQ_LLM_MODEL,
    messages: [
      { role: "system", content: RFP_EXTRACTION_PROMPT },
      { role: "user", content: userText }
    ],
    temperature: 0
  });

  const jsonResult = response.choices[0].message.content;

  try {
    return JSON.parse(jsonResult);
  } catch (err) {
    console.error("JSON parse error:", err);
    throw new Error("AI returned invalid JSON");
  }
};


const extractProposalStructure = async (rawText) => {
  const resp = await client.chat.completions.create({
    model: process.env.GROQ_LLM_MODEL,
    temperature: 0,
    messages: [
      { role: "system", content: PROPOSAL_EXTRACTION_PROMPT },
      { role: "user", content: rawText }
    ]
  });

  const jsonResult = resp.choices[0].message.content;
  try {
    return JSON.parse(jsonResult);
  } catch (err) {
    console.error("Proposal parse error:", err);
    throw new Error("AI returned invalid JSON for proposal");
  }
};


const analyzeRfpProposals = async (payload) => {
  const response = await client.chat.completions.create({
    model: process.env.GROQ_LLM_MODEL,
    temperature: 0,
    messages: [
      { role: "system", content: RFP_COMPARISON_PROMPT },
      {
        role: "user",
        content: JSON.stringify(payload),
      },
    ],
  });

  const content = response.choices[0].message.content;
  try {
    return JSON.parse(content);
  } catch (err) {
    console.error("Comparison JSON parse error:", content);
    throw new Error("AI returned invalid JSON for comparison");
  }
};


module.exports = {
   extractRfpStructure,
   extractProposalStructure,
   analyzeRfpProposals
}
