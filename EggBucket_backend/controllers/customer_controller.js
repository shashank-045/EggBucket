const Customer = require("../models/customer_model");
const ApiFeatures=require('../utils/apifeatures')


const removeImg=require('../utils/imageRemove')

exports.createCustomer=async (req,res)=>{
try{
   const data=req.body;
   if (!req.file) {
    return res.status(400).json({ status: "fail", message: "No image file provided" });
    }

    if (!data.customerName  ||!data.customerId ||!data.location ||!data. phoneNumber ||!data.outlet) {
        await removeImg(req.file.path)
        return res
          .status(400)
          .json({ error: "Name,customerId,location,phoneNo and Outlet are required" });
      }
      data.img=req.file.path
     const newCustomer = await Customer.create(data);
    res.status(201).json({status:"success",
      newCustomer});

}catch (err) {
   await removeImg(req.file.path)
    if (err.code === 11000) {
      // MongoDB duplicate key error
      return res
        .status(400)
        .json({
          error: "Customer with this phone number or CustomerId exists",
        });
    }
    res
      .status(500)
      .json({ error: "Failed to create Customer", details: err.message });
  }
};

exports.getAllCustomers = async (req, res) => {
  try {
    
    const apiFeatures = new ApiFeatures(Customer.find(), req.query)
      .filtering()    // Apply filtering
      .paginaton()    // Apply pagination
      
    // Apply population after other query methods
    const Customers = await apiFeatures.query.populate('outlet');

    res.json(Customers);
    
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to get Customers", details: err.message });
  }
};


  exports.getCustomerById = async (req, res) => {
    try {
      const CId = req.params.id;
      const result = await Customer.findById(CId).populate('outlet');
  
      if (!result) {
        return res.status(404).json({ error: "Customer not found" });
      }
  
      res.json(result);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Failed to get Customer", details: err.message });
    }
  };

  exports.updateCustomer = async (req, res) => {
    try {
      const CId = req.params.id;
      const updateData = req.body;
      console.log(req.body)
      // Check if there is a file upload
      const file = req.file ? req.file.path : null;
  
      const customer = await Customer.findById(CId);
      if (!customer) {
        await removeImg(req.file.path)
        return res.status(404).json({ error: "Customer not found" });
      }
  
      // Update the driver data
      if (file) {
        // Update the driver's image path
        updateData.img = file;
      
      }
  
      // Update the driver with new data
      const updatedCustomer = await Customer.findByIdAndUpdate(CId, updateData, { new: true });
     
      
      //remove old img
      if (customer.img && file) {
        await removeImg(customer.img)
      }
  
      res.json(updatedCustomer);
    } catch (err) {
      if(req.file && req.file.path)
        await removeImg(req.file.path)
      // Handle duplicate key errors
      if (err.code === 11000) {
        return res.status(400).json({ error: "Phone number or CustomerId already in use" });
      }
      res.status(500).json({ error: "Failed to update Customer", details: err.message });
    }
  };


  exports.deleteCustomer = async (req, res) => {
    try {
      const CId = req.params.id;
      const customer = await Customer.findByIdAndDelete(CId);
  
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
  
      // Remove image file if it exists
      if (customer.img) {
        await removeImg(customer.img)
      }
  
      res.status(200).json({ message: "Customer deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete Customer", details: err.message });
    }
  };
  