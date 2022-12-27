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

module.exports = router;
