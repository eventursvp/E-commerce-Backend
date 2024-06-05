const express = require('express');
const { jwtValidation } = require("model-hook/middleware/jwtValidation")

const router = express.Router();

const {addTermsAndCondition,addProductTermsAndCondition} = require('../controller/createT&C');
const {updateTermsAndCondition,updateProductTermsAndCondition} = require('../controller/updateT&C');

const {getTermsAndCondition, getProductTermsAndCondition} = require('../controller/getT&C');
const {deleteTermsAndCondtion,deleteProductTermsAndCondtion} = require('../controller/removeT&C');



router.post('/addTermsAndCondition',jwtValidation,addTermsAndCondition);
router.post('/updateTermsAndCondition',jwtValidation,updateTermsAndCondition);

router.post('/getTermsAndCondition',jwtValidation,getTermsAndCondition);
router.post('/deleteTermsAndCondtion',jwtValidation,deleteTermsAndCondtion);


//product

router.post('/addProductTermsAndCondition',jwtValidation,addProductTermsAndCondition);
router.post('/updateProductTermsAndCondition',jwtValidation,updateProductTermsAndCondition);

router.post('/getProductTermsAndCondition',jwtValidation,getProductTermsAndCondition);
router.post('/deleteProductTermsAndCondtion',jwtValidation,deleteProductTermsAndCondtion);




module.exports = router;