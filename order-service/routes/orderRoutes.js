const express = require('express');
const { jwtValidation } = require("model-hook/middleware/jwtValidation")

const router = express.Router();

const {createOrder} = require('../controller/createOrder');
const {getOrder,getAllOrders,getAdminOrders} = require('../controller/getOrder');
const {cancelOrder} = require('../controller/cancelOrder');

router.post('/createOrder',jwtValidation,createOrder);
router.post('/getOrder',jwtValidation,getOrder);
router.post('/getAllOrders',jwtValidation,getAllOrders);

router.post('/getAdminOrders',jwtValidation,getAdminOrders);

router.post('/cancelOrder',jwtValidation,cancelOrder);







module.exports = router;
