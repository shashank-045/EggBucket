const Order = require("../models/order_model");
const OutletPartner=require('../models/outlet_partner_model')
const Driver=require('../models/delivery_driver_model')
const Outlet=require('../models/outlet_model')
const ApiFeatures=require('../utils/apifeatures')

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const orderData = req.body;

    // Basic validation (add more as needed)

    if (!orderData.outletId || !orderData.customerId || !orderData.deliveryId || !orderData.numTrays || !orderData.amount) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    const newOrder = await Order.create(orderData);

    //
    

    
    // Fetch the OutletPartner ID using the Outlet collection
    const outlet = await Outlet.findById(orderData.outletId)

    if (!outlet || !outlet.outletPartner) {
      return res.status(404).json({ error: "OutletPartner not found for the given outlet" });
    }

    // Find the OutletPartner driver document
    const outletPartner = await OutletPartner.findById(outlet.outletPartner);
    const deliveryDriver=await Driver.findById(orderData.deliveryId)
    if (!outletPartner || !deliveryDriver) {
      return res.status(404).json({ error: "OutletPartner or Delevery driver document not found" });
    }
    
    // Check if the payment with the same dId already exists
    const existingPayment = outletPartner.payments.some(payment => payment.dId === orderData.deliveryId);
    const existingPayment1=deliveryDriver.payments.some(payment => payment.oId === orderData.outletId);
    if (!existingPayment) {
      // If no existing payment, add the new payment
      outletPartner.payments.push({ dId: orderData.deliveryId, collectionAmt: 0 });
      await outletPartner.save();
    }
    if (!existingPayment1) {
      // If no existing payment, add the new payment
      deliveryDriver.payments.push({ oId: orderData.outletId, returnAmt: 0 });
      await deliveryDriver.save();
    }


    //

    res.status(201).json({status:"success",newOrder});
  } catch (err) {
    res.status(500).json({ error: "Failed to create order", details: err.message });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    // Initialize the ApiFeatures with the Order query and the request's query parameters
    const apiFeatures = new ApiFeatures(Order.find(), req.query)
      .filtering()    
      .paginaton()   
         

    // Apply population after other query methods
    const orders = await apiFeatures.query
      .populate({ path: "outletId", select: "_id outletNumber phoneNumber" })
      .populate({ path: "customerId", select: "_id customerId customerName phoneNumber" })
      .populate({ path: "vendorId", select: "_id vendorName phoneNumber" })
      .populate({ path: "deliveryId", select: "_id firstName phoneNumber" });

    res.json(orders);
    
  } catch (err) {
    res.status(500).json({ error: "Failed to get orders", details: err.message });
  }
};

// Get an order by ID
exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId)
    .populate({ path: "outletId", select: "_id outletNumber phoneNumber"}) 
    .populate({ path: "customerId", select: "_id customerId customerName phoneNumber" })
    .populate({ path: "vendorId", select: "_id vendorName phoneNumber" })
    .populate({ path: "deliveryId", select: "_id firstName phoneNumber" });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to get order", details: err.message });
  }
};

// Update an order by ID
exports.updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const updateData = req.body;

    const order = await Order.findByIdAndUpdate(orderId, updateData, { new: true })

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to update order", details: err.message });
  }
};

// Delete an order by ID
exports.deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findByIdAndDelete(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete order", details: err.message });
  }
};
