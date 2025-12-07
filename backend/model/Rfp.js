const mongoose = require("mongoose");

const RfpSchema = new mongoose.Schema(
  {
    id: { type: String }, 
    rawText: { type: String, required: true },
    structuredSpec: { type: Object, required: true },
    title: { type: String },
  },
  { timestamps: true }
);

RfpSchema.pre("save", async function (next) {
  if (!this.id) {
    this.id = this._id.toString();
  }
});

const Rfp=mongoose.models.Rfp || mongoose.model("Rfp", RfpSchema)

module.exports={
    Rfp
}
