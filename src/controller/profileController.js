const userSchema = require('../models/user');

module.exports.showProfile = async (req, res) => {
    try {
        const userData = await userSchema.findOne({ _id: req.user.userId });
        res.status(200).json(userData);
    } catch (error) {
        res.status(400).json({ error })
    }
}