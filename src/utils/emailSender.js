module.exports = function emailSender(email,fname,lname,confirmToken) {
    return mailoption = {
        from: '"Confirmation mail ☑️ " <mabuzartest@gmail.com>',
        to: email,
        subject: "Please confirm your account",
        html:
            `<div>
                <h1>Email Confirmation</h1>
                <h2>Hello ${fname} ${lname}</h2>
                <p>Thank you for Register. Please confirm your email by clicking on the following link</p>
                <a href='${process.env.BASE_URL}/confirm/${confirmToken}'>Click here</a><br />
                <p>${process.env.BASE_URL}/confirm/${confirmToken}</p>
            </div>`
    }                           
}