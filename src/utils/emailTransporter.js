const nodemailer = require('nodemailer');


let transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'mabuzartest@gmail.com', // generated ethereal user
        pass: 'Abuzar@123', // generated ethereal password
    },
});

module.exports = transporter;