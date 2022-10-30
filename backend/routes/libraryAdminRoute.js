const router = require("express").Router()

const libraryAdmiinValidator = require("../middleware/libraryAdmin/libraryAdminValidator")

const LibraryAdminController = require("../controller/libraryAdmin/libraryAdminController")
const libraryAdminController = require("../controller/libraryAdmin/libraryAdminController")
const authController = require("../controller/auth/teacherStudent/tsAuthController")
const adminAuthorization = require("../middleware/authorization/adminAuthorization")
const authenticateMiddleware  = require("../middleware/authenticate/authenticate")



router.post(
    "/create",
    authenticateMiddleware.authenticate,
    adminAuthorization.authorized,
    libraryAdmiinValidator.validate(),
    libraryAdmiinValidator.validationHnadler,
    libraryAdminController.createAdmin

)

router.post("/login", authController.login)

router.post(
    "/accept_requested_book",
    authenticateMiddleware.authenticate,
    adminAuthorization.authorized,
    LibraryAdminController.acceptRequestedBook
    )

module.exports = router