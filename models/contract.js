const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    price: Number,
    disponibility: Number

    /*
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }, */

});

module.exports = mongoose.model("Contract", contractSchema);
