const EggbucketVendor = require("../models/egg_bucket_vendor_model");

// Create a new eggbucket vendor
exports.createEggbucketVendor = async (req, res) => {
  try {
    const vendorData = req.body;

    // Basic validation (add more as needed)
    if (!vendorData.vendorName) {
      return res.status(400).json({ error: "Vendor name is required" });
    }

    const newVendor = await EggbucketVendor.create(vendorData);
    res.status(201).json(newVendor);
  } catch (err) {
    // Handle duplicate vendor name error
    if (err.code === 11000 && err.keyPattern.vendorName) {
      return res
        .status(400)
        .json({ error: "Vendor with this name already exists" });
    }
    res
      .status(500)
      .json({ error: "Failed to create vendor", details: err.message });
  }
};

// Get all eggbucket vendors
exports.getAllEggbucketVendors = async (req, res) => {
  try {
    const vendors = await EggbucketVendor.find();
    res.json(vendors);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to get vendors", details: err.message });
  }
};

// Get a vendor by ID
exports.getEggbucketVendorById = async (req, res) => {
  try {
    const vendorId = req.params.id;
    const vendor = await EggbucketVendor.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    res.json(vendor);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to get vendor", details: err.message });
  }
};

// Update a vendor by ID
exports.updateEggbucketVendor = async (req, res) => {
  try {
    const vendorId = req.params.id;
    const updateData = req.body;

    const vendor = await EggbucketVendor.findByIdAndUpdate(
      vendorId,
      updateData,
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    res.json(vendor);
  } catch (err) {
    // Handle duplicate vendor name error
    if (err.code === 11000 && err.keyPattern.vendorName) {
      return res
        .status(400)
        .json({ error: "Vendor with this name already exists" });
    }
    res
      .status(500)
      .json({ error: "Failed to update vendor", details: err.message });
  }
};

// Delete a vendor by ID
exports.deleteEggbucketVendor = async (req, res) => {
  try {
    const vendorId = req.params.id;
    const vendor = await EggbucketVendor.findByIdAndDelete(vendorId);

    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    res.json({ message: "Vendor deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete vendor", details: err.message });
  }
};
