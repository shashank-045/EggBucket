const {incCollectionAmt, decCollectionAmt, incReturnAmt, decReturnAmt}=require('../controllers/paymentsController')
const express=require('express')

const router=express.Router()

router.patch('/egg-bucket-b2b/incCollectionAmt',incCollectionAmt)
router.patch('/egg-bucket-b2b/decCollectionAmt',decCollectionAmt)
router.patch('/egg-bucket-b2b/incReturnAmt',incReturnAmt)
router.patch('/egg-bucket-b2b/decReturnAmt',decReturnAmt)
module.exports=router