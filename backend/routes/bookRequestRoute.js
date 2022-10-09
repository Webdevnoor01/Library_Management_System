const bookRequestController = require("../controller/bookRequest/bookRequestController");

const router = require("express").Router();

router.post("/", bookRequestController.newBookRequest);

module.exports = router;
