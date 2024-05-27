const express = require('express');
const { jwtValidation } = require("model-hook/middleware/jwtValidation")

const router = express.Router();

const {addBrand} = require('../controller/addBrand');
const {getOneBrand,getAllBrands} = require('../controller/getBrands');
const {updateBrand} = require('../controller/editBrand')
const {removeBrand} = require('../controller/removeBrand');




router.post('/addBrand',jwtValidation,addBrand);
router.post('/getOneBrand',jwtValidation,getOneBrand);
router.post('/getAllBrands',jwtValidation,getAllBrands);


router.post('/updateBrand',jwtValidation,updateBrand);
router.post('/removeBrand',jwtValidation,removeBrand);






module.exports = router;
