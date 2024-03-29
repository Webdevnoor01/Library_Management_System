const fs = require("fs");
const bookService = require("../../service/bookService/bookService");
const createError = require("http-errors");
const customError = require("../../util/throwError");

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
            const isBook = await bookService.findBookByProperty({ isbn: isbn });
            let book;
            if (isBook.error) {
                book = await bookService.createNewBook(bookPayload);
                if (!book) throw customError("something went wrong")
                res.status(200).json({
                    message: "Ok",
                    book,
                });
            } else {
                if (req.files) {
                    const path = req.files[0].path;
                    fs.unlink(path, (err) => {
                        if (err) {
                            throw customError("something went wrong");
                        }
                    });
                }

                throw customError("Already exists this book", 400)
            }
        } catch (e) {
            console.log(e);
            res.status(e.message.txt).json({
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

            if (books.error) {
                throw createError(books.message);
            }
            res.status(200).json({
                message: `Total ${books.data.length} books found`,
                books: books.data,
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

            if (book.error) {
                throw createError(book.message);
            }

            res.status(200).json({
                message: "Ok",
                book,
            });
        } catch (e) {
            res.status(400).json({
                errors: {
                    book: {
                        msg: e.message,
                    },
                },
            });
        }
    }

    async updateBook(req, res) {
        const { id } = req.params;
        const body = req.body;

        try {
            let payload = body;
            if (req.files) {
                payload = {
                    bookImage: req.files[0].path,
                };
            }
            const book = await bookService.updateBook(id, payload);
            if (!book) {
                throw createError("Something went wrong");
            }

            res.status(200).json({
                message: "Ok",
            });
        } catch (e) {
            console.log(e);
            res.status(400).json({
                errors: {
                    book: {
                        msg: e.message,
                    },
                },
            });
        }
    }
}

module.exports = new BookController();