const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    // Main
    username: String,
    password: String,
    email: String,
    isProducer: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },

    // Personnal
    name: {
        firstName: String,
        lastName: String
    },
    contact: {
        phone: String,
        address1: String,
        address2: String,
        postalCode: String,
        city: String
    },

    // Contract
    subscribedContracts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contract"
    }]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
