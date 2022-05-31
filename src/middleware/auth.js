const loginuser = require("../models/loginUser");
const helper = require('../helper/helper');
const user = require('../models/user')

// login user authorization middleware
module.exports.verifyUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        // verify the token
        const verifyuser = helper.verifyToken(token);
        // find the user using verify token
        const user = await loginuser.findOne({ _id: verifyuser._id })
        // console.log(user);
        req.token = token;
        req.user = user;
        next()
    } catch (error) {
        res.status(401).json("Invalid Token")
    }
}
// admin user authorization middleware
module.exports.adminUser = async (req, res, next) => {
    try {
        const userData = await user.findOne({_id:req.user.userId}).populate('roleId');
        const userRole = userData.roleId.roleName;
        if(userRole !== 'admin'){
            return res.status(400).json({msg:"user Not Authorize"})
        }
        next();
    } catch (error) {
        res.status(400).json({"error":error})
    }
}