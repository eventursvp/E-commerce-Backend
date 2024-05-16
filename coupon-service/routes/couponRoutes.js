const express = require('express');

const router = express.Router();

const {createCoupon} = require('../controller/createCoupon');
const {getOneCoupon,getAllCoupons} = require('../controller/getCoupon');
const {updateCoupon,updateCouponStatus} = require('../controller/updateCoupon')
const {removeCoupon} = require('../controller/removeCoupon');




router.post('/createCoupon',createCoupon);
router.post('/getOneCoupon',getOneCoupon);
router.post('/getAllCoupons',getAllCoupons);


router.post('/updateCoupon',updateCoupon);
router.post('/updateCouponStatus',updateCouponStatus);

router.post('/removeCoupon',removeCoupon);

// router.post('/removeFaq',removeFaq);







module.exports = router;
