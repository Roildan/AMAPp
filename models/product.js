var mongoose = require("mongoose");

var productSchema = new mongoose.Schema({
    type: String,
    name: String,
    image: String,
    description: String,
    price: Number,
    disponibility: Number
});

module.exports = mongoose.model("Product", productSchema);
