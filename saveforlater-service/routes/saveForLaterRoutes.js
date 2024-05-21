const express = require('express');

const router = express.Router();

const {addToSaveForLater,addToList} = require('../controller/createsaveforlater');
const {getAllSaveForLater} = require('../controller/getSavedForLater');
const {removeSaveForLater} = require('../controller/removeSaveForLater');



router.post('/addToSaveForLater',addToSaveForLater);
router.post('/addToList',addToList);

router.post('/getAllSaveForLater',getAllSaveForLater);
router.post('/removeSaveForLater',removeSaveForLater);




module.exports = router;