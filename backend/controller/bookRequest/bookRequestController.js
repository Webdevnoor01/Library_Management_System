// libraries
const createError = require("http-errors");

// Services
const requestBookService = require("../../service/requestBookService/requestBookService");
const userService = require("../../service/userService/userService");
const bookService = require("../../service/bookService/bookService");
const notificationService = require("../../service/notificationService/notificationService");

// Utilities
const findModel = require("../../util/findModel");
const customError = require("../../util/throwError");

class BookRequest {
    async newBookRequest(req, res) {
        const { bookId, userId } = req.query;
        try {
            const payload = {
                bookId,
                userId,
            };
            // console.log("payload: ", payload)
            const isRequestedBook =
                await requestBookService.findRequestedBookByProperty(payload);
            // console.log("isRequestedBook", isRequestedBook)
            if (!isRequestedBook.error)
                throw customError("You already send request for this book", 400);

            const requsetedBook = await requestBookService.newBookRequest(payload);
            if (requsetedBook) {
                const user = await userService.updateUserRef(
                    findModel(req.userRole), { _id: userId },
                    "requestedBookList",
                    requsetedBook._id
                );

                const book = await bookService.findBookByProperty({ _id: bookId });

                // Create payload to create new notification after sending book request
                const notificationPayload = {
                    message: `${
            user.data.studentName
              ? user.data.studentName
              : user.data.teacherName
          } send a request to issue ${book.bookName} book `,
                    sender: {
                        role: req.userRole,
                        userId: userId,
                        userName: user.data.studentName || user.data.teacherName,
                    },
                    reciever: {
                        role: ["libAdmin", "Assistant", "Staff"],
                    },
                };

                const notification = await notificationService.createNotification(
                    notificationPayload
                );
            }

            if (!requsetedBook) throw customError("something went wrong.");
            res.status(200).json({
                message: "Ok",
                requsetedBook,
            });
        } catch (e) {
            console.log(e);
            res.status(e.message.status).json({
                errors: {
                    requestedBook: {
                        msg: e.message.txt || e.message,
                    },
                },
            });
        }
    }

    async findRequestedBook(req, res) {
        try {
            const requestedBook = await requestBookService.findAllRequestedBook();
            if (!requestedBook) throw customError("No books found");

            res.status(200).json({
                message: "Ok",
                requestedBook,
            });
        } catch (e) {
            console.log(e);

            res.status(e.message.status).json({
                errors: {
                    requestedBook: {
                        msg: e.message.txt || e.message,
                    },
                },
            });
        }
    }

    async findUserRequestedBook(req, res) {
        const { userId } = req.params;
        try {
            const requestedBooks = await userService.findRequestedBook(
                findModel(req.userRole),
                userId
            );
            if (requestedBooks.error) throw customError(requestedBooks.message, 404);

            res.status(200).json({
                message: "Ok",
                requestedBooks: requestedBooks.data,
            });
        } catch (e) {
            res.status(e.message.status).json({
                errors: {
                    requestedBooks: {
                        msg: e.message.txt || e.message,
                    },
                },
            });
        }
    }
}

module.exports = new BookRequest();