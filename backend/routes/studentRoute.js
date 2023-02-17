const router = require("express").Router();
const studentController = require("../controller/student/studentController");
const requestedBookAuthorization = require("../middleware/authorization/requestedBookAuthorization");
const studentAuthorization = require("../middleware/authorization/studentAuthorization");
const authenticateMiddleware = require("../middleware/authenticate/authenticate");

router.get("/find", studentController.findStudents);
router.get(
    "/issue_books/:userId",
    requestedBookAuthorization.authorized,
    studentController.findRequestedBook
);
router.get(
    "/find/issued_book/:userId",
    authenticateMiddleware.authenticate,
    requestedBookAuthorization.authorized,
    studentController.findIssuedBooks
);
router.get(
    "/find/returned-books/:userId",
    authenticateMiddleware.authenticate,
    requestedBookAuthorization.authorized,
    studentController.findReturnedBook
);
router.get(
    "/notifications",
    authenticateMiddleware.authenticate,
    studentAuthorization.authorized,
    studentController.getNotification
);
router.delete(
    "/reject_issue_book",
    requestedBookAuthorization.authorized,
    studentController.deleteRequestedBook
);

router.post(
    "/return-book/:userId",
    requestedBookAuthorization.authorized,
    studentController.returnBook
);

router.post(
    "/renew-book/:userId",
    requestedBookAuthorization.authorized,
    studentController.renewBook
);
module.exports = router;