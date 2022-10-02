const router = require("express").Router();
const studentValidator = require("../middleware/auth/student/student");
const studentController = require("../controller/auth/student/sAuthController");

router.post(
  "/register",
  studentValidator.validate(),
  studentValidator.validationHnadler,
  studentController.register
);

router.post("/login", studentController.login);

module.exports = router;
