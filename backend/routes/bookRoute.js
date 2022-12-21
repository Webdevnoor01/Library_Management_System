const router = require("express").Router();

const bookController = require("../controller/book/bookController");
const bookValidator = require("../middleware/book/bookValidator");
const imageUploader = require("../middleware/imageUploader/imageUploader");
const authenticateMiddlware = require("../middleware/authenticate/authenticate")
const bookCUDauthorization = require("../middleware/authorization/bookCUDauthorization")

router.post(
  "/create",
  authenticateMiddlware.authenticate,
  bookCUDauthorization.authorized,
  imageUploader.uploadImage("booksImg"),
  bookValidator.validate(),
  bookValidator.validationHandler,
  bookController.create
);

router.get("/find", bookController.findAllBooks);
router.get("/findBy", bookController.findBookByProperty);
router.patch("/update/:id", bookController.updateBook);
router.patch(
  "/update/img/:id",
  imageUploader.uploadImage("booksImg"),
  bookController.updateBook
);

module.exports = router;
