const express = require('express');

const router = express.Router();

const {addToCart} = require('../controller/addCart');
const {getAllCart} = require('../controller/getCart');
const {updateCart} = require('../controller/updateCart')
const {removeCart} = require('../controller/removeCart');

router.post('/addToCart',addToCart);
router.post('/getAllCart',getAllCart);
router.post('/updateCart',updateCart);

router.post('/removeCart',removeCart);






module.exports = router;
