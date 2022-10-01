const router = require("express").Router();
const studentValidator = require("../middleware/auth/student/student");
const studentController = require("../controller/auth/student/sAuthController");

router.post(
  "/student",
  studentValidator.validate(),
  studentValidator.validationHnadler,
  studentController.register
);

module.exports = router;
