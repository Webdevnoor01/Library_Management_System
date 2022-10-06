const router = require("express").Router();

const bookController = require("../controller/book/bookController");
const bookValidator = require("../middleware/book/bookValidator");
const imageUploader = require("../middleware/imageUploader/imageUploader");

router.post(
  "/create",
  imageUploader.uploadImage,
  bookValidator.validate(),
  bookValidator.validationHandler,
  bookController.create
);

router.get("/find", bookController.findAllBooks);
router.get("/findBy", bookController.findBookByProperty);

module.exports = router;
