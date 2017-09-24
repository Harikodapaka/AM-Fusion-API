var express = require('express'),
Router = express.Router();

//routes for user
Router.use("/login", require("../controllers/auth.api"));


module.exports = Router;