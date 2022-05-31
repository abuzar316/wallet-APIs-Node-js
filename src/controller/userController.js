const users = require('../models/user');
const loginUser = require('../models/loginUser');
const transporter = require('../utils/emailTransporter');
const emailSender = require('../utils/emailSender.js');
const roleSchema = require('../models/role');
const validation = require('../validator/validator');
const helper = require('../helper/helper');

// user resgister Controller
module.exports.register = async (req, res) => {
    try {
        //------------------------ all input------------------------
        const { email, firstName, lastName, mobile, gender, password, cpassword, username } = req.body;
        // --------------check if user already exist-----------
        const oldUser = await users.findOne({ email });
        // console.log(oldUser == null);
        switch (true) {
            case (oldUser !== null):
                res.status(400).json({ "status": 400, "msg": "User Already Exist. Please Login" })
                break;
            // ----------------check all input filled required-----------
            case (!(email && firstName && lastName && mobile && gender && password && cpassword && username)):
                res.status(400).json("All Input Filled Is required");
                break;
            // --------------check password bath a same------------------
            case (password !== cpassword):
                res.status(400).json('Password Is Not Match')
                break;
            //------------------------ mobile number validation using regex-----------------
            case (!validation.mobile(mobile)):
                res.status(400).json("Mobile Number Invalid")
                break;
            //---------------- email validation using regex--------------
            case (!validation.email(email)):
                res.status(400).json('Email Is Invalid');
                break;
            //----------------------- password validation usinng regex----------------
            case (!validation.password(password)):
                res.status(400).json('Please Enter Strong Password');
                break;
        }

        // role id finnd is
        // const userRole = await roleSchema.findOne({ roleName: 'user' });
        // console.log(userRole);
        // save data in database
        let userData = new users({
            email,
            firstName,
            lastName,
            mobile,
            gender,
            password: await helper.hashPassword(password),
            username,
            status: true
        });
        // genrate token
        // const confirmToken = helper.tokenGenrate(userData._id, '10 minutes');
        // send email 
        // const mailoption = emailSender(email, firstName, lastName, confirmToken);
        // console.log(mailoption);
        // await transporter.sendMail(mailoption);

        const loginuserDB = new loginUser({
            userId: userData._id
        });
        // save user data in database
        await userData.save();
        await loginuserDB.save();
        // reponse
        res.status(200).json("Register successfully");
    } catch (error) {
        res.status(400).json("error: " + error.message);
    }
}
// user logiin Controller
module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userDB = await users.findOne({ email: email });
        // console.log(userDB);
        if (userDB == null) {
            return res.status(400).json("Invalid Email");
        }
        const loginuserDB = await loginUser.findOne({ userId: userDB._id });
        // console.log(loginuserDB);
        if (req.cookies.jwtToken) {
            return res.status(400).json("User Already Login");
        }
        //match password
        const matchpassword = await helper.comparePassword(password, userDB.password);
        // not match password run this code
        if (!matchpassword) {
            return res.status(400).json("passworrd is not match");
        }
        // check user email confirmation
        if (userDB.status == false) {
            return res.status(400).json("Your email verification pending");
        }
        // generate token in login database
        const token = helper.tokenGenrate(loginuserDB._id, '24h');
        // save token in database
        loginuserDB.tokens = [...loginuserDB.tokens, { token }];
        await loginuserDB.save();
        //response
        res.status(200).json({ "status": 200, "msg": "Welcome You are login", "token": token });
    } catch (error) {
        res.status(400).send({ "status": 400, error })
    }
}
// user logout controller
module.exports.logout = async (req, res) => {
    try {
        const tokens = req.user.tokens.filter((currElement) => {
            return currElement.token === req.token;
        })
        if (tokens == false) {
            return res.status(400).json({ msg: "Your are not login" });
        }
        // console.log(tokens);
        // delete token.
        req.user.tokens = req.user.tokens.filter((currElement) => {
            return currElement.token != req.token;
        });
        // console.log(req.user.tokens);
        // save detele token
        await req.user.save();
        // response
        res.status(200).json({ "status": 200, "msg": "Logout successfull" });
    } catch (error) {
        res.status(400).json({ "status": 400, error })
    }
}
// mail confirm mation controller
module.exports.confirmEmail = async (req, res) => {
    try {
        const token = req.params.token;
        // console.log(token);
        const verifyuser = helper.verifyToken(token);
        // console.log(verifyuser);
        const userDB = await users.findOne({ _id: verifyuser._id });
        // console.log(userDB);
        if (userDB == null) {
            return res.status(400).json({ massage: 'user not Found' });
        }
        userDB.status = true;
        await userDB.save();
        // console.log(userDB.status)
        res.status(200).json({ massage: 'Email verification successfully' });
    } catch (err) {
        res.status(400).json(err)
    }
}