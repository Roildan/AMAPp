const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    subscribedContracts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contract"
    }],
    isProducer: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
