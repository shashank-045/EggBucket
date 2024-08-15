const Outlet = require("../models/outlet_model");
const ApiFeatures=require('../utils/apifeatures')
const removeImg = require("../utils/imageRemove");
const OutletPartner=require('../models/outlet_partner_model')

exports.createOutlet = async (req, res) => {
  try {
    const outletData = req.body;

    if (!req.file) {
      return res
        .status(400)
        .json({ status: "fail", message: "No image file provided" });
    }
    if (!outletData.outletNumber || !outletData.outletArea) {
      await removeImg(req.file.path)
      return res
        .status(400)
        .json({ error: "Outlet number and location are required" });
    }
    outletData.img = req.file.path;
    

    //assinging outlet to its partner

    let OpId=outletData.outletPartner
    try{
      const result = await OutletPartner.findOneAndUpdate({_id:OpId},{outletId:outletData.outletNumber}, {
        new: true,
        runValidators: true
      });
  
      if (!result) return res.status(404).json({ error: "Partner not found" });

    }catch{
      return res
      .status(400)
      .json({ error: "Vlidation error for parther (outletId should be unique) in use" });
    }

    //

    const newOutlet = await Outlet.create(outletData);
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Outlet created successfully !",
      data: newOutlet,
    });
  } catch (err) {
    // Handle errors (e.g., duplicate outlet name)
    await removeImg(req.file.path)
    res
      .status(500)
      .json({
        status: "success",
        code: 200,
        message: "Internal Server Error",
        error: "Failed to create outlet",
        details: err.message,
      });
  }
};

// Get all outlets
exports.getAllOutlets = async (req, res) => {
  try {
    
    const apiFeatures = new ApiFeatures(Outlet.find(), req.query) 
      .filtering()    // Apply filtering
      .paginaton()

    // Apply population after other query methods
    const outlets = await apiFeatures.query
      .populate({ path: "outletPartner", select: "_id firstName lastName" })
      .populate({ path: "deliveryPartner", select: "_id firstName lastName" });

    res.status(200).json({
      status: "success",
      code: 200,
      message: "All outlets fetched successfully",
      data: outlets,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to get outlets", details: err.message });
  }
};

// Update an outlet by ID
exports.updateOutlet = async (req, res) => {
  try {
    const outletId = req.params.id;
    const { deliveryPartner, ...otherData } = req.body;
    const file = req.file ? req.file.path : null;

    // Find the existing outlet
    const outlet = await Outlet.findById(outletId);
    if (!outlet) {
      if (file) await removeImg(file);
      return res.status(404).json({ error: "Outlet not found" });
    }

    let oldPartner = outlet.outletPartner;
    let previousDeliveryPartners = outlet.deliveryPartner || [];

    // If delivery partners are provided, replace existing ones with the new entries
    if (deliveryPartner && deliveryPartner.length > 0) {
      outlet.deliveryPartner = [...new Set(deliveryPartner)];
    } else {
      outlet.deliveryPartner = [];  // Clear all delivery partners if no new entries are provided
    }

    let im = outlet.img || null;
    if (file) {
      // Update the outlet's image path
      otherData.img = file;
    }

    // Update other fields
    Object.assign(outlet, otherData);

    // Save the updated outlet
    await outlet.save();

    // Update the outletPartner's outletId if the partner has changed
    if (oldPartner != outlet.outletPartner) {
      try {
        await OutletPartner.findOneAndUpdate(
          { _id: oldPartner },
          { outletId: "free" }
        );
        await OutletPartner.findByIdAndUpdate(
          { _id: outlet.outletPartner },
          { outletId: outlet.outletNumber }
        );
      } catch (error) {
        return res.status(400).json({
          status: "error",
          data: "Outlet partners not updated accordingly",
        });
      }
    }

    // Remove old image file if a new image has been uploaded
    if (im && file) {
      await removeImg(im);
    }

    res.status(200).json({
      status: "success",
      code: 200,
      message: "Outlet updated successfully!",
    });
  } catch (err) {
    if (req.file && req.file.path) await removeImg(req.file.path);

    res.status(500).json({
      error: "Failed to update outlet",
      details: err.message,
    });
  }
};


// Delete an outlet by ID
exports.deleteOutlet = async (req, res) => {
  try {
    const outletId = req.params.id;

    const outlet = await Outlet.findById(outletId);
    if (!outlet) {
      return res.status(404).json({ error: "Outlet not found" });
    }
     
    let oldPartner = outlet.outletPartner;

    await Outlet.findByIdAndDelete(outletId);
    
    await OutletPartner.findOneAndUpdate(
      { _id: oldPartner },
      { outletId: "free" }
    )
    
    if (outlet.img) {
      await removeImg(outlet.img)
    }
    res
      .status(200)
      .json({
        status: "success",
        code: 200,
        message: "Outlet deleted successfully",
      });
  } catch (err) {
    res
      .status(500)
      .json({
        status: "fail",
        code: 500,
        message: "Internal Server Error",
        error: "Failed to delete outlet",
        details: err.message,
      });
  }
};
