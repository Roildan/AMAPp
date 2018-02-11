const Contract = require("../models/contract");

module.exports = {

    isLoggedIn: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect("/login");
    },

    isProducer: function(req, res, next) {
        if (req.user.isProducer || req.user.isAdmin) {
            return next();
        }
        res.redirect("back");
    },

    isAdmin: function(req, res, next) {
        if (req.user.isAdmin) {
            return next();
        }
        res.redirect("back");
    },

    checkContractOwnership: function(req, res, next) {
        Contract.findById(req.params.id, function(err, contract) {
            if (err || !contract) {
                console.log(err);
                res.redirect("back");
            }
            else if (contract.producer.id.equals(req.user._id)) {
                next();
            }
            else {
                res.redirect("back");
            }
        });
    }
};
