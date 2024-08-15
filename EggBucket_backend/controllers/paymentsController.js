const Order = require('../models/order_model');
const Outlet = require('../models/outlet_model');
const OutletPartner = require('../models/outlet_partner_model');
const DeleveryDriver=require('../models/delivery_driver_model')


//// OutletPartner functions()

exports.incCollectionAmt = async (req, res) => {
  try {
    let { orderId, amount } = req.body;
    if (!orderId || !amount) {
      return res.status(400).json({
        status: "fail",
        data: "Please provide orderId & amount"
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        status: "fail",
        data: "Order not found"
      });
    }

    const outlet = await Outlet.findOne({ _id: order.outletId });
    if (!outlet) {
      return res.status(404).json({
        status: "fail",
        data: "Outlet not found"
      });
    }

    const outletPartner = await OutletPartner.findById(outlet.outletPartner);
    if (!outletPartner) {
      return res.status(404).json({
        status: "fail",
        data: "OutletPartner not found"
      });
    }

    // Find the payment object with matching deliveryId (dId) in payments array
    let paymentFound = false;
    outletPartner.payments.forEach(payment => {
      if (payment.dId === order.deliveryId.toString()) {
        payment.collectionAmt += amount;  // Increment collectionAmt by the amount from the request body
        paymentFound = true;
      }
    });

    if (!paymentFound) {
      return res.status(404).json({
        status: "fail",
        data: "Payment with the given deliveryId not found"
      });
    }
    
    
    // Save the updated outletPartner document
    await outletPartner.save();

    
    res.status(200).json({
      status: "success",
      message: "Collection amount updated successfully",
      outletPartner
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "An error occurred while updating the collection amount",
      error: error.message
    });
  }
};



exports.decCollectionAmt = async (req, res) => {
    try {
      let { orderId, amount } = req.body;
      if (!orderId || !amount) {
        return res.status(400).json({
          status: "fail",
          data: "Please provide orderId & amount"
        });
      }
  
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({
          status: "fail",
          data: "Order not found"
        });
      }
  
      const outlet = await Outlet.findOne({ _id: order.outletId });
      if (!outlet) {
        return res.status(404).json({
          status: "fail",
          data: "Outlet not found"
        });
      }
  
      const outletPartner = await OutletPartner.findById(outlet.outletPartner);
      if (!outletPartner) {
        return res.status(404).json({
          status: "fail",
          data: "OutletPartner not found"
        });
      }
  
      // Find the payment object with matching deliveryId (dId) in payments array
      let paymentFound = false;
      outletPartner.payments.forEach(payment => {
        if (payment.dId === order.deliveryId.toString()) {
          payment.collectionAmt -= amount;  // Increment collectionAmt by the amount from the request body
          paymentFound = true;
        }
      });
  
      if (!paymentFound) {
        return res.status(404).json({
          status: "fail",
          data: "Payment with the given deliveryId not found"
        });
      }
  
      //making order as completed
       order.status="completed"

      // Save the updated outletPartner & order document
      await outletPartner.save();
      await order.save();

      res.status(200).json({
        status: "success",
        message: "Collection amount updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        status: "fail",
        message: "An error occurred while updating the collection amount",
        error: error.message
      });
    }
  };





  ///////////////// DeleveryDriver functions()

  exports.incReturnAmt = async (req, res) => {
    try {
      let { orderId, amount } = req.body;
      if (!orderId || !amount) {
        return res.status(400).json({
          status: "fail",
          data: "Please provide orderId & amount"
        });
      }
  
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({
          status: "fail",
          data: "Order not found"
        });
      }
  
  
      const deleveryPartner = await DeleveryDriver.findOne({_id:order.deliveryId});
      if (!deleveryPartner) {
        return res.status(404).json({
          status: "fail",
          data: "DeleveryPartner not found"
        });
      }
  
      // Find the payment object with matching deliveryId (dId) in payments array
      let paymentFound = false;
      console.log(deleveryPartner)
      deleveryPartner.payments.forEach(payment => {
        if (payment.oId === order.outletId.toString()) {
          payment.returnAmt += amount;  // Increment collectionAmt by the amount from the request body
          paymentFound = true;
        }
      });
  
      if (!paymentFound) {
        return res.status(404).json({
          status: "fail",
          data: "Payment with the given OutletId not found"
        });
      }
      

      //setting order status as delevered 

      order.status='delivered'
      
      // Save the updated outletPartner & order document
      await deleveryPartner.save();
      await order.save();
      
      res.status(200).json({
        status: "success",
        message: "Return amount updated successfully",
        deleveryPartner
      });
    } catch (error) {
      res.status(500).json({
        status: "fail",
        message: "An error occurred while updating the Return amount",
        error: error.message
      });
    }
  };



  exports.decReturnAmt = async (req, res) => {
    try {
      let { orderId, amount } = req.body;
      if (!orderId || !amount) {
        return res.status(400).json({
          status: "fail",
          data: "Please provide orderId & amount"
        });
      }
  
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({
          status: "fail",
          data: "Order not found"
        });
      }
  
  
      const deleveryPartner = await DeleveryDriver.findOne({_id:order.deliveryId});
      if (!deleveryPartner) {
        return res.status(404).json({
          status: "fail",
          data: "DeleveryPartner not found"
        });
      }
  
      // Find the payment object with matching deliveryId (dId) in payments array
      let paymentFound = false;
      console.log(deleveryPartner)
      deleveryPartner.payments.forEach(payment => {
        if (payment.oId === order.outletId.toString()) {
          payment.returnAmt -= amount;  // Increment collectionAmt by the amount from the request body
          paymentFound = true;
        }
      });
  
      if (!paymentFound) {
        return res.status(404).json({
          status: "fail",
          data: "Payment with the given OutletId not found"
        });
      }
      
      
      // Save the updated outletPartner document
      await deleveryPartner.save();
     
      
      res.status(200).json({
        status: "success",
        message: "Return amount updated successfully",
        deleveryPartner
      });
    } catch (error) {
      res.status(500).json({
        status: "fail",
        message: "An error occurred while updating the Return amount",
        error: error.message
      });
    }
  };