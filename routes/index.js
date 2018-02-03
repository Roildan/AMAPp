var express = require("express");
var router = express.Router();

router.get("/", function(req, res) {
    res.render("home");
});

router.get("/basket", function(req, res) {
    res.render("basket");
});

router.get("/bulk", function(req, res) {
    res.render("bulk");
});

module.exports = router;
