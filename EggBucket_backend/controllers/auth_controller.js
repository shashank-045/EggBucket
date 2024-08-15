const jwt=require('jsonwebtoken')
const Driver=require('../models/delivery_driver_model')
const OutletPratner=require('../models/outlet_partner_model')

const signToken=(id)=>{
    return jwt.sign({id},process.env.secrete,{
      expiresIn:process.env.expire
    })
  }
  
  const createJwtAndSend=(user,statusCode,res)=>{
    let token=signToken(user._id)
    
    res.status(statusCode).json({
      status: "success",
      token,
      user
    });
  }


  exports.DriverLogin=async(req,res)=>{
  
    const {phone,pass}=req.body
  
    if(!phone || !pass) 
      return res.status(400).json({
           status:"fail",data:"please enter phoneNo and password"})
    
    
    else{
      let match=await Driver.findOne({phoneNumber:phone}).select('+password') 
      
  
      if(!match || !(match.password==pass))
        return res.status(401).json({
          status:"fail",data:"invalid phoneNumber or password"})
      
      createJwtAndSend(match,200,res)
     
    
    }
  }

  exports.OutletPratnerLogin=async(req,res)=>{
  
    const {phone,pass}=req.body
  
    if(!phone || !pass) 
      return res.status(400).json({
           status:"fail",data:"please enter phoneNo and password"})
    
    
    else{
      let match=await OutletPratner.findOne({phoneNumber:phone}).select('+password') 
      
  
      if(!match || !(match.password==pass))
        return res.status(401).json({
          status:"fail",data:"invalid PhoneNumber or password"})
      
      createJwtAndSend(match,200,res)
     
    
    }
  }