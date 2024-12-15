const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },

    email: {
        type: String,
        require: true
    },

    password: {
        type: String,
        required: true
    },

    products: 
        [
            {
                type: Schema.Types.ObjectId,
                ref: "Products"
            }
        ]
}, { timestamps: true })

module.exports = mongoose.model("User", userSchema);