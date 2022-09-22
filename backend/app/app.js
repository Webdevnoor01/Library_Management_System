const express = require("express")
const bodyParser = require("body-parser")
const router = require("./route")




const app = express()
app.use(express.json())
app.use(bodyParser.json())
app.use(express.urlencoded({extended:true}))
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