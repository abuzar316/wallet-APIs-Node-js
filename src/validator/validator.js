// email address validation
module.exports.email = (email) => {
    const emailValidation = /^[a-z0-9._-]+@[a-z0-9.-]+.[a-z]+.[a-z0-9]{2,}$/;
    const emailValcheck = emailValidation.test(email);
    return emailValcheck;
}
// mobile number validation
module.exports.mobile = (mobile) => {
    const mobileValidation = /^[0-9]{10,12}$/;
    const mobilevalcheck = mobileValidation.test(mobile)
    return mobilevalcheck;
}
// password validation
module.exports.password = (password) => {
    const passwordValidate = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$\/\!#%*^?&])[a-zA-Z0-9\d@$\/\!#^%*?&]{8,}/;
    const passwordvalcheck = passwordValidate.test(password);
    return passwordvalcheck;
}