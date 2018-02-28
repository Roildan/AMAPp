const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    name: String,
    address1: String,
    address2: String,
    postalCode: String,
    city: String,
    time: {
        hour: Number,
        minute: Number
    }
});

module.exports = mongoose.model("Address", addressSchema);
