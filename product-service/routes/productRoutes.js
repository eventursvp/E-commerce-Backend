const express = require('express');

const router = express.Router();

const {addProduct,publishProduct} = require('../controller/addProducts');
const {updateProduct} = require('../controller/updateProduct');
const {removeProduct,removeProductFromRecentView} = require('../controller/removeProduct');
const {getOneProduct,getAllProducts,compareProduct,getSimilarProducts,getRecentlyViewedProducts} = require('../controller/getProducts');


router.post('/addProduct',addProduct);
router.post('/updateProduct',updateProduct);
router.post('/RemoveProduct',removeProduct);
router.post('/publishProduct',publishProduct);

router.post('/getOneProduct',getOneProduct);
router.post('/getAllProduct',getAllProducts);
router.post('/compareProduct',compareProduct);
router.post('/getSimilarProducts',getSimilarProducts);
router.post('/getRecentlyViewedProducts',getRecentlyViewedProducts);

router.post('/removeProductFromRecentView',removeProductFromRecentView)









module.exports = router;
