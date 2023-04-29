const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/user.model")

const newsCache = [];

const getPreferences = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.id });
        res.status(200).send({ success: true, message: "", preferences: user.preferences })
    } catch (error) {
        res.status(500).send({ success: false, message: error })
    }
}

const updatePreferences = async (req, res) => {
    try {
        console.log(req.user,'\n', req.body)
        const user = await User.findOne({ id: req.user.id });
        user.preferences = [...new Set([...req.user.preferences, ...req.body.preferences])];
        const updatedUser = await user.save()
        res.status(200).send({ success: true, message: "User logged in", preferences: updatedUser.preferences })
    } catch (error) {
        res.status(500).send({ success: false, message: error })
    }
}

const getNews = async (req, res) => {
    try {
        if(req.user.preferences.length){
            const results = await Promise.allSettled(req.user.preferences.map((pref)=> {
                if(newsCache[pref]){
                    return newsCache[pref]
                }else {
                    return fetch(`${process.env.NEWS_API_URL}&q=a&category=${pref}`).then(data=> data.json())
                }
            }))
            const combinedResults = results.reduce((acc, item)=>{
                return [...acc, ...item]
            },[])
            res.status(200).send({ success: true, message: "", news: combinedResults})
        }else{
            if(newsCache['general']){
                res.status(200).send({ success: true, message: "", news: newsCache['general']})
                return;
            }else {
                const news = await fetch(`${process.env.NEWS_API_URL}&q=a`).then(data=> data.json())
                newsCache['general'] = news;
                res.status(200).send({ success: true, message: "", news})
                return;
            }
        }

    } catch (error) {
        res.status(500).send({ success: false, message: error })
    }
}

module.exports = { getPreferences, updatePreferences, getNews };