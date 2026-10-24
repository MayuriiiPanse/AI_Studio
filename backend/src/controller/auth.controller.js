const userModel = require('../models/auth.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function registerController(req,res){
    const{
        username,password
    } = req.body || {};

    if (typeof username !== 'string' || !username.trim() ||
        typeof password !== 'string' || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    const isuserExist = await userModel.findOne({
        username: username.trim()
    })
    if(isuserExist){
        return res.status(400).json({
            message:"User already exists"
        })
    }
    const user = await userModel.create({
        username: username.trim(),
        password: await bcrypt.hash(password, 10)
    })

    const token = jwt.sign({id:user._id},process.env.JWT_SECRET_KEY);

    res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
});

    return res.status(200).json({
    success: true,
    message: "user registered successfully!",
    token,
    user: {
        id: user._id,
        username: user.username
    }
});

}


async function loginController(req,res){
    const {username,password} = req.body || {};

    if (typeof username !== 'string' || !username.trim() ||
        typeof password !== 'string' || !password) {
        return res.status(400).json({
            success: false,
            message: "Username and password are required"
        });
    }

    const user = await userModel.findOne({
        username: username.trim()
    })

    if(!user){
        return res.status(400).json({
            message:"user not found"
        })
    }

    if (!user.password) {
        return res.status(400).json({
            success: false,
            message: "This account does not have a password. Register again."
        });
    }

    const ispasswordValid = await bcrypt.compare(password, user.password);

    if(!ispasswordValid){
        return res.status(400).json({
            message:"Invalid Password"
        })
    }

    const token = jwt.sign({id:user._id},process.env.JWT_SECRET_KEY);

    res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
});

    return res.status(200).json({
    success: true,
    message: "Login successful!",
    token,
    user: {
        id: user._id,
        username: user.username
    }
});

}


module.exports = {
    registerController, 
    loginController
};