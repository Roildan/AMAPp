const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    type: String,
    name: String,
    image: String,
    description: String,
    price: Number,
    disponibility: Number
});

module.exports = mongoose.model("Product", productSchema);
