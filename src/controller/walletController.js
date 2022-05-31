const walletSchema = require('../models/wallet');
const transactionSchema = require('../models/transaction.js');
const user = require('../models/user');
const fraudTransactionSchame = require('../models/fraudTransaction');

// check balance controller
module.exports.welletGet = async (req, res) => {
    try {
        const walletData = await walletSchema.findOne({ userId: req.user.userId });
        if (walletData == null) {
            return res.status(400).json({ 'status': 400, msg: "your wallet not created" });
        }
        res.status(200).json({ "status": 200, "Amount": walletData.amount })
    } catch (error) {
        console.log(error);
    }
}
// create wallet controller
module.exports.welletCtrate = async (req, res) => {
    try {
        const walletData = await walletSchema.findOne({ userId: req.user.userId });
        if (walletData !== null) {
            return res.status(400).json({ 'status': 400, msg: "Your wallet already create" });
        }
        const createWallet = new walletSchema({
            userId: req.user.userId,
            amount: 0
        })
        await createWallet.save();
        // console.log(createWallet);
        res.status(200).json({ 'status': 200, msg: "wallet create successfully" });
    } catch (error) {
        console.log(error);
    }
}
// add balance controller
module.exports.welletAdd = async (req, res) => {
    try {
        const walletData = await walletSchema.findOne({ userId: req.user.userId });
        if (walletData == null) {
            return res.status(400).json({ 'status': 400, msg: "your wallet not created" });
        }
        let totalAmount = walletData.amount + req.body.amount;
        // console.log(TotalAmount);
        walletData.amount = totalAmount;
        await walletData.save();
        res.status(200).json({ "status": 200, msg: 'your amount successfully add' })
    } catch (error) {
        console.log(error);
    }
}
//send amount controller
module.exports.welletSend = async (req, res) => {
    try {
        const { to, massage } = req.body;
        const amount = parseInt(req.body.amount);
        const userData = await user.findOne({ mobile: to });
        // console.log('userData' );
        // console.log('userData' + req.user.userId );
        const fromUser = await user.findOne({ _id: req.user.userId });
        // console.log(userData);
        const walletData = await walletSchema.findOne({ userId: req.user.userId });
        const reciverWallet = await walletSchema.findOne({ userId: userData._id });
        if (walletData == null) {
            return res.status(400).json({ 'status': 400, msg: "your wallet not created" });
        }
        if (walletData.amount <= amount) {
            return res.status(400).json({ "status": 400, msg: "Your Balance low" });
        }
        if (amount < 0) {
            return res.status(400).json({ "status": 400, msg: "Your Balance not accept" });
        }
        if (reciverWallet == null) {
            return res.status(400).json({ "status": 400, msg: "User Wallet not create" });
        }


        const transactionData = new transactionSchema({
            to,
            from: fromUser.mobile,
            amount,
            massage,
        });

        const deductedAmount = walletData.amount - amount;
        walletData.amount = deductedAmount;
        let reciverTotalAmount = reciverWallet.amount + amount;
        reciverWallet.amount = reciverTotalAmount;

        await transactionData.save();
        await reciverWallet.save();
        await walletData.save();
        res.status(200).json({ "status": 200, msg: "send successfully" });
    } catch (error) {
        console.log(error);
    }
}
// check transaction history controller
module.exports.transactionHistory = async (req, res) => {
    try {
        const walletData = await walletSchema.findOne({ userId: req.user.userId });
        const userData = await user.findOne({ _id: req.user.userId });
        // console.log(userData.mobile);
        if (walletData == null) {
            return res.status(400).json({ 'status': 400, msg: "your wallet not created" });
        }
        const userTransaction = await transactionSchema.find({
            $or: [
                { to: userData.mobile }, { from: userData.mobile }]
        });
        // const userTransaction = await transactionSchema.find({ from: userData.mobile });

        const resData = []
        await Promise.all(
            userTransaction.map(async (e) => {
                const newUserFrom = await user.findOne({ mobile: e.from });
                const newUserTo = await user.findOne({ mobile: e.to });
                // console.log(newUserTo);
                const balanceReciveSend = e.to == userData.mobile ? "+" : "-";
                const numberReciveSend = e.from == userData.mobile ? e.to : e.from;
                const paidReciveSend = e.from == userData.mobile ? "Paid" : "Money sent";
                const nameReciveSend = e.from == userData.mobile ? `${newUserTo.firstName} ${newUserTo.lastName}` : `${newUserFrom.firstName} ${newUserFrom.lastName}`;
                // const checkNumber = e.to == userData.mobile ? `Monay Recived From ${newUser.first_name}` : `Monay Sent to ${newUser.first_name}`;
                let newResData = {
                    "Time": e.createdAt,
                    "mobile": numberReciveSend,
                    [paidReciveSend]: nameReciveSend,
                    "amount": ` ${balanceReciveSend} ${e.amount}`,
                    "transactionId": e._id,
                    "msg":e.massage
                }
                resData.push(newResData);
            })
        );

        res.status(200).json(resData)


        // console.log(resData);

    } catch (error) {
        console.log(error);
    }
}
// fraudTransaction wallet controller
module.exports.fraudTransaction = async (req, res) => {
    try {
        const { transactionId } = req.body;
        const oldTransaction = await fraudTransactionSchame.findOne({ transactionId });

        if (oldTransaction != null) {
            return res.status(400).json("This transactionId already added");
        }
        const createFraudTransaction = new fraudTransactionSchame({
            transactionId,
            userId: req.user.userId
        })
        await createFraudTransaction.save();
        res.status(200).json(createFraudTransaction);
    } catch (error) {
        console.log(error);
    }
}
// admin show all fraud transactions controller
module.exports.transactionFraudAllPayments = async (req, res) => {
    try {
        const allPayments = await fraudTransactionSchame.find();
        res.status(200).json(allPayments);
    } catch (error) {
        console.log(error);
    }
}
// admin by fraud transaction true and false
module.exports.transactionFraudAllowed = async (req, res) => {
    try {
        const { fraudTransactionId, isFraud } = req.body;
        const fraudPayment = await fraudTransactionSchame.findOne({ _id: fraudTransactionId }).populate('transactionId');
        const userData = await user.findOne({ mobile: fraudPayment.transactionId.to });
        const userDataFrom = await user.findOne({ mobile: fraudPayment.transactionId.from });
        const senderWallet = await walletSchema.findOne({ userId: userData._id });
        const reciverWallet = await walletSchema.findOne({ userId: userDataFrom._id });

        if (fraudPayment == null) {
            return res.status(400).json("Id not valid");
        }
        fraudPayment.isFraud = isFraud;
        if (fraudPayment.isFraud == false) {
            return res.status(400).json("Is payemnt fraud");
        }

        // console.log(reciverWallet);
        reciverWallet.amount = reciverWallet.amount + fraudPayment.transactionId.amount
        senderWallet.amount = senderWallet.amount - fraudPayment.transactionId.amount;
        // console.log(reciverWallet.amount);
        // console.log(senderWallet.amount);
        await fraudPayment.save();
        await senderWallet.save();
        await reciverWallet.save();
        // console.log(fraudPayment.transactionId.amount);
        // console.log(isFraud);

        res.status(200).json("done");
    } catch (error) {
        console.log(error);
    }
}