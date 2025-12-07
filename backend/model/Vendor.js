const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema(
  {
    id: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  { timestamps: true }
);

VendorSchema.pre("save", async function (next) {
  if (!this.id) {
    this.id = this._id.toString();
  }
});


const Vendor=mongoose.models.Vendor || mongoose.model("Vendor", VendorSchema)

module.exports={
    Vendor
}
