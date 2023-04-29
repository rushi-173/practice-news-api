const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required: [true,"User must have property name"],
        min:[4,"Name should have more than 4 letters"],
        max:[100,"Name should have less than 100 letters"]
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: [true, "Email is already registered"],
        required: [true,"User must have property email"],
        min:[6,"Email should have more than 6 characters"],
        max:[100,"Email should have less than 100 characters"]
    },
    password: {
        type: String,
        required: true,
    },
    preferences: [{
        type: String,
        lowercase: true,
        trim: true,
        enum: {
            values: ['business','entertainment',"general","health","science","sports","technology"],
            message: 'Preference is not valid'
        },
    }],
    created_at:{
        type: Date,
        default: Date.now
    },
    updated_at:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('User', userSchema)