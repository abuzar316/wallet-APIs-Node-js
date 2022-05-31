const router = require('express').Router();
const walletController = require('../controller/walletController');
const auth = require('../middleware/auth');

// router.use(auth.verifyUser);
// user check balance in your account route
router.get('/wallet', auth.verifyUser, walletController.welletGet);
// create a new wallet route
router.get('/wallet/create', auth.verifyUser, walletController.welletCtrate);
// add balance in wallet route
router.post('/wallet/add', auth.verifyUser, walletController.welletAdd);
// send balance route
router.post('/wallet/send', auth.verifyUser, walletController.welletSend);
// user check balace history in your account route
router.get('/wallet/history', auth.verifyUser, walletController.transactionHistory);
// fraud transaction in wallet route
router.get('/wallet/fraudtransaction', auth.verifyUser, walletController.fraudTransaction);
// admin show all fraud transactions in wallet route 
router.get('/wallet/all/fraudtransaction', auth.verifyUser, auth.adminUser, walletController.transactionFraudAllPayments);
// admin by allowed fake transaction in wallet route
router.get('/wallet/fraud/allowed', auth.verifyUser, auth.adminUser, walletController.transactionFraudAllowed);

module.exports = router;