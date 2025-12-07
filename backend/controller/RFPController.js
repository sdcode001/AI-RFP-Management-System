const {extractRfpStructure} = require("../service/LLMService")
const {Rfp} = require("../model/Rfp")


const createRfp = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) return res.status(400).json({ message: "Text is required", data:null });

    //call LLM
    const structured = await extractRfpStructure(query);

    //save to DB
    const newRfp = await Rfp.create({
      rawText: query,
      structuredSpec: structured,
      title: structured.title || "Untitled RFP",
    });

    return res.status(201).json({
      message: "RFP created successfully",
      data: {
         id: newRfp.id,
         rawText: newRfp.rawText,
         structuredSpec: newRfp.structuredSpec,
         title: newRfp.structuredSpec,
         createdAt: newRfp.createdAt
      },
    });

  } catch (err) {
    console.error("Create RFP Error:", err);
    return res.status(500).json({ message: "Failed to create RFP", data:null });
  }
}

module.exports = {
   createRfp
}