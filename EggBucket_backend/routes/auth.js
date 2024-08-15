const {DriverLogin,OutletPratnerLogin} =require('../controllers/auth_controller')
const multer = require('multer');
const express=require('express')
const router=express.Router()

const upload = multer({ dest: 'uploads/' }); 

router.post('/egg-bucket-b2b/driverLogin',upload.any(),DriverLogin)
router.post('/egg-bucket-b2b/OutletPartnerLogin',upload.any(),OutletPratnerLogin)

module.exports=router