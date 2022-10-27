const router= require("express").Router()
const profileController = require("../controller/profile/profileController")
const imageUploader = require("../middleware/imageUploader/imageUploader")




router.patch("/update/:userId",profileController.update)
router.patch("/update/avatar/:userId",imageUploader.uploadImage("userAvatar"), profileController.update)

module.exports = router