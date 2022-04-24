const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const auth = async (req, res, next)=>{

    try {
        
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).send("Token is missing, Check if you are logged in")
        }
        const verifyUser = jwt.verify(token, process.env.JWT_SECRET)
        console.log(verifyUser);

        req.token = token;
        req.user = await User.findById(verifyUser.id).select('-password');
    
        next()

    } catch (error) {

        res.status(401).send(error);

    }
}

module.exports = auth;