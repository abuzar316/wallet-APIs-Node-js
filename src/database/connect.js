const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();


const connect = async ()=>{
    try {
        mongoose.connect(`${process.env.DATABASE_URL}${process.env.DATABASE_NAME}`);
        console.log("Database Connect successfully");
    } catch (error) {
        console.log("DataBase Connection Error");
    }
};

module.exports = connect;