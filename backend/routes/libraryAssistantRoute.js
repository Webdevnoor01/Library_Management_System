const router = require("express").Router()
const authController  = require("../controller/auth/teacherStudent/tsAuthController")
router.post("/login",authController.login)

module.exports = router