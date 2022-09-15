const mongoose = require("mongoose")

class InitDB {

    connect(uri){
       return mongoose.connect(uri)
    }
    
}

const db = new InitDB(process.env.MONGODB_DB_URI)

module.exports = db 