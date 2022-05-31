const mongoose = require('mongoose');


const transactionSchema = new mongoose.Schema({
    to:{
        type:Number,
        required:true,
    },
    from:{
        type:Number,
        required:true,
    },
    amount:{
        type:Number,
        required:true,
    },
    massage:{
        type:String,
    }
},{timestamps:true}
);


module.exports = mongoose.model('transaction', transactionSchema);