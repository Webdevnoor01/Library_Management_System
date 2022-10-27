const router = require("express").Router();
const studentValidator = require("../middleware/auth/teacherStudent/teacherStudent");
const studentController = require("../controller/auth/teacherStudent/tsAuthController");
const authenticateMiddleware = require("../middleware/authenticate/authenticate")
const requestedBookAuthorization = require("../middleware/authorization/requestedBookAuthorization")


// Authentication related route
router.post(
  "/register",
  studentValidator.validate(),
  studentValidator.validationHnadler,
  studentController.register
);
router.post("/login", studentController.login);
router.post("/logout",authenticateMiddleware.authenticate, studentController.logout)

// Library related route
router.get("/issueBooks", authenticateMiddleware.authenticate, requestedBookAuthorization.authorized )

module.exports = router;
