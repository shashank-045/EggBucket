const {createDeliveryDriver,getAllDeliveryDrivers,getDeliveryDriverById,updateDeliveryDriver,deleteDeliveryDriver}=require('../controllers/delivery_driver_controller')
const express = require("express");
const multer = require('multer');

const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');

const router=express.Router()

// Image storage engine

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'drivers', // Folder where images will be stored in Cloudinary
     
      public_id: (req, file) => `${Date.now()}`, // Public ID (filename)
      transformation: [
        { width: 800, height: 600, crop: "limit" }, // Resize
        { quality: "auto:good" } // Automatically adjust quality
      ],
    },
    
  });
  
  const upload = multer({ storage });



router.post("/egg-bucket-b2b/create-delivery_partner", upload.single("img"), createDeliveryDriver);
router.get("/egg-bucket-b2b/displayAll-delivery_partner", getAllDeliveryDrivers);
router.route("/egg-bucket-b2b/delivery_partner/:id")
      .get(getDeliveryDriverById)
      .patch(upload.single("img"),updateDeliveryDriver)
      .delete(deleteDeliveryDriver)  


module.exports = router;
