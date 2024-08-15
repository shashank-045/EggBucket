const DeliveryDriver = require("../models/delivery_driver_model");
const ApiFeatures=require('../utils/apifeatures')
  
const removeImg =require('../utils/imageRemove')



// Create a new delivery driver   
exports.createDeliveryDriver = async (req, res) => {
  try {
    const driverData = req.body;

    if (!req.file) {
      return res.status(400).json({ status: "fail", message: "No image file provided" });
  }
    // Basic Validation (Add more as needed)
    if (!driverData.firstName || !driverData.lastName  || !driverData.phoneNumber) {
      await removeImg(req.file.path)
      return res
        .status(400)
        .json({ error: "Name and phone number are required" });  
    }
    driverData.img=req.file.path
    const newDriver = await DeliveryDriver.create(driverData);
    res.status(201).json({status:"success",newDriver});

  } catch (err) {
    
    await removeImg(req.file.path)
    if (err.code === 11000) {
      // MongoDB duplicate key error
      return res
        .status(400)
        .json({
          error: err,
        });
    }
    res
      .status(500)
      .json({ error: "Failed to create driver", details: err.message });
  }
};



exports.getAllDeliveryDrivers = async (req, res) => {
  try {
    
    const apiFeatures = new ApiFeatures(DeliveryDriver.find(), req.query)
      .filtering()    // Apply filtering
      .paginaton()

    // Execute the modified query
    const drivers = await apiFeatures.query;

    res.json(drivers);
    
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to get drivers", details: err.message });
  }
};


// Get a driver by ID
exports.getDeliveryDriverById = async (req, res) => {
  try {
    const driverId = req.params.id;
    const driver = await DeliveryDriver.findById(driverId);

    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }

    res.json(driver);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to get driver", details: err.message });
  }
};

// Update a driver by ID
exports.updateDeliveryDriver = async (req, res) => {
  try {
    const driverId = req.params.id;
    const updateData = req.body;

    // Check if there is a file upload
    const file = req.file ? req.file.path : null;

    // Find the driver and update
    const driver = await DeliveryDriver.findById(driverId);
    if (!driver) {
      await removeImg(req.file.path)
      return res.status(404).json({ error: "Driver not found" });
    }

    // Update the driver data
    if (file) {
      // Update the driver's image path
      updateData.img = file;
    }

    // Update the driver with new data
    const updatedDriver = await DeliveryDriver.findByIdAndUpdate(driverId, updateData, { new: true });
   
    
    //remove old img
    if (driver.img && file) {
      await removeImg(driver.img)
    }

    res.json(updatedDriver);
  } catch (err) {
    if(req.file && req.file.path)
    await removeImg(req.file.path)
    // Handle duplicate key errors
    if (err.code === 11000) {
      return res.status(400).json({ error: "Phone number or email already in use" });
    }
    res.status(500).json({ error: "Failed to update driver", details: err.message });
  }
};


// Delete a driver by ID
exports.deleteDeliveryDriver = async (req, res) => {
  try {
    const driverId = req.params.id;
    const driver = await DeliveryDriver.findByIdAndDelete(driverId);

    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }

    // Remove image file if it exists
    if (driver.img) {
      await removeImg(driver.img)
    }

    res.status(200).json({ message: "Driver deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete driver", details: err.message });
  }
};
