// src/controllers/vendorController.js
const {Vendor}= require("../model/Vendor");


const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().sort({ createdAt: -1 });
    return res.status(200).json(vendors);
  } catch (err) {
    return res.status(500).json({ mssage: "Failed to fetch vendors" });
  }
};


const addVendor = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required", data:null });
    }

    //check duplicate email
    const exists = await Vendor.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Vendor with this email already exists", data:null });
    }

    const vendor = await Vendor.create({ name, email });

    return res.status(201).json({
      message: "Vendor created successfully",
      data: {
         id: vendor.id,
         name: vendor.name,
         email: vendor.email
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to create vendor", data:null });
  }
};


module.exports = {
   addVendor,
   getVendors
}