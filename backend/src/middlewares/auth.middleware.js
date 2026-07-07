const userModel = require('../models/auth.model.js');
const jwt = require('jsonwebtoken');

async function authMiddleware (req,res,next){
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({message:"unauthorized access"});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        const user = await userModel.findById(decoded.id);
        req.user = user;
        next();

    } catch (error) {
        
        return res.status(401).json({message:"Invalid Token please login again!"});
    }
}

module.exports = authMiddleware;