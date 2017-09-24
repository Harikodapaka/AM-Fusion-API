var express = require('express'),
Router = express.Router();

//routes for user api
Router.use("/users", require("../controllers/main.api"));

module.exports = Router;