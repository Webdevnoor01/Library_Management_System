const router = require("express").Router();
const studentValidator = require("../middleware/auth/teacherStudent/teacherStudent");
const studentController = require("../controller/auth/teacherStudent/tsAuthController");
const authenticateMiddleware = require("../middleware/authenticate/authenticate")

router.post(
  "/register",
  studentValidator.validate(),
  studentValidator.validationHnadler,
  studentController.register
);

router.post("/login", studentController.login);
router.post("/logout",authenticateMiddleware.authenticate, studentController.logout)

module.exports = router;
