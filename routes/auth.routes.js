var express = require('express'),
Router = express.Router();

//routes for user
Router.use("/", require("../controllers/authController"));


module.exports = Router;