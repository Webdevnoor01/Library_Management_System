const router = require("express").Router();
const passwordUpdateAuthorization = require("../middleware/authorization/passwordUpdateAuthorization");
const passwordValidation = require("../middleware/password/passwordValidator");
const passwordController = require("../controller/password/passwordController");

router.patch(
  "/change/:userId",
  passwordUpdateAuthorization.authorized,
  passwordValidation.validate(),
  passwordValidation.validationHandler,
  passwordController.changePassword
);

router.post(
  "/forgot/send-otp/:userId",
  passwordUpdateAuthorization.authorized,
  passwordController.sendOtp
);

router.post(
  "/forgot/verify-otp/:userId",
  passwordUpdateAuthorization.authorized,
  passwordController.verifyOtp
);

module.exports = router;
