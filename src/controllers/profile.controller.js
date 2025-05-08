const { User } = require("../models/index");
const getProfile = async (req, res) => {
    const userId = req.userId;
    const user = await User.findByPk(userId);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
            error: 'User not found'
        });
    }
    res.status(200).json({
        success: true,
        message: 'User profile fetched successfully',
        data: user
    });
};

const updateProfile = async (req, res) => {
    const userId = req.userId;
    const { fullName, dateOfBirth, gender, email } = req.body;
    const user = await User.findByPk(userId);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
            error: 'User not found'
        });
    }
    user.fullName = fullName;
    user.dateOfBirth = dateOfBirth;
    user.gender = gender;
    user.email = email;
    await user.save();
    res.status(200).json({
        success: true,
        message: 'User profile updated successfully',
        data: user
    });
};

const changePasscode = async (req, res) => {
    const userId = req.userId;
    const { passcode } = req.body;
    const user = await User.findByPk(userId);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
            error: 'User not found'
        });
    }
    user.passcode = passcode;
    await user.save();
    res.status(200).json({
        success: true,
        message: 'User passcode updated successfully',
        data: user
    });
};

module.exports = { getProfile, updateProfile, changePasscode };


