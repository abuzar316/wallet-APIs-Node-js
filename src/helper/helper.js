const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// generate token for  jwt authentication
module.exports.tokenGenrate = (_id, expiresIn) => {
    const token = jwt.sign({ _id }, process.env.TOKENKEY, { expiresIn: expiresIn });
    return token;
};
// verify token for jwt authentication
module.exports.verifyToken = (token) => {
    return jwt.verify(token, process.env.TOKENKEY);
}
// bcrypt password
module.exports.hashPassword = async (password) => {
    const bcryptpassword = await bcrypt.hash(password, 10);
    return bcryptpassword;
};
// compare password
module.exports.comparePassword = async (password, userPassword) => {
    return await bcrypt.compare(password, userPassword);
};