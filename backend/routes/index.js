const router = require("express").Router();
const libraryCardRoute = require("./libraryCard");
const studentAuthRoute = require("./studentAuth");
const teacherAuthRoute = require("./teacherAuth");
const bookRoute = require("../routes/bookRoute");
const bookRequestRoute = require("../routes/bookRequestRoute");
const authenticateMiddleware = require("../middleware/authenticate/authenticate")

router.use("/api/v1/libraryCard", libraryCardRoute);
router.use("/api/v1/auth/student", studentAuthRoute);
router.use("/api/v1/auth/teacher", teacherAuthRoute);
router.use("/api/v1/book", bookRoute);
router.use("/api/v1/bookRequest",authenticateMiddleware.authenticate,  bookRequestRoute);

module.exports = router;
