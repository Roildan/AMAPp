const express = require("express"),
    router = express.Router();

const Contract = require("../models/contract"),
    middleWare = require("../middleware")

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
router.get("/new", middleWare.isLoggedIn, middleWare.isProducer, function(req, res) {
    res.render("contracts/new");
});

// CREATE ROUTE
router.post("/", middleWare.isLoggedIn, middleWare.isProducer, function(req, res) {
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

// EDIT ROUTE
router.get("/:id/edit", middleWare.isLoggedIn, middleWare.checkContractOwnership, function(req, res) {
    Contract.findById(req.params.id, function(err, contract) {
        if (err) {
            console.log(err);
            res.redirect("/contracts");
        }
        else {
            res.render("contracts/edit", { contract: contract });
        }
    });
});

// UPDATE ROUTE
router.put("/:id", middleWare.isLoggedIn, middleWare.checkContractOwnership, function(req, res) {
    Contract.findByIdAndUpdate(req.params.id, req.body.contract, function(err, contract) {
        if (err) {
            console.log(err);
            res.redirect("/contracts");
        }
        else {
            res.redirect("/contracts/" + req.params.id);
        }
    });
});

// DESTROY ROUTE
router.delete("/:id", middleWare.isLoggedIn, middleWare.checkContractOwnership, function(req, res) {
    Contract.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err);
            res.redirect("back");
        }
        else {
            res.redirect("/contracts");
        }
    });
});

// SUBSCRIBING ROUTE
router.put("/:id/subscribe", middleWare.isLoggedIn, function(req, res) {
    Contract.findById(req.params.id, function(err, contract) {
        if (err) {
            console.log(err);
            res.redirect("back");
        }
        else {
            // Check disponibility
            if (contract.disponibility < contract.subscribedUsers.length) {
                console.log("This contract have reach his maximum capacity");
                return res.redirect("back");
            }

            // Check if not already subscribed
            for (let i = 0; i < contract.subscribedUsers.length; i++) {
                if (contract.subscribedUsers[i].equals(req.user._id)) {
                    console.log("You are already subscribed to this contract");
                    return res.redirect("back");
                }
            }

            contract.subscribedUsers.push(req.user._id);
            contract.save();
            req.user.subscribedContracts.push(contract._id);
            req.user.save();
            res.redirect("/contracts/" + req.params.id);
        }
    });
});



module.exports = router;
