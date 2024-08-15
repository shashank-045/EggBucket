const mongoose = require('mongoose');

const deliveryDriverSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    
  },
  driverLicenceNumber: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select:false
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  img:String,
  payments: [
    {
      oId: String,
      returnAmt:Number
    }
  ],
});

const deliveryPartner = mongoose.model('deliveryPartner', deliveryDriverSchema); // Updated model name

module.exports = deliveryPartner;
