const Contract = require("../models/contract");

module.exports = {

    isLoggedIn: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash(
            "error",
            "You need to be logged in to do that\nPlease, log in or register before trying again"
        );
        res.redirect("/login");
    },

    isProducer: function(req, res, next) {
        if (req.user.isProducer || req.user.isAdmin) {
            return next();
        }
        req.flash(
            "error",
            "You're not authorized to do that\nPlease, log in with the appropriate authorizarion or contact an admin"
        );
        res.redirect("back");
    },

    isAdmin: function(req, res, next) {
        if (req.user.isAdmin) {
            return next();
        }
        req.flash(
            "error",
            "You're not authorized to do that\nPlease, log in with the appropriate authorization or contact an admin"
        );
        res.redirect("back");
    },

    checkContractOwnership: function(req, res, next) {
        Contract.findById(req.params.id, function(err, contract) {
            if (err || !contract) {
                console.log(err);
                req.flash(
                    "error",
                    "This contract cannot be found\nAn error has occurred finding this contract, please contact an admin for more info"
                );
                res.redirect("back");
            }
            else if (req.user.isAdmin || contract.producer.id.equals(req.user._id)) {
                return next();
            }
            req.flash(
                "error",
                "You're not authorized to do that\nPlease, log in with the appropriate authorizarion or contact an admin"
            );
            res.redirect("back");
        });
    }
};
