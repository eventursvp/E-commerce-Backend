const express = require('express');

const router = express.Router();

const {addBrand} = require('../controller/addBrand');
const {getOneBrand,getAllBrands} = require('../controller/getBrands');
const {updateBrand} = require('../controller/editBrand')
const {removeBrand} = require('../controller/removeBrand');




router.post('/addBrand',addBrand);
router.post('/getOneBrand',getOneBrand);
router.post('/getAllBrands',getAllBrands);


router.post('/updateBrand',updateBrand);
router.post('/removeBrand',removeBrand);






module.exports = router;
