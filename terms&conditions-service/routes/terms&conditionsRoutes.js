const express = require('express');
const { jwtValidation } = require("model-hook/middleware/jwtValidation")

const router = express.Router();

const {addTermsAndCondition} = require('../controller/createT&C');
const {updateTermsAndCondition} = require('../controller/updateT&C');

const {getTermsAndCondition} = require('../controller/getT&C');
const {deleteTermsAndCondtion} = require('../controller/removeT&C');



router.post('/addTermsAndCondition',jwtValidation,addTermsAndCondition);
router.post('/updateTermsAndCondition',jwtValidation,updateTermsAndCondition);

router.post('/getTermsAndCondition',jwtValidation,getTermsAndCondition);
router.post('/deleteTermsAndCondtion',jwtValidation,deleteTermsAndCondtion);




module.exports = router;