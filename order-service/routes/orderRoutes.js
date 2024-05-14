const express = require('express');

const router = express.Router();

const {createOrder} = require('../controller/createOrder');
const {getOrder,getAllOrders,getAdminOrders} = require('../controller/getOrder');
const {cancelOrder} = require('../controller/cancelOrder');

router.post('/createOrder',createOrder);
router.post('/getOrder',getOrder);
router.post('/getAllOrders',getAllOrders);

router.post('/getAdminOrders',getAdminOrders);

router.post('/cancelOrder',cancelOrder);







module.exports = router;
