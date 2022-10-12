const bookRequestController = require("../controller/bookRequest/bookRequestController");

const router = require("express").Router();

router.post("/", bookRequestController.newBookRequest);
router.get("/find", bookRequestController.findRequestedBook)

module.exports = router;
