const bookService = require("../../service/bookService/bookService");
const createError = require("http-errors");

class BookController {
  async create(req, res) {
    const {
      bookName,
      authorName,
      bookEdition,
      bookQuantity,
      bookImage,
      isbn,
      almirahNo,
      category,
    } = req.body;

    try {
      const bookPayload = {
        bookName,
        authorName,
        bookEdition: req.body.bookEdition,
        bookQuantity: Number(bookQuantity),
        bookImage: req.files[0].path,
        isbn,
        almirahNo: +almirahNo,
        category,
      };

      const isBook = await bookService.findBookByIsbn(isbn);
      let book;
      if (!isBook) {
        book = await bookService.createNewBook(bookPayload);
        if (!book) {
          return createError("something went wrong");
        }
        res.status(200).json({
          message: "Ok",
          book,
        });
      } else {
        res.status(400).json({
          errors: {
            book: {
              msg: "Already exists this book",
            },
          },
        });
      }
    } catch (e) {
      res.status(500).json({
        errors: {
          book: {
            msg: e.massage,
          },
        },
      });
    }
  }

  async findAllBooks(_req, res) {
    try {
      const books = await bookService.findBooks();
      console.log(books);

      if (!books) {
        throw createError("No books found");
      }
      res.status(200).json({
        message: "Ok",
        books,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        errors: {
          book: {
            msg: e.message,
          },
        },
      });
    }
  }

  async findBookByProperty(req, res) {
    const { isbn, authorName, bookName } = req.query;
    try {
      if (!req.query) throw createError("Please type search option");
      const searchQuary = {
        isbn,
        authorName,
        bookName,
      };
      const book = await bookService.findBookByProperty(searchQuary);

      if (!book) throw createError("No book found");

      res.status(200).json({
        message: "Ok",
        book,
      });
    } catch (e) {}
  }
}

module.exports = new BookController();
