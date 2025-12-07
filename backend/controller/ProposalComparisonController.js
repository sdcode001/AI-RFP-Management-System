const {Rfp} = require("../model/Rfp");
const {Proposal} = require("../model/Proposal");
const { buildProposalMetrics } = require("../util/Scoring");
const { analyzeRfpProposals } = require("../service/LLMService");
const { RfpVendorAnalysis } = require("../model/RfpVendorAnalysis");

const compareRfpProposals = async (req, res) => {
   try {
        const { rfpId } = req.params;

        // const demo = await RfpVendorAnalysis.findOne({rfpId: rfpId});
        // if(demo){
        //     return res.status(200).json({ message: "Comparison completed", data:demo.data });
        // }

        //Check AI analysis already stored then delete old record
        const deletedItem = await RfpVendorAnalysis.deleteOne({rfpId: rfpId});

        const rfp = await Rfp.findById(rfpId).lean();
        if (!rfp) {
           return res.status(404).json({ message: "RFP not found", data:null });
        }

        const proposals = await Proposal.find({ rfpId }).lean();
        if (!proposals.length) {
           return res.status(404).json({ message: "No proposals found for this RFP", data: null});
        }

        //build numeric metrics + scores
        const { proposalsWithScores, weights, globals } = buildProposalMetrics(rfp, proposals);

        //Prepare payload for LLM
        const payload = {
        rfp: {
            id: rfp.id,
            title: rfp.title,
            structuredSpec: rfp.structuredSpec || {},
        },
        proposals: proposalsWithScores,
        weights,
        };

        const aiAnalysis = await analyzeRfpProposals(payload);

        const result = await RfpVendorAnalysis.create({
            rfpId: rfpId,
            data: {
                vendors: proposalsWithScores,
                globals: globals,
                weights: weights,
                aiAnalysis: aiAnalysis
            }
        })

        //Final response
        return res.status(200).json({
            message: "Comparison completed",
            data: result.data
        });
    } catch (err) {
        console.error("compareRfpProposals error:", err);
        return res.status(500).json({ message: "Failed to compare proposals", data:null });
    }
}

module.exports={
    compareRfpProposals
}

