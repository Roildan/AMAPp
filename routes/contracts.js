var express = require("express"),
    router = express.Router();

var Contract = require("../models/contract");

// INDEX ROUTE
router.get("/", function(req, res) {
    Contract.find({}, function(err, contracts) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("contracts/index", { contracts: contracts });
        }
    });
});

// NEW ROUTE
router.get("/new", function(req, res) {
    res.render("contracts/new");
});

// SHOW ROUTE
router.get("/:id", function(req, res) {
    Contract.findById(req.params.id, function(err, contract) {
        if (err || !contract) {
            console.log(err);
            return res.redirect('/contracts');
        }

        res.render("contracts/show", { contract: contract });
    });
});



module.exports = router;
