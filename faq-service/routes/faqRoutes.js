const express = require('express');

const router = express.Router();

const {createFaq} = require('../controller/createFaqs');
const {getAllFaqs,getSingleFaq} = require('../controller/getFaqs');
const {updateFaqQuestion} = require('../controller/updateFaq')
const {removeFaqQuestion,removeFaq} = require('../controller/removeFaqs');




router.post('/createFaq',createFaq);
router.post('/getAllFaqs',getAllFaqs);
router.post('/getSingleFaq',getSingleFaq);


router.post('/updateFaqQuestion',updateFaqQuestion);
router.post('/removeFaqQuestion',removeFaqQuestion);
router.post('/removeFaq',removeFaq);







module.exports = router;
