const router = require("express").Router()
const teacherValidator = require("../middleware/auth/teacherStudent/teacherStudent")
const teacherController = require("../controller/auth/teacherStudent/tsAuthController")
const authenticateMiddleware  = require("../middleware/authenticate/authenticate")


router.post("/register",teacherValidator.validateTeacher(), teacherValidator.validationHnadler,teacherController.register)
router.post("/login", teacherController.login )
router.post("/logout", authenticateMiddleware.authenticate , teacherController.logout )


module.exports = router