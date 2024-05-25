const express = require('express');
const { jwtValidation } = require("model-hook/middleware/jwtValidation")

const router = express.Router();

const {createCoupon} = require('../controller/createCoupon');
const {getOneCoupon,getAllCoupons} = require('../controller/getCoupon');
const {updateCoupon,updateCouponStatus} = require('../controller/updateCoupon')
const {removeCoupon} = require('../controller/removeCoupon');




router.post('/createCoupon',jwtValidation,createCoupon);
router.post('/getOneCoupon',jwtValidation,getOneCoupon);
router.post('/getAllCoupons',jwtValidation,getAllCoupons);


router.post('/updateCoupon',jwtValidation,updateCoupon);
router.post('/updateCouponStatus',jwtValidation,updateCouponStatus);

router.post('/removeCoupon',jwtValidation,removeCoupon);





module.exports = router;