const express = require("express"),
    router = express.Router();

const Contract = require("../models/contract");

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

// CREATE ROUTE
router.post("/", function(req, res) {
    var newContract = req.body.contract;
    newContract.producer = {
        id: req.user._id,
        username: req.user.username
    };
    console.log("contract :" + newContract);

    Contract.create(newContract, function(err, contract) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Newly created contract :" + contract);
        }
    });

    res.redirect("/contracts");
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
