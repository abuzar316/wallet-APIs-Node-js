const mongoose = require('mongoose');


const walletSchema = new mongoose.Schema({
    userId: {
        type: 'ObjectId',
        ref:'user',
        required: true,
    },
    amount:{
        type:Number,
        required:true,
    }
},{
    timestamps:true
});


module.exports = mongoose.model('wallet', walletSchema);