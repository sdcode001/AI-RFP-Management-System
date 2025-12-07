const {Rfp} = require("../model/Rfp");
const {Vendor}= require("../model/Vendor");
const {Proposal} = require("../model/Proposal");
const { sendRfpEmail } = require("../service/emailService");
const { buildProposalMailBody } = require("../constant/Prompt");


//Path param - rfpId
//Request Body - {vendorIds: [vendor.id]}
const sendRfpToVendors = async (req, res) => {
    try {
        const { rfpId } = req.params;
        const vendorIds = req.body.vendorIds; // array of vendor.id
        if(!vendorIds || !Array.isArray(vendorIds) || vendorIds.length===0)
        return res.status(400).json({ message: "vendorIds required", data:null });

        const rfp = await Rfp.findById(rfpId);
        if(!rfp) return res.status(404).json({ message: "RFP not found", data:null });

        // fetch vendors by id
        const vendors = await Vendor.find({ id: { $in: vendorIds } });

        const results = [];
        for(const v of vendors){
            const result = await Proposal.create({
                rfpId: rfp.id,
                vendorName: v.name,
                vendorId: v.id,
                vendorEmail: v.email,
                attachments: [],
                extracted: null,
                replyEmail: null,
                aiSummary: null
            });

            const subject = `RFP: ${rfp.title || "Untitled"} - ${result.id}`;
            const html = buildProposalMailBody(rfp, result.id);
                        
            result.rawEmail = {
                subject,
                body: html
            }

            await result.save();

            await sendRfpEmail({
                toEmail: v.email,
                subject,
                html,
                plainText: `Please respond with your proposal. Proposal ID: ${result.id}`
            });

            results.push({ vendorId: v.id, email: v.email, status: "sent" });
        }

    return res.status(200).json({ message: "RFP prposal sent to all the vendors.", data: results });
  } catch(err){
    console.error(err);
    return res.status(500).json({ message: "failed", data: null });
  }
}


const getRfpProposals = async (req, res) => {
    let result = [];
    try{
       const rfps = await Rfp.find({});
       for(const rfp of rfps){
            const proposals = await Proposal.find({rfpId : rfp.id});
            if(proposals.length==0){continue;}
            const item = {
                id: rfp.id,
                rawText: rfp.rawText,
                structuredSpec: rfp.structuredSpec,
                proposals: proposals
            }
            result.push(item);
       }
       return res.status(200).json({ message: "success", data: result });
    }
    catch(err){
        console.error(err);
        return res.status(500).json({ message: "failed", data: result });
    }
}


module.exports={
    sendRfpToVendors,
    getRfpProposals
}