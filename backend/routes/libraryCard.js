const router = require("express").Router();
const libraryCardValidation = require("../middleware/libraryCard/libraryCard")
const libraryCardController = require("../controller/libraryCard/libraryCardController");


router.post(
"/create",
libraryCardValidation.validator(),
libraryCardValidation.validationHnadler,
libraryCardController.create

)
router.get("/find", libraryCardController.findCard)


module.exports = router;
