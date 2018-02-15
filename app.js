/////////////////
///   SETUP   ///
/////////////////
const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user");

// require("./seedDB")();

// Connection with DataBase
mongoose.connect("mongodb://localhost/amapp_v1");
// Set '.ejs' to the 'view' directory.
app.set("view engine", "ejs");
// Call for 'public' directory (CSS/Ressources).
app.use(express.static(__dirname + "/public"));
// Mendatory
app.use(bodyParser.urlencoded({ extended: true }));
// Tells method-override what pattern in the url it should look for
app.use(methodOverride("_method"));


//////////////////////////////////
///   PASSPORT CONFIGURATION   ///
//////////////////////////////////
app.use(require("express-session")({
    // Encoding string
    secret: "I want to break free !",
    resave: false, // Always
    saveUninitialized: false // Always
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// MiddleWare for every routes to give acces to user data
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});


//////////////////
///   ROUTES   ///
//////////////////
const indexRoutes = require("./routes/index"),
    userRoutes = require("./routes/users"),
    contractRoutes = require("./routes/contracts");


app.use(indexRoutes);
app.use(userRoutes);
app.use("/contracts", contractRoutes);


////////////////////////
///   START SERVER   ///
////////////////////////
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("AMApp Server started on " + process.env.IP + ":" + process.env.PORT);
});
