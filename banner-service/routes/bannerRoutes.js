const express = require('express');
const { jwtValidation } = require("model-hook/middleware/jwtValidation")

const router = express.Router();

const {addBanner} = require('../controller/addBanner');
const {getOneBanner,getAllBanners} = require('../controller/getBanner');
const {updateBanner} = require('../controller/editBanner')
const {removeBanner} = require('../controller/removeBanner');




router.post('/addBanner',jwtValidation,addBanner);
router.post('/getOneBanner',jwtValidation,getOneBanner);
router.post('/getAllBanners',jwtValidation,getAllBanners);


router.post('/updateBanner',jwtValidation,updateBanner);
router.post('/removeBanner',jwtValidation,removeBanner);






module.exports = router;
