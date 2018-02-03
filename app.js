/////////////////
///   SETUP   ///
/////////////////
var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override");


// Set '.ejs' to the 'view' directory.
app.set("view engine", "ejs");
// Call for 'public' directory (CSS/Ressources).
app.use(express.static(__dirname + "/public"));
// Mendatory
app.use(bodyParser.urlencoded({ extended: true }));
// Tells method-override what pattern in the url it should look for
app.use(methodOverride("_method"));


//////////////////
///   ROUTES   ///
//////////////////
var indexRoutes = require("./routes/index");

app.use(indexRoutes);


////////////////////////
///   START SERVER   ///
////////////////////////
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("AMAPp Server started on " + process.env.IP + ":" + process.env.PORT);
});
