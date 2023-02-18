const bookRequestController = require("../controller/bookRequest/bookRequestController");
const requestedBookAuthorization = require("../middleware/authorization/requestedBookAuthorization");

const router = require("express").Router();

router.post(
    "/",
    requestedBookAuthorization.authorized,
    bookRequestController.newBookRequest
);
router.get("/find", bookRequestController.findRequestedBook);
router.get(
    "/find/user/:userId",
    requestedBookAuthorization.authorized,
    bookRequestController.findUserRequestedBook
);

module.exports = router;