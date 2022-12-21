const router = require("express").Router()
const authController  = require("../controller/auth/teacherStudent/tsAuthController")
const libraryAdminController = require("../controller/libraryAdmin/libraryAdminController")
const LibraryAdminController = require("../controller/libraryAdmin/libraryAdminController")
const authenticateMiddleware = require("../middleware/authenticate/authenticate")
const acceptBookRequestAuthorization = require("../middleware/authorization/acceptBookRequestAuthorization")
router.post("/login",authController.login)
router.post("/accept_requested_book",authenticateMiddleware.authenticate, acceptBookRequestAuthorization.authorized, libraryAdminController.acceptRequestedBook   )

module.exports = router