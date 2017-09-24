var express = require("express"),
router = express.Router(),
user = require("../models/user-model");

router.get("/", function (req, res) {
var obj = req.body;
var model = new user(obj);
model.save(function (err) {
    if (err) {
        res.send("error");
        return;
    }
    res.send("created");
});
})
module.exports = router;