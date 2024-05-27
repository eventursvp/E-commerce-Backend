const express = require('express');
const { jwtValidation } = require("model-hook/middleware/jwtValidation")

const router = express.Router();

const {addProduct,publishProduct} = require('../controller/addProducts');
const {updateProduct} = require('../controller/updateProduct');
const {removeProduct,removeProductFromRecentView} = require('../controller/removeProduct');
const {getOneProduct,getAllProducts,compareProduct,getSimilarProducts,getRecentlyViewedProducts} = require('../controller/getProducts');


router.post('/addProduct',jwtValidation,addProduct);
router.post('/updateProduct',jwtValidation,updateProduct);
router.post('/RemoveProduct',jwtValidation,removeProduct);
router.post('/publishProduct',jwtValidation,publishProduct);

router.post('/getOneProduct',jwtValidation,getOneProduct);
router.post('/getAllProduct',jwtValidation,getAllProducts);
router.post('/compareProduct',jwtValidation,compareProduct);
router.post('/getSimilarProducts',jwtValidation,getSimilarProducts);
router.post('/getRecentlyViewedProducts',jwtValidation,getRecentlyViewedProducts);

router.post('/removeProductFromRecentView',jwtValidation,removeProductFromRecentView)









module.exports = router;
