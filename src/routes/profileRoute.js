const router = require('express').Router();
const auth = require('../middleware/auth');
const profileController = require('../controller/profileController');

// user logout route
router.get('/profile', auth.verifyUser, profileController.showProfile);


// router.get('/',(req,res,next)=>{
//     console.log(next);
//     // throw new Error("hello world")
//     res.send("hello world");
// })


module.exports = router;