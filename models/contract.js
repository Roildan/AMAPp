const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    price: Number,
    disponibility: Number,
    producer: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    subscribedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
});

module.exports = mongoose.model("Contract", contractSchema);
