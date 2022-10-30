const router = require("express").Router();
const libraryCardValidation = require("../middleware/libraryCard/libraryCard");
const libraryCardController = require("../controller/libraryCard/libraryCardController");
const adminAuthorization = require("../middleware/authorization/adminAuthorization")
router.post(
  "/create",
  adminAuthorization.authorized,
  libraryCardValidation.validator(),
  libraryCardValidation.validationHnadler,
  libraryCardController.create
);

router.get("/find", libraryCardController.findCard);
router.get("/find/:libraryId", libraryCardController.findCardByLid);

router.patch("/update/:libraryId",adminAuthorization.authorized, libraryCardController.uadateCard);

module.exports = router;
