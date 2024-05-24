const express = require('express');
const { jwtValidation } = require("model-hook/middleware/jwtValidation")

const router = express.Router();

const {addToSaveForLater,addToList} = require('../controller/createsaveforlater');
const {getAllSaveForLater} = require('../controller/getSavedForLater');
const {removeSaveForLater} = require('../controller/removeSaveForLater');



router.post('/addToSaveForLater',/*jwtValidation,*/addToSaveForLater);
router.post('/addToList',/*jwtValidation,*/addToList);

router.post('/getAllSaveForLater',/*jwtValidation,*/getAllSaveForLater);
router.post('/removeSaveForLater',/*jwtValidation,*/removeSaveForLater);




module.exports = router;