require("dotenv").config()
const app = require("./app/app")


const http = require("http")


const server = http.createServer(app)



server.listen(process.env.PORT, () =>{
    console.log("Server listening at por "+process.env.PORT)
})