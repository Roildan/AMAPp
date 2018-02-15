const express = require("express"),
    router = express.Router();

const Product = require("../models/product");


router.get("/", function(req, res) {
    res.render("home");
});

router.get("/bulk", function(req, res) {
    Product.find({}, function(err, products) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("bulk", { products: products });
        }
    });
});

module.exports = router;
