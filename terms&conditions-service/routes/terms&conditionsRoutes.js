const express = require('express');

const router = express.Router();

const {addTermsAndCondition} = require('../controller/createT&C');
const {updateTermsAndCondition} = require('../controller/updateT&C');

const {getTermsAndCondition} = require('../controller/getT&C');
const {deleteTermsAndCondtion} = require('../controller/removeT&C');



router.post('/addTermsAndCondition',addTermsAndCondition);
router.post('/updateTermsAndCondition',updateTermsAndCondition);

router.post('/getTermsAndCondition',getTermsAndCondition);
router.post('/deleteTermsAndCondtion',deleteTermsAndCondtion);




module.exports = router;