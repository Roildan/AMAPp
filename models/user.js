const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    // Main -- Mendatory
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
    contract: {
        subscribed: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Contract"
        }],
        created: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Contract"
        }]
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
