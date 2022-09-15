require("dotenv").config()
const app = require("./app/app")
const db = require("./db/db")

const http = require("http")


const server = http.createServer(app)



db.connect(process.env.MONGODB_DB_URI).then(() => {

    console.log("Database Connected")
    server.listen(process.env.PORT, () => {
        console.log("Server listening at por " + process.env.PORT)
    })

}).catch((e) => {
    console.log(e)
})