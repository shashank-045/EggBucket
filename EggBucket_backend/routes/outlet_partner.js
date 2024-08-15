const {createOutletPartner, getAllPartners, getPartner, updatePartner, deletePartner}=require('../controllers/outlet_partner_controller')
const express = require("express");
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

router.post("/egg-bucket-b2b/create-outlet_partner", upload.single("img"), createOutletPartner);
router.get("/egg-bucket-b2b/displayAll-outlet_partner", getAllPartners);
router.route("/egg-bucket-b2b/outlet_partner/:id")
      .get(getPartner)
      .patch(upload.single("img"),updatePartner)
      .delete(deletePartner)  


module.exports = router;
