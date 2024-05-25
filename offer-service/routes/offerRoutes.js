const express = require('express');
const { jwtValidation } = require("model-hook/middleware/jwtValidation")

const router = express.Router();

const {createOffer} = require('../controller/createOffer');
const {getOffer,getAllOffers} = require('../controller/getOffer');



router.post('/createOffer',/*jwtValidation,*/createOffer);
router.post('/getOffer',/*jwtValidation,*/getOffer);
router.post('/getAllOffers',/*jwtValidation,*/getAllOffers);



module.exports = router;