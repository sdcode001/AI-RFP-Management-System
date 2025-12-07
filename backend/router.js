const express = require("express");
const multer = require("multer");
const { createRfp } = require("./controller/RFPController");
const { getVendors, addVendor } = require("./controller/VendorController");
const { processInboundMail } = require("./controller/InboundMailController");
const { sendRfpToVendors, getRfpProposals } = require("./controller/RfpProposalController");
const { compareRfpProposals } = require("./controller/ProposalComparisonController");

const router = express.Router();

//configure multer - temp storage for uploads
const upload = multer({ dest: "tmp/" });

router.post("/structure-rfp", createRfp);
router.get("/vendor", getVendors);
router.post("/vendor", addVendor);
router.post("/inbound-mail", upload.array("attachments"), processInboundMail);
router.post("/send/:rfpId", sendRfpToVendors)
router.get("/rfp-proposals", getRfpProposals)
router.get("/compare/:rfpId", compareRfpProposals)


module.exports = {
   router
}