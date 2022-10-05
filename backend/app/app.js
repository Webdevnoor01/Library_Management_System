const express = require("express")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const router = require("./route")




const app = express()
app.use(bodyParser.json())
app.use(express.urlencoded({extended:true }))
app.use(express.json())
app.use(cookieParser())
app.use(router)


app.use((err, req, res, next)=>{
    if(err){
        res.status(err.status || 500).json({
            errors:{
                common:{
                    msg:err.message
                }
            }
        })
    }
})


module.exports = app