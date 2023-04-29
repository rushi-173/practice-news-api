const jwt = require("jsonwebtoken")
const User = require("../models/user.model")

const jwtVerify = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('JWT ')) {
        return res.status(401).json({ success: false, message: "Unauthenticated request" });
    }

    const token = authHeader.substring('JWT '.length);
    if (!token) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }

    try {
        const tokenData = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findOne({ _id: tokenData.user_id });
console.log(tokenData, user)
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

module.exports = jwtVerify;
