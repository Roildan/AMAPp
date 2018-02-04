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

////////////////
///   DATA   ///
////////////////

var products = [
    {
        name: "Carrot",
        img: "https://images.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.Z6S0wQ81H7iNGsH9CjqjFwHaE8%26pid%3D15.1&f=1",
        desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et dolore labore aspernatur itaque nobis dignissimos maxime praesentium, quam vero sit facilis, perspiciatis recusandae explicabo assumenda sed ipsam blanditiis doloribus saepe!"
    },
    {
        name: "Honey",
        img: "https://images.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.MrJ7a2lttwi7vvgxJOlq9wHaHa%26pid%3D15.1&f=1",
        desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et dolore labore aspernatur itaque nobis dignissimos maxime praesentium, quam vero sit facilis, perspiciatis recusandae explicabo assumenda sed ipsam blanditiis doloribus saepe!"
    },
    {
        name: "Cheese",
        img: "https://images.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.G9y5uy7QcRh7e0pmz5j6hgHaFj%26pid%3D15.1&f=1",
        desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et dolore labore aspernatur itaque nobis dignissimos maxime praesentium, quam vero sit facilis, perspiciatis recusandae explicabo assumenda sed ipsam blanditiis doloribus saepe!"
    },
    {
        name: "Carrot",
        img: "https://images.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.Z6S0wQ81H7iNGsH9CjqjFwHaE8%26pid%3D15.1&f=1",
        desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et dolore labore aspernatur itaque nobis dignissimos maxime praesentium, quam vero sit facilis, perspiciatis recusandae explicabo assumenda sed ipsam blanditiis doloribus saepe!"
    },
    {
        name: "Honey",
        img: "https://images.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.MrJ7a2lttwi7vvgxJOlq9wHaHa%26pid%3D15.1&f=1",
        desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et dolore labore aspernatur itaque nobis dignissimos maxime praesentium, quam vero sit facilis, perspiciatis recusandae explicabo assumenda sed ipsam blanditiis doloribus saepe!"
    },
    {
        name: "Cheese",
        img: "https://images.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.G9y5uy7QcRh7e0pmz5j6hgHaFj%26pid%3D15.1&f=1",
        desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et dolore labore aspernatur itaque nobis dignissimos maxime praesentium, quam vero sit facilis, perspiciatis recusandae explicabo assumenda sed ipsam blanditiis doloribus saepe!"
    }
];


//////////////////
///   ROUTES   ///
//////////////////
//var indexRoutes = require("./routes/index");
//app.use(indexRoutes);

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/basket", function(req, res) {
    res.render("basket");
});

app.get("/bulk", function(req, res) {
    res.render("bulk", { products: products });
});


////////////////////////
///   START SERVER   ///
////////////////////////
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("AMAPp Server started on " + process.env.IP + ":" + process.env.PORT);
});
