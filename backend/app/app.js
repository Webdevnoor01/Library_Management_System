const express = require("express")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const router = require("./route")


const app = express()

app.use(cors({
    origin:["http://localhost:3000"],
    credentials:true
}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(router)



app.use((err, _req, res, _next) => {
    if (err) {
        res.status(err.status || 500).json({
            errors: {
                common: {
                    msg: err.message
                }
            }
        })
    }
})


module.exports = app