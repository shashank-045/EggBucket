const express = require('express');
const multer = require('multer');
const { 
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder
} = require('../controllers/order_controller');

const router = express.Router();


const upload = multer({ dest: 'uploads/' }); 


router.post('/egg-bucket-b2b/create-order', upload.any(), createOrder);
router.get('/egg-bucket-b2b/getAllOrder', getAllOrders);
router.route('/egg-bucket-b2b/order/:id')
      .get(getOrderById)
     .patch(upload.any(),updateOrder)
     .delete(deleteOrder);

module.exports = router;
