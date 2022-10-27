const router = require("express").Router()
const studentController = require("../controller/student/studentController")
const requestedBookAuthorization  = require("../middleware/authorization/requestedBookAuthorization")


router.get("/issue_books/:userId", requestedBookAuthorization.authorized, studentController.findRequestedBook )

module.exports = router