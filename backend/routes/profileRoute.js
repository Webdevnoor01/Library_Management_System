const router = require("express").Router();
const profileController = require("../controller/profile/profileController");
const imageUploader = require("../middleware/imageUploader/imageUploader");
const updateProfileAuthorization = require("../middleware/authorization/updateProfileAuthorization");

router.patch(
  "/update/:userId",
  updateProfileAuthorization.authorized,
  profileController.update
);
router.patch(
  "/update/avatar/:userId",
  updateProfileAuthorization.authorized,
  imageUploader.uploadImage("userAvatar"),
  profileController.update
);

module.exports = router;
