const router = require("express").Router();
const libraryCardRoute = require("./libraryCard");
const studentAuthRoute = require("./studentAuth");
const teacherAuthRoute = require("./teacherAuth")
const bookRoute = require("../routes/bookRoute")

router.use("/api/v1/libraryCard", libraryCardRoute);
router.use("/api/v1/auth/student", studentAuthRoute);
router.use("/api/v1/auth/teacher", teacherAuthRoute);
router.use("/api/v1/book", bookRoute)

module.exports = router;
