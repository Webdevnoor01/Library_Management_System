const express = require("express")
const router = require("./route")



const app = express()
app.use(router)
app.use(express.json())
app.use(express.urlencoded({extended:true}))



module.exports = app