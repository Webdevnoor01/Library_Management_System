const router  = require("express").Router()

const bookController = require("../controller/book/bookController")
const bookValidator = require("../middleware/book/bookValidator")
const imageUploader = require("../middleware/imageUploader/imageUploader")

router.post(
    "/create",
    imageUploader.uploadImage,
    bookValidator.validate(),
    bookValidator.validationHandler,
    bookController.create
     )

module.exports = router