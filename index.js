require('dotenv').config()
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const routes = require("./index.route")
const initializeDBConnection = require("./src/db/connection")

const app = express()

initializeDBConnection()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(routes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log("Server started at port " + PORT);
})