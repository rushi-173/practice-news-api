const express = require('express');
const { register, login } = require('./src/controllers/auth.controller');
const { updatePreferences, getPreferences, getNews } = require('./src/controllers/news.controller');
const jwtVerify = require('./src/middlewares/jwtVerify')

const router = express.Router();

router.get("/", (req,res)=>{
    res.send("Welcome to News API")
})


router.post("/register", register)

router.post("/login", login)

router.use(jwtVerify);

router.get("/preferences", getPreferences)

router.put("/preferences", updatePreferences)

router.get("/news", getNews)

module.exports = router;


