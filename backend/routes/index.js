const router = require("express").Router();
const libraryAdminRoute =require("./libraryAdminRoute")
const libraryCardRoute = require("./libraryCard");
const studentAuthRoute = require("./studentAuth");
const studentRoute = require("./studentRoute")
const teacherAuthRoute = require("./teacherAuth");
const bookRoute = require("../routes/bookRoute");
const bookRequestRoute = require("../routes/bookRequestRoute");
const profileRouter = require("./profileRoute")
const authenticateMiddleware = require("../middleware/authenticate/authenticate");
const libraryAssistantRoute = require("../routes/libraryAssistantRoute")

// Admin Routes
router.use("/api/v1/libAdmin", libraryAdminRoute )


router.use("/api/v1/libraryCard", authenticateMiddleware.authenticate, libraryCardRoute);

router.use("/api/v1/auth/student", studentAuthRoute);
router.use("/api/v1/student",authenticateMiddleware.authenticate, studentRoute)

router.use("/api/v1/auth/teacher", teacherAuthRoute);

router.use("/api/v1/libAssistant", libraryAssistantRoute)

router.use("/api/v1/book", bookRoute);

router.use("/api/v1/bookRequest",authenticateMiddleware.authenticate,  bookRequestRoute);

router.use("/api/v1/profile",authenticateMiddleware.authenticate, profileRouter )

module.exports = router;
