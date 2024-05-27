const express = require('express');
const { jwtValidation } = require("model-hook/middleware/jwtValidation")

const router = express.Router();

const {addGift} = require('../controller/addGift');




router.post('/addGift',jwtValidation,addGift);






module.exports = router;
