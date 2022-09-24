const router = require("express").Router();
const libraryCardValidation = require("../middleware/libraryCard/libraryCard");
const libraryCardController = require("../controller/libraryCard/libraryCardController");
const libraryCardSearvice = require("../service/libraryCardService");

router.post(
  "/create",
  libraryCardValidation.validator(),
  libraryCardValidation.validationHnadler,
  libraryCardController.create
);
router.get("/find", libraryCardController.findCard);
router.get("/find/:libraryId", libraryCardController.findCardByLid);
router.patch("/update/:libraryId", libraryCardController.uadateCard);

module.exports = router;
