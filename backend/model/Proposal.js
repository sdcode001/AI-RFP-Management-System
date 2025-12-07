const mongoose = require("mongoose");

const ProposalSchema = new mongoose.Schema({
  id: { type: String }, 
  rfpId: { type: String },
  vendorId: { type: String },
  vendorName: { type: String },
  vendorEmail: { type: String },
  rawEmail: { type: Object },
  replyEmail: {type: Object},
  attachments: [{ filename: String, path: String, mime: String }],
  extracted: { type: Object, default: {} },
  aiSummary: { type: String },
  parsedAt: { type: Date }
}, { timestamps: true });



ProposalSchema.pre("save", async function (next) {
  if (!this.id) {
    this.id = this._id.toString();
  }
});

const Proposal=mongoose.models.Proposal || mongoose.model("Proposal", ProposalSchema)

module.exports={
    Proposal
}
