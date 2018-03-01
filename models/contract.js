const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    price: Number,
    disponibility: Number,
    startDate: Date,
    endDate: Date,

    delivery: {
        // Per month
        frequency: Number,
        dayOfWeek: String,
        address: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address"
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
