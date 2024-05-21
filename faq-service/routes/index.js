var express = require('express');
var router = express.Router();

router.use("/faqs", require("./faqRoutes"));


module.exports = router;
