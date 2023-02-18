const router = require("express").Router();
const libraryAdminRoute = require("./libraryAdminRoute")
const libraryCardRoute = require("./libraryCard");
const studentAuthRoute = require("./studentAuth");
const studentRoute = require("./studentRoute")
const teacherAuthRoute = require("./teacherAuth");
const teacherRoute = require("./teacherRoute")
const bookRoute = require("../routes/bookRoute");
const bookRequestRoute = require("../routes/bookRequestRoute");
const profileRouter = require("./profileRoute")
const libraryAssistantRoute = require("../routes/libraryAssistantRoute")
const passwordRouter = require("../routes/password")
const authenticateMiddleware = require("../middleware/authenticate/authenticate");



// Admin Routes
router.use("/api/v1/libAdmin", libraryAdminRoute)

// Library Card Route
router.use("/api/v1/libraryCard", authenticateMiddleware.authenticate, libraryCardRoute);

// Student Route
router.use("/api/v1/auth/student", studentAuthRoute);
router.use("/api/v1/student", authenticateMiddleware.authenticate, studentRoute)

// Teacher Route
router.use("/api/v1/auth/teacher", teacherAuthRoute);
router.use("/api/v1/teacher", authenticateMiddleware.authenticate, teacherRoute)

// Library Assistant Route
router.use("/api/v1/libAssistant", libraryAssistantRoute)

// Book Route
router.use("/api/v1/book", authenticateMiddleware.authenticate, bookRoute);

// Book Request Route
router.use("/api/v1/bookRequest", authenticateMiddleware.authenticate, bookRequestRoute);

// Profile Route
router.use("/api/v1/profile", authenticateMiddleware.authenticate, profileRouter)

// Password Route
router.use("/api/v1/password", authenticateMiddleware.authenticate, passwordRouter)

module.exports = router;