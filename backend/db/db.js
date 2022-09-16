const mongoose = require("mongoose");

class InitDB {
  connect(uri) {
    return mongoose.connect(uri);
  }
}

const db = new InitDB();

module.exports = db;
