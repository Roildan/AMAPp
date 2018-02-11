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
    }
};
