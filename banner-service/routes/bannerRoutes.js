const express = require('express');

const router = express.Router();

const {addBanner} = require('../controller/addBanner');
const {getOneBanner,getAllBanners} = require('../controller/getBanner');
const {updateBanner} = require('../controller/editBanner')
const {removeBanner} = require('../controller/removeBanner');




router.post('/addBanner',addBanner);
router.post('/getOneBanner',getOneBanner);
router.post('/getAllBanners',getAllBanners);


router.post('/updateBanner',updateBanner);
router.post('/removeBanner',removeBanner);






module.exports = router;
