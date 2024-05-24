const express = require('express');
const { jwtValidation } = require("model-hook/middleware/jwtValidation")

const router = express.Router();

const {createFaq} = require('../controller/createFaqs');
const {getAllFaqs,getSingleFaq} = require('../controller/getFaqs');
const {updateFaqQuestion} = require('../controller/updateFaq')
const {removeFaqQuestion,removeFaq} = require('../controller/removeFaqs');




router.post('/createFaq',/*jwtValidation,*/createFaq);
router.post('/getAllFaqs',/*jwtValidation,*/getAllFaqs);
router.post('/getSingleFaq',/*jwtValidation,*/getSingleFaq);


router.post('/updateFaqQuestion',/*jwtValidation,*/updateFaqQuestion);
router.post('/removeFaqQuestion',/*jwtValidation,*/removeFaqQuestion);
router.post('/removeFaq',/*jwtValidation,*/removeFaq);







module.exports = router;
