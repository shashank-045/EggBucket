var express = require("express");
const { createOutlet, deleteOutlet, updateOutlet, getAllOutlets } = require("../controllers/outlet_controller");
const multer = require('multer');

const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');

const router=express.Router()

// Image storage engine

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'outlets', // Folder where images will be stored in Cloudinary
         
      public_id: (req, file) => `${Date.now()}`, // Public ID (filename)
      transformation: [
        { width: 800, height: 600, crop: "limit" }, // Resize
        { quality: "auto:good" } // Automatically adjust quality
      ],
    },
    
  });

const upload = multer({ storage });


router.post("/egg-bucket-b2b/create-outlet",upload.single("img"),createOutlet);   
router.delete("/egg-bucket-b2b/delete-outlet/:id",deleteOutlet);
router.patch("/egg-bucket-b2b/update-outlet/:id",upload.single("img"),updateOutlet);
router.get("/egg-bucket-b2b/get-all-outlets",getAllOutlets);

module.exports = router;  
