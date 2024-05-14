var express = require('express');
var router = express.Router();

router.use("/wishlist", require("./wishlistRoutes"));


module.exports = router;
