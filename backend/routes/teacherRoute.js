const requestedBookAuthorization = require("../middleware/authorization/requestedBookAuthorization");
const authenticateMiddleware = require("../middleware/authenticate/authenticate")
const teacherController = require("../controller/student/studentController");
const router = require("express").Router();



router.get("/find", teacherController.findStudents);
router.get(
  "/requested_books/:userId",
  authenticateMiddleware.authenticate,
  requestedBookAuthorization.authorized,
  teacherController.findRequestedBook
);
router.get("/find/issued_book/:userId",authenticateMiddleware.authenticate,
requestedBookAuthorization.authorized, teacherController.findIssuedBooks);

router.get(
  "/notifications/:userId",
  authenticateMiddleware.authenticate,
  requestedBookAuthorization.authorized,
  teacherController.getNotification
);
router.delete(
  "/reject_request_book",
  requestedBookAuthorization.authorized,
  teacherController.deleteRequestedBook
);

module.exports = router;
