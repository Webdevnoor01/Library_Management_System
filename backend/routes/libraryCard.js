const router = require("express").Router();
const libraryCardValidation = require("../middleware/libraryCard/libraryCard");
const libraryCardController = require("../controller/libraryCard/libraryCardController");
const authenticateMiddleware = require("../middleware/authenticate/authenticate");
const adminAuthorization = require("../middleware/authorization/adminAuthorization");
router.post(
    "/create",
    adminAuthorization.authorized,
    libraryCardValidation.validator(),
    libraryCardValidation.validationHnadler,
    libraryCardController.create
);

router.get(
    "/find",
    authenticateMiddleware.authenticate,
    libraryCardController.findCard
);
router.get(
    "/find/:libraryId",
    authenticateMiddleware.authenticate,
    libraryCardController.findCardByLid
);

router.patch(
    "/update/:libraryId",
    adminAuthorization.authorized,
    libraryCardController.uadateCard
);

router.delete(
    "/delete/:libraryId",
    adminAuthorization.authorized,
    libraryCardController.deleteLibraryCardById
);
module.exports = router;