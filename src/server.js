const database = require("./database/connect");
const express = require("express");
const dotenv = require('dotenv');
const masterRoute = require('./routes/masterRoute');
const autoCall = require('./helper/autoCall');
const cookieParser = require('cookie-parser');

// cell database connection
database();
// env file config
dotenv.config();
// run express
const app = express();
const PORT = process.env.PORT || 4000;

// auto create admin
autoCall();
// middleware use
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// route use
app.use(masterRoute.userRoute);
app.use(masterRoute.walletRoute);
app.use(masterRoute.profileRoute);

// console.log(Error);

app.get('/', async (req, res, next) => {
    try {
        if (req.body.password !== req.body.cpassword) {
            // return next(erorrHandle(300, 'Invalid password'))
            throw new Error('Not Matched Password');
        }
        res.send("hello");
    } catch (error) {
        next(error);
    }
})

// erorr 404 page not found
// app.use((req, res, next) => {
//     const error = new Error('Not Found');
//     error.status = 404;
//     next(error);
// });


app.use((error, req, res, next) => {
    console.log(error);
    let status = error.status || 500
    let data = {
        message: error.message || "internal error",
        originalError: error
    }


    res.status(status).json(data);
})

// class customErrorHandler extends err

// function erorrHandle() {
//     let status = 410;
//     let message = "tsethah";
// }


app.listen(PORT, () => console.log(`Server is Running on Port ${PORT}`));