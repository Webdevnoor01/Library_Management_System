const router= require("express").Router()
const profileController = require("../controller/profile/profileController")
const imageUploader = require("../middleware/imageUploader/imageUploader")




router.patch("/update",profileController.update)
router.patch("/update/avatar",imageUploader.uploadImage("userAvatar"), profileController.update)

module.exports = router