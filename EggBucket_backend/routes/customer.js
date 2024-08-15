const {createCustomer,getAllCustomers,getCustomerById,updateCustomer,deleteCustomer}=require('../controllers/customer_controller')
const express = require("express");
const multer = require('multer');

const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');

const router=express.Router()

// Image storage engine

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'customers', // Folder where images will be stored in Cloudinary
   
      public_id: (req, file) => `${Date.now()}`, // Public ID (filename)
      transformation: [
        { width: 800, height: 600, crop: "limit" }, // Resize
        { quality: "auto:good" } // Automatically adjust quality
      ],
    },
    
  });

// const storage = multer.diskStorage({
//     destination: "uploads/customer",
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`);
//     }
// });

const upload = multer({ storage });

router.post('/egg-bucket-b2b/create-customer',upload.single("img"),createCustomer)
router.get('/egg-bucket-b2b/getAllCustomer',getAllCustomers)
router.route('/egg-bucket-b2b/customer/:id')
      .get(getCustomerById)
      .patch(upload.single("img"),updateCustomer)
      .delete(deleteCustomer)

module.exports=router