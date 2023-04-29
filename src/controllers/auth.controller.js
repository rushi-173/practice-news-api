const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/user.model")

const register = async (req, res) => {
    try {
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password,8)
        })
        res.status(201).send({ success: true, message: "User registered successfully", user: {
            id: user.id,
            name: user.name,
            email: user.email
        }})
    } catch (error) {
        res.status(404).send({ success: false, message: error })
    }
}

const login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            res.status(404).send({ message: 'User does not exist' })
            return;
        }
        const isMatch = await bcrypt.compareSync(req.body.password, user.password);
        if (!isMatch) {
            res.status(401).send({ message: "Incorrect password" })
            return;
        }
        const token = jwt.sign({ user_id: user.id, email: user.email}, process.env.JWT_SECRET_KEY, { expiresIn: '24h' })
        res.status(200).send({ success: true, message: "User logged in", token })
    } catch (error) {
        res.status(500).send({ success: false, message: error })
    }
}

module.exports = { register, login };