const router = require("express").Router();
const libraryCardRoute = require("./libraryCard");
const authRoute = require("./authRoute");

router.use("/api/v1/libraryCard", libraryCardRoute);
router.use("/api/v1/auth/s", authRoute);

module.exports = router;
