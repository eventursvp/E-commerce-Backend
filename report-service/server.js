const express = require('express');
const bodyParser = require('body-parser');
const app = express()
const port = process.env.PORT || 5011
const routes = require('./routes/index');
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const mongoSanitize = require('express-mongo-sanitize');
const xss = require("xss-clean");
const rateLimit = require('express-rate-limit');

require("dotenv").config();
require("../model-hook/middleware/connectDb");


app.use(cors());
app.options('*', cors());
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'trusted-scripts.com'],
  },
  crossOriginEmbedderPolicy: false,

}));
app.use(mongoSanitize());
app.use(xss());

//Protects against brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, 
  standardHeaders: 'draft-7', 
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  message: {
    status: 429,
    error: 'Too many requests, please try again later.'
  }
});
app.use(limiter); 

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use(routes)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
});
