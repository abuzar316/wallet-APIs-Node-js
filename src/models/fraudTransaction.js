const mongoose = require('mongoose');
const ip = require('ip');


const fraudTransactionSchema = new mongoose.Schema({
    transactionId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'transaction'
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    isFraud: {
        type: Boolean,
        default: false,
    },
    ip: {
        type: String,
        default: ip.address(),
    }
}, { timestamps: true }
);


module.exports = mongoose.model('fraudTransaction', fraudTransactionSchema);