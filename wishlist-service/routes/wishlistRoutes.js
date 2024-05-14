const express = require('express');

const router = express.Router();

const {addtoWishlist} = require('../controller/addToWishlist');
const {getAllWishlist} = require('../controller/getWishlist');
const {removeWishlist} = require('../controller/removeWishlist');

const {createCollection,addToCollection} = require('../controller/createCollection');
const {getOneWishlistCollection,getAllWishlistCollection} = require('../controller/getCollection');
const {removeWishlistCollection} = require('../controller/removeCollection')


router.post('/addtoWishlist',addtoWishlist);
router.post('/getAllWishlist',getAllWishlist);
router.post('/removeWishlist',removeWishlist);


router.post('/createCollection',createCollection);
router.post('/addToCollection',addToCollection);

router.post('/getOneCollection',getOneWishlistCollection);
router.post('/getAllCollection',getAllWishlistCollection);
router.post('/removeCollection',removeWishlistCollection);


module.exports = router;