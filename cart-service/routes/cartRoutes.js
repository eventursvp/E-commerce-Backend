const express = require('express');
const { jwtValidation } = require("model-hook/middleware/jwtValidation")

const router = express.Router();

const {addToCart} = require('../controller/addCart');
const {getAllCart} = require('../controller/getCart');
const {updateCart} = require('../controller/updateCart')
const {removeCart} = require('../controller/removeCart');

router.post('/addToCart',/*jwtValidation,*/addToCart);
router.post('/getAllCart',/*jwtValidation,*/getAllCart);
router.post('/updateCart',/*jwtValidation,*/updateCart);

router.post('/removeCart',/*jwtValidation,*/removeCart);






module.exports = router;
