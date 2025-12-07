const fs = require("fs-extra");
const PDFParser = require("pdf2json");

const { extractProposalStructure } = require("./LLMService");


async function extractTextFromPdf(filePath) {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", err => reject(err.parserError));
    pdfParser.on("pdfParser_dataReady", pdfData => {
      const raw = pdfParser.getRawTextContent();
      resolve(raw);
    });

    pdfParser.loadPDF(filePath);
  });
}


const parseAttachmentsToText = async (attachments) => {
  let combined = "";
  try{
      for (const at of attachments) {
        if (!at.path) continue;
        if (at.mime === "application/pdf") {
          const t = await extractTextFromPdf(at.path);
          combined += `\n\n${t}`;
        } else {
          // read as text for simple types
          try {
            const t = await fs.readFile(at.path, "utf8");
            combined += `\n\n${t}`;
          } catch (e) {
            // ignore binary unknowns
          }
        }
      }
      return combined;
  }
  catch(err){
    console.error(err);
    return combined;
  }
};


const extractProposal = async ({ emailBody, attachmentsText = "" }) => {
  const input = `Email Body:\n${emailBody}\n\nAttachments Text:\n${attachmentsText}`;
  const extracted = await extractProposalStructure(input);
  return extracted;
};


module.exports={
   parseAttachmentsToText,
   extractProposal
}