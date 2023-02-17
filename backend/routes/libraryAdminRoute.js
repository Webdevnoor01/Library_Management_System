const router = require("express").Router();

const libraryAdmiinValidator = require("../middleware/libraryAdmin/libraryAdminValidator");

const LibraryAdminController = require("../controller/libraryAdmin/libraryAdminController");
const libraryAdminController = require("../controller/libraryAdmin/libraryAdminController");

const authController = require("../controller/auth/teacherStudent/tsAuthController");
const adminAuthorization = require("../middleware/authorization/adminAuthorization");
const authenticateMiddleware = require("../middleware/authenticate/authenticate");

const libraryStaffValidator = require("../middleware/libraryStaff/libraryStaffValidator");
const libraryStaffControler = require("../controller/libraryStaff/libraryStaffController");
const libraryStaffService = require("../service/libraryStaffService/libraryStaffService");

router.post(
    "/create",
    authenticateMiddleware.authenticate,
    adminAuthorization.authorized,
    libraryAdmiinValidator.validate(),
    libraryAdmiinValidator.validationHnadler,
    libraryAdminController.createAdmin
);

router.post("/login", authController.login);

router.get(
    "/find/requested-books/:libraryId",
    authenticateMiddleware.authenticate,
    adminAuthorization.authorized,
    libraryAdminController.findUserRequestedBook
);
router.post(
    "/accept_requested_book",
    authenticateMiddleware.authenticate,
    adminAuthorization.authorized,
    LibraryAdminController.acceptRequestedBook
);

// Create library staff
router.post(
    "/create/staff",

    authenticateMiddleware.authenticate,
    adminAuthorization.authorized,
    libraryStaffValidator.validate(),
    libraryStaffValidator.validationHandler,
    libraryStaffControler.register
);
router.get(
    "/find/staff",
    authenticateMiddleware.authenticate,
    adminAuthorization.authorized,
    libraryAdminController.findLibraryStaff
);
router.patch(
    "/update/staff/:staffId",
    authenticateMiddleware.authenticate,
    adminAuthorization.authorized,
    libraryAdminController.updateLibraryStaff
);
router.delete(
    "/delete/staff/:staffId",
    authenticateMiddleware.authenticate,
    adminAuthorization.authorized,
    libraryAdminController.deleteLibraryStaff
);
router.get(
    "/find-fine/:userId",
    authenticateMiddleware.authenticate,
    adminAuthorization.authorized,
    libraryAdminController.findUserFine
);
router.post(
    "/pay-fine",
    authenticateMiddleware.authenticate,
    adminAuthorization.authorized,
    libraryAdminController.payBookFine
);
router.get(
    "/find-return-request/:libraryId",
    authenticateMiddleware.authenticate,
    adminAuthorization.authorized,
    libraryAdminController.findReturnRequest
);

router.post(
    "/accept-return-request/:libraryId",
    authenticateMiddleware.authenticate,
    adminAuthorization.authorized,
    libraryAdminController.acceptReturnBookRequest
);

router.get(
    "/find-renew-request/:libraryId",
    authenticateMiddleware.authenticate,
    adminAuthorization.authorized,
    libraryAdminController.findRenewRequest
);

router.post(
    "/accept-renew-request/:libraryId",
    authenticateMiddleware.authenticate,
    adminAuthorization.authorized,
    libraryAdminController.acceptRenewRequest,
);
module.exports = router;