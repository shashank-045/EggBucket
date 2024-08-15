const OutletPartner = require("../models/outlet_partner_model");
const ApiFeatures=require('../utils/apifeatures')
const Outlet=require('../models/outlet_model')
const mongoose=require('mongoose')

const removeImg = require("../utils/imageRemove");

exports.createOutletPartner = async (req, res) => {
  try {
    const data = req.body;
    if (!req.file) {
      return res
        .status(400)
        .json({ status: "fail", message: "No image file provided" });
    }
    if (!data.firstName || !data.phoneNumber) {
      await removeImg(req.file.filename);
      return res
        .status(400)
        .json({ error: "Name and contact information are required" });
    }
    data.img = req.file.path;
    const newPartner = await OutletPartner.create(data);
    res.status(200).json({status:"success",newPartner});
  } catch (err) {
    await removeImg(req.file.filename);
    if (err.code === 11000) {
      // MongoDB duplicate key error
      return res.status(400).json({
        error: "Partner with this phone number or aadhar number already exists",
      });
    }
    res
      .status(500)
      .json({ error: "Failed to create driver", details: err.message });
  }
};

//get all partners

exports.getAllPartners = async (req, res) => {
  try {
    
    const apiFeatures = new ApiFeatures(OutletPartner.find(), req.query)
      .filtering()    // Apply filtering
      .paginaton()    // Apply pagination
      

    // Execute the modified query
    const partners = await apiFeatures.query;

    res.status(200).json({
      status: "success",
      code: 200,
      message: "All partners fetched successfully",
      data: partners,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to get partners", details: err.message });
  }
};

//get by id
exports.getPartner = async (req, res) => {
  try {
    let pid = req.params.id;
    const result = await OutletPartner.findById(pid);

    if (!result) return res.status(404).json({ error: "Partner not found" });

    res.status(200).json({ result });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to get driver", details: err.message });
  }
};

//update

exports.updatePartner = async (req, res) => {
  try {
    let pid = req.params.id;
    const updateData = req.body;

    const file = req.file ? req.file.path : null;

    const partner = await OutletPartner.findById(pid);
    if (!partner) {
      await removeImg(req.file.filename);
      return res.status(404).json({ error: "Outlet Partner not found" });
    }

    // Update the driver data
    if (file) {
      // Update the driver's image path
      updateData.img = file;
    }

    const result = await OutletPartner.findOneAndUpdate({_id:pid}, updateData, {
      new: true,
      runValidators: true
    });

    if (!result) return res.status(404).json({ error: "Partner not found" });

    // Remove old image file if it exists
    if (partner.img && file) {
      await removeImg(partner.img);
    }

    res.status(200).json({ result });
  } catch (err) {
     
    if (err.name == "ValidationError"){
      return res
      .status(400)
      .json({ error: "Vlidation error for parther (outletId should be unique) in use" });
    }

    if(req.file && req.file.filename)
       await removeImg(req.file.filename);
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ error: "Phone number or email already in use" });
    }
    res
      .status(500)
      .json({ error: "Failed to update OutletPartner", details: err.message });
  }
};

//delete Partner
exports.deletePartner = async (req, res) => {
  try {
    let pid = req.params.id;
    const pid2 = new mongoose.Types.ObjectId(pid)
    

    //check is outlet partner belongs to an outlet 
    const outlet= await Outlet.findOne({outletPartner:pid2 })
    if(outlet){
      return  res
      .status(500)
      .json({ status:"fail", error: `OutletPartner is assigned to outlet:${outlet.outletNumber} `});
     }
    
    const result = await OutletPartner.findByIdAndDelete(pid);
    if (!result) return res.status(404).json({ error: "Partner not found" });
     
    try{
    if (result.img) {
      await removeImg(result.img);
    }
  }catch{
   return res
      .status(200)
      .json({ status:"success",error: "Failed to delete OutletPartner image"});
  }
    
    res.status(200).json({ status:"success", message: "OutletPartner Deleted successfully!!" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete OutletPartner", details: err.message });
  }
};
