const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    roleId: {
        type: 'ObjectId',
        ref: 'role'
    },
    email: {
        type: String,
        required: true,
    },
    firstName: {
        required: true,
        type: String,
    },
    lastName: {
        required: true,
        type: String,
    },
    mobile: {
        required: true,
        type: String,
        unique: true,
    },
    gender: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String,
    },
    status: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true })

module.exports = mongoose.model('user', userSchema);