const router = require("express").Router();
const libraryCardRoute = require("./libraryCard");
const studentAuthRoute = require("./studentAuth");

router.use("/api/v1/libraryCard", libraryCardRoute);
router.use("/api/v1/auth", studentAuthRoute);

module.exports = router;
