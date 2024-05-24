const express = require('express');
const { jwtValidation } = require("model-hook/middleware/jwtValidation")

const router = express.Router();

const {addtoWishlist} = require('../controller/addToWishlist');
const {getAllWishlist} = require('../controller/getWishlist');
const {removeWishlist} = require('../controller/removeWishlist');

const {createCollection,addToCollection} = require('../controller/createCollection');
const {getOneWishlistCollection,getAllWishlistCollection} = require('../controller/getCollection');
const {removeWishlistCollection} = require('../controller/removeCollection')


router.post('/addtoWishlist',/*jwtValidation,*/addtoWishlist);
router.post('/getAllWishlist',/*jwtValidation,*/getAllWishlist);
router.post('/removeWishlist',/*jwtValidation,*/removeWishlist);


router.post('/createCollection',/*jwtValidation,*/createCollection);
router.post('/addToCollection',/*jwtValidation,*/addToCollection);

router.post('/getOneCollection',/*jwtValidation,*/getOneWishlistCollection);
router.post('/getAllCollection',/*jwtValidation,*/getAllWishlistCollection);
router.post('/removeCollection',/*jwtValidation,*/removeWishlistCollection);


module.exports = router;