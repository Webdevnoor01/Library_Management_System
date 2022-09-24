const router = require("express").Router();
const authController = require("../controller/auth/authController");

router.post("/register", authController.register);

module.exports = router;
