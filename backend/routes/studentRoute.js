const router = require("express").Router()
const studentController = require("../controller/student/studentController")
const requestedBookAuthorization  = require("../middleware/authorization/requestedBookAuthorization")

router.get("/find",studentController.findStudents)
router.get("/issue_books/:userId", requestedBookAuthorization.authorized, studentController.findRequestedBook )
router.get("/notifications", studentController.getNotification )
router.delete("/reject_issue_book", requestedBookAuthorization.authorized, studentController.deleteRequestedBook )

module.exports = router