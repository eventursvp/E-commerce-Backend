const express = require('express');
const router = express.Router();

router.use("/delivery", require("./deliveryRouter"))

module.exports = router;
