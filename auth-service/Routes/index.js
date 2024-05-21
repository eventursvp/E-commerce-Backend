const express = require('express');
const router = express.Router();

router.use("/users", require("./userRouter"))

module.exports = router;
