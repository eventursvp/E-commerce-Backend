const express = require('express');

const router = express.Router();

const {createOffer} = require('../controller/createOffer');
const {getOffer,getAllOffers} = require('../controller/getOffer');



router.post('/createOffer',createOffer);
router.post('/getOffer',getOffer);
router.post('/getAllOffers',getAllOffers);



module.exports = router;