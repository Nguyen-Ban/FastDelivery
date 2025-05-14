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
        data: {
            fullName: user.fullName,
            dateOfBirth: user.dateOfBirth,
            email: user.email,
            gender: user.gender,
            phoneNumber: user.phoneNumber
        }
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
        data: {
            fullName: user.fullName,
            dateOfBirth: user.dateOfBirth,
            email: user.email,
            gender: user.gender,
            phoneNumber: user.phoneNumber
        }
    });
};

const changePasscode = async (req, res) => {
    const userId = req.userId;
    const { currentPasscode, newPasscode } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
            error: 'User not found'
        });
    }

    const isMatch = await user.comparePasscode(currentPasscode);

    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: 'Incorrect passcode',
            error: 'Incorrect passcode'
        });
    }

    user.passcode = newPasscode;
    await user.save();
    res.status(200).json({
        success: true,
        message: 'User passcode updated successfully'
    });
};

module.exports = { getProfile, updateProfile, changePasscode };


