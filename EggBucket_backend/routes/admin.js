const {orderAggregate}=require('../controllers/admin_controller')
const express=require('express')
const router=express.Router()

router.get('/egg-bucket-b2b/dashboard',orderAggregate)

module.exports=router
