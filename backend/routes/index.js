const router = require("express").Router()
const libraryCardRoute= require("./libraryCard")

router.use("/api/v1/libraryCard",libraryCardRoute)


module.exports = router