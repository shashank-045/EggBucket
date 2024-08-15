const express = require('express');
const multer = require('multer');
const { 
  createEggbucketVendor, 
  getAllEggbucketVendors, 
  getEggbucketVendorById, 
  updateEggbucketVendor, 
  deleteEggbucketVendor 
} = require('../controllers/vendor_controller');

const router = express.Router();


const upload = multer({ dest: 'uploads/' }); 


router.post('/egg-bucket-b2b/create-vendor', upload.any(), createEggbucketVendor);
router.get('/egg-bucket-b2b/getAllVendor', getAllEggbucketVendors);
router.route('/egg-bucket-b2b/vendor/:id')
      .get(getEggbucketVendorById)
      .patch(upload.any(),updateEggbucketVendor)
      .delete(deleteEggbucketVendor);

module.exports = router;
