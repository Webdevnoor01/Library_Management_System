const bookRequestController = require("../controller/bookRequest/bookRequestController");
const fequestedBookAuthorization = require("../middleware/authorization/requestedBookAuthorization");

const router = require("express").Router();

router.post(
    "/",
    fequestedBookAuthorization.authorized,
    bookRequestController.newBookRequest
);
router.get("/find", bookRequestController.findRequestedBook);
router.get(
    "/find/user/:userId",
    fequestedBookAuthorization.authorized,
    bookRequestController.findUserRequestedBook
);

module.exports = router;