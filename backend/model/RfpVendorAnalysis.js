const mongoose = require("mongoose");

const RfpVendorAnalysisSchema = new mongoose.Schema(
  {
    id: { type: String }, 
    rfpId: { type: String, required: true },
    data: { type: Object, required: true }
  },
  { timestamps: true }
);

RfpVendorAnalysisSchema.pre("save", async function (next) {
  if (!this.id) {
    this.id = this._id.toString();
  }
});

const RfpVendorAnalysis=mongoose.models.RfpVendorAnalysis || mongoose.model("RfpVendorAnalysis", RfpVendorAnalysisSchema)

module.exports={
    RfpVendorAnalysis
}
