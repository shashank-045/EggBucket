const mongoose = require("mongoose");

const Outlet = require("./outlet_model");
const EggbucketVendor = require("./egg_bucket_vendor_model");
const deliveryPartner = require("./delivery_driver_model");
const Customer = require("./customer_model");

const OrderSchema = new mongoose.Schema(
  {
    outletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Outlet,
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Customer,
      required: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: EggbucketVendor,
    },
    deliveryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: deliveryPartner,
      required: true,
    },
    numTrays: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    isUrgent: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["intransit", "pending", "cancelled", "completed", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
