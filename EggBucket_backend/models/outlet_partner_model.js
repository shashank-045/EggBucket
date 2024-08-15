const mongoose = require("mongoose");

const outletPartnerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },

  phoneNumber: { type: String, required: true, unique: true },

  aadharNumber: {
    type: String,
    required:true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
    select:false
  },
  img: String,
  payments: [
    {
      dId: String,
      collectionAmt:Number
    }
  ],
  
  outletId: {
    type: String,
    default: "free",
    // validate: {
    //   validator: async function(value) {
    //     // Skip validation for default "free" value
    //     if (value === "free") {
    //       console.log('free')
    //       return true; // Allow "free" to be non-unique
          
    //     }
         
    //     // Check if another document with the same outletId exists
    //     const count = await mongoose.models.OutletPartner.countDocuments({ outletId: value });
    //     console.log(count)
    //     // Return false if another document with the same outletId is found
    //     return count === 0;
    //   },
    //   message: 'The outletId "{VALUE}" is already taken. Please use a unique value.'
    // }
  }
});

const OutletPartner = mongoose.model("OutletPartner", outletPartnerSchema);

module.exports = OutletPartner;
