const mongoose = require("mongoose");
const Outlet = require("./outlet_model");
const customerSchema = new mongoose.Schema({
  customerId: {
    type: String,
    unique: true,
    required: true,  
  },
  customerName: {
    type: String,
    required: true,
  },
  businessName: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    unique: true,
    required: true,
  },
  outlet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Outlet",
    required: true,
  },
  img: String,

});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
