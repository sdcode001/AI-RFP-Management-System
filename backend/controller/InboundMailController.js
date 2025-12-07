const fs = require("fs-extra");
const path = require("path");
const {Proposal} = require("../model/Proposal");
const { parseAttachmentsToText, extractProposal } = require("../service/ParseService");


/* Request Payload:
 *
 * Content-Type = multipart/form-data
 * Fields:
 *  - from:          string   (Vendor email address)
 *  - subject:       string   (Should contain RFP ID: "Proposal for RFP ID: <rfpId>")
 *  - body:          string   (Email body in plain text)
 *  - attachments[]: file(s)  (Optional: PDF, only)
*/

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
fs.ensureDirSync(UPLOAD_DIR);

const processInboundMail = async (req, res) => {
    try {
        const from = req.body.from;
        const subject = req.body.subject || "";
        const text = req.body.body || "";
        const subSplt = subject.split("-");
        const proposalId = subSplt ? subSplt[1].trim() :  null;

        if(proposalId==null || proposalId==""){
           return res.status(404).json({ message: "Proposal Id not found in mail subject!" });
        }

        //Save attachments from req.files locally
        const attachments = [];
        if (req.files && Array.isArray(req.files)) {
            for (const f of req.files) {
                const dest = path.join(UPLOAD_DIR, f.originalname);
                await fs.move(f.path, dest, { overwrite: true });
                attachments.push({ filename: f.originalname, path: `/uploads/${f.originalname}`, mime: f.mimetype });
            }
        }

        //If SendGrid sends attachments as base64 fields
        //Save raw
        const proposalDoc = await Proposal.findById(proposalId);

        if (!proposalDoc) {
            return res.status(404).json({ message: "Proposal not found" });
        }

        //Extract text from attachments
        const attachmentsText = await parseAttachmentsToText(attachments);
        
        //Extract from (mail body + attachments)
        const extracted = await extractProposal({ emailBody: text, attachmentsText });
 
        proposalDoc.extracted = extracted;
        proposalDoc.attachments = attachments;
        proposalDoc.replyEmail = {subject, body: text};
        proposalDoc.aiSummary = extracted?.summary || null;
        proposalDoc.parsedAt = new Date();
        await proposalDoc.save();

        //Sent Reply event for this proposal to UI through web-socket
        //Refresh UI on ping
        const socket = global.clientSocket();
        if (socket) {
            socket.emit("vendor-reply", { message: "Reply email from - "+from+" for ProposalId-"+proposalId });
        }

        return res.status(200).json({ message: "Received", id: proposalDoc.id });
    } catch (err) {
        console.error("Inbound error:", err);
        return res.status(500).json({ message: "Inbound processing failed" });
    }
}

module.exports = {
   processInboundMail
}