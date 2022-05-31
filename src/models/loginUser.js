const mongoose = require('mongoose');
const ip = require("ip");


const loginSchema = new mongoose.Schema({
    userId:{
        type: 'ObjectId',
        required:true,
        ref:'user'
    },
    tokens:[{
        token:{
            type:String
        },
        createdat: {
            type: Date,
            default: Date.now
        },
        ip:{
            type:String,
            default:ip.address()
        }
    }],
    createdat: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('login', loginSchema);