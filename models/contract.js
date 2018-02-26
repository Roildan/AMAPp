const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    price: Number,
    disponibility: Number,

    delivery: {
        // Per month
        frequency: Number,
        dayOfWeek: String,
        address: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Address"
            },
            name: String
        }
    },

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
