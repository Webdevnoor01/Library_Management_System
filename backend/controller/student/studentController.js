const userService = require("../../service/userService/userService");
const requestBookService = require("../../service/requestBookService/requestBookService");
const notificationService = require("../../service/notificationService/notificationService");
const fineService = require("../../service/fineService/fineService");
const issuedBookService = require("../../service/issuedBookService/issuedBookService");
const returnBookService = require("../../service/returnBookService/returnBookService");
const renewBookService = require("../../service/renewBookService/renewBookService");
const libraryCardService = require("../../service/libraryCardService/index")
const findModel = require("../../util/findModel");
const customError = require("../../util/throwError");

class StudentController {
    async findRequestedBook(req, res) {
        const { userId } = req.params;

        try {
            const requestedBooks = await userService.findRequestedBook(
                findModel(req.user.userRole),
                userId
            );
            if (requestedBooks.error) throw customError(requestedBooks.message);

            res.status(200).json({
                message: "Ok",
                requestedBooks: requestedBooks.data,
            });
        } catch (e) {
            res.status(e.message.status).json({
                errors: {
                    student: {
                        msg: e.message.txt || e.message,
                    },
                },
            });
        }
    }
    async findIssuedBooks(req, res) {
        const { _id: userId, userRole } = req.user;
        try {
            const issuedBooks = await userService.findIssuedBooks(userId, false);
            if (issuedBooks.error) throw customError(issuedBooks.message);

            res.status(200).json({
                message: "your issued books",
                data: await issuedBooks.data,
            });
        } catch (e) {
            console.log(e);
            res.status(e.message.status || 500).json({
                errors: {
                    student: {
                        msg: e.message.txt,
                    },
                },
            });
        }
    }

    async findReturnedBook(req, res) {
        const { userId } = req.params;
        try {
            if (!userId) throw customError("userId is required", 400);

            const returnedBook = await userService.findIssuedBooks(userId, true);
            if (returnedBook.error)
                throw customError("You don't have any returned book");

            res.status(200).json({
                message: `You have total ${returnedBook.data.length}`,
                returnedBooks: returnedBook.data,
            });
        } catch (e) {
            console.log("findReturnedBook-userService: ", e);
            res.status(e.message.status).json({
                errors: {
                    userController: {
                        msg: e.message.txt || e.message,
                    },
                },
            });
        }
    }

    async findStudents(req, res) {
        try {
            const students = await userService.findUserByProperty(
                findModel(req.user.userRole), { _id: req.user._id },
                "studentName email phone requestedBookList issuedBookList fine"
            );
            if (!students) throw customError("Student not found");

            res.status(200).json({
                message: "Ok",
                students,
            });
        } catch (e) {
            res.status(e.message.status).json({
                errors: {
                    student: {
                        msg: e.message.txt || e.message,
                    },
                },
            });
        }
    }

    async deleteRequestedBook(req, res) {
        const { userId, fieldName, requestedBookId } = req.query;
        try {
            if (!userId || !fieldName || !requestedBookId)
                throw customError(
                    "Please provide userId, fieldName, and requestedBookId"
                );
            // Delete requested bookId from user requestedBookList
            const requestedBookList = await userService.deleteUserRef(
                findModel(req.user.userRole), { _id: userId },
                fieldName,
                requestedBookId
            );
            if (requestedBookList.error)
                throw customError(
                    "error to delete requested book id from user requestedBookList"
                );

            // Find the requestedBook for deletion
            let requestedBook = await requestBookService.findRequestedBookByProperty({
                _id: requestedBookId,
            });
            if (requestedBook.error) throw customError(requestedBook.message);

            // delete the requested book
            requestedBook = await requestBookService.deleteRequestedBook(
                requestedBookId
            );
            if (requestedBook.error) throw customError(requestedBook.message);

            // Finaly send the response to the user
            res.status(200).json({
                message: `Deleted requestedBookId ${requestedBookId} from requestedBookList `,
                requestedBook: requestedBook.data,
            });
        } catch (e) {
            console.log("deleteRequestedBook: ", e);
            res.status(e.message.status || 500).json({
                errors: {
                    [req.user.userRole]: {
                        msg: e.message.txt || e.message,
                    },
                },
            });
        }
    }

    async getNotification(req, res) {
        const { userRole, _id: userId, userName } = req.user;

        try {
            const query = {
                "reciever.role": userRole,
                "reciever.userId": userId,
                "reciever.userName": userName,
            };
            const notification = await notificationService.findNotificationByProperty(
                query
            );

            if (notification.error) throw customError(notification.message);

            res.status(200).json({
                status: `You have ${notification.data.length} notifications`,
                notifications: notification.data,
            });
        } catch (e) {
            res.status(500).json({
                errors: {
                    student: {
                        msg: e.message,
                    },
                },
            });
        }
    }

    async returnBook(req, res) {
        const { issuedBookId, libraryId } = req.body;
        const { userRole, _id: userId } = req.user;
        try {
            if (!userId || !issuedBookId || !libraryId || !userRole)
                throw customError("Please provide userId, libraryId, issuedBookId, and userRole", 400);

            const { data: userData, error: userError } = await userService.findUserByProperty(findModel(userRole), { _id: userId })
            console.log("userData: ", userData)
            if (userData.libraryId !== libraryId) throw customError("please provide valid libraryId", 400)

            const returnRequestQuery = {
                issuedBookId,
                userId,
            };
            const isReturnRequest = await returnBookService.findReturnRequest(
                returnRequestQuery
            );
            if (!isReturnRequest.error) {
                throw customError("You already send request to return this book", 400);
            }

            const issuedBook = await issuedBookService.findIssuedBookByProperty({
                _id: issuedBookId,
            });
            if (issuedBook.error) throw customError(issuedBook.message, 400);

            const { bookId, renewDate } = issuedBook.data;

            const renewTime = new Date(renewDate).getTime();
            const day = Math.round((Date.now() - renewTime) / 86400000);
            const totalFine = day * 3;

            if (Date.now() > renewTime) {
                const fine = await fineService.findFineByBookId({ bookId: bookId });
                if (!fine.error) {
                    if (Date.now() > renewTime) {
                        const finePayload = {
                            amount: totalFine,
                            bookId,
                            userId,
                        };

                        const newFine = await fineService.createFine(finePayload);
                        if (newFine.error) throw customError(newFine.message);

                        const user = await userService.updateUserRef(
                            findModel(userRole), { _id: userId },
                            "fine",
                            newFine.data._id
                        );

                        return res.status(401).json({
                            fineId: newFine.data._id,
                            updateUserFine: !user.error,
                            message: `Your renew date is over, you are ${day} day's late from today and your total fine is ₹${
                day * 3
              }.00. So go to the library and clear then fine ten send request for return book `,
                        });
                    }
                } else {
                    if (fine.data.amount > totalFine) {
                        fine.data.amount = totalFine;
                        await fine.data.save();
                    }
                    return res.status(401).json({
                        fineId: fine.data._id,
                        updateUserFine: "updated",
                        message: `Your renew date is over, you are ${day} day's late from today and your total fine is ₹${
              day * 3
            }.00. So go to the library and clear then fine ten send request for return book `,
                    });
                }
            }

            const returnRequestPaylad = {
                userId,
                issuedBookId,
                libraryId
            };
            const returnRequest = await returnBookService.createNewReturnRequest(
                returnRequestPaylad
            );

            if (returnRequest.error) throw customError(returnRequest.message, 400);

            res.status(200).json({
                message: "Your request acceptd. We will inform you when it will be accept",
            });
        } catch (e) {
            console.log(e);
            res.status(e.message.status || 500).json({
                errors: {
                    [userRole]: {
                        msg: e.message.txt || e.message,
                    },
                },
            });
        }
    }

    async renewBook(req, res) {
        const { userId } = req.params;
        const { issuedBookId, libraryId } = req.body;
        const { userRole } = req.user
        try {
            if (!userId || !issuedBookId || !libraryId || !userRole)
                throw customError("Please provide userId, libraryId, issuedBookId, and userRole", 400);

            const { data: userData, error: userError } = await userService.findUserByProperty(findModel(userRole), { _id: userId })
            if (userData.libraryId !== libraryId) throw customError("please provide valid libraryId", 400)

            const issuedBook = await issuedBookService.findIssuedBookByProperty({
                _id: issuedBookId,
            });

            const { bookId, renewDate } = issuedBook.data;
            const renewTime = new Date(renewDate).getTime();
            const day = Math.round((Date.now() - renewTime) / 86400000);
            const totalFine = day * 3;
            if (Date.now() > renewTime) {
                const fine = await fineService.findFineByBookId({ bookId: bookId });
                if (!fine.error) {
                    if (Date.now() > renewTime) {
                        const finePayload = {
                            amount: totalFine,
                            bookId,
                            userId,
                        };

                        const newFine = await fineService.createFine(finePayload);
                        if (newFine.error) throw customError(newFine.message);

                        const user = await userService.updateUserRef(
                            findModel(userRole), { _id: userId },
                            "fine",
                            newFine.data._id
                        );

                        return res.status(401).json({
                            fineId: newFine.data._id,
                            updateUserFine: !user.error,
                            message: `Your renew date is over, you are ${day} day's late from today and your total fine is ₹${
                day * 3
              }.00. So go to the library and clear then fine ten send request for renew book `,
                        });
                    }
                } else {
                    if (fine.data.amount > totalFine) {
                        fine.data.amount = totalFine;
                        await fine.data.save();
                    }
                    return res.status(401).json({
                        fineId: fine.data._id,
                        updateUserFine: "updated",
                        message: `Your renew date is over, you are ${day} day's late from today and your total fine is ₹${
              day * 3
            }.00. So go to the library and clear then fine ten send request for renew book `,
                    });
                }
            }

            const findRenewBookPayload = {
                userId,
                issuedBookId,
            };
            const isRenewRequest = await renewBookService.findRenewRequestByUserId(
                findRenewBookPayload
            );
            if (!isRenewRequest.error)
                throw customError("You already send request for renew this book", 400);

            const renewRequestBookPayload = {
                userId,
                issuedBookId,
                libraryId
            };
            const newRenewRequest = await renewBookService.createNewRenewRequest(
                renewRequestBookPayload
            );
            if (newRenewRequest.error) {
                throw customError(newRenewRequest.message);
            }

            res.status(200).json({
                message: "Successfully send request for renew this book",
                data: newRenewRequest.data,
            });
        } catch (e) {
            console.log(e.message);
            res.status(e.message.status || 500).json({
                errors: {
                    student: {
                        msg: e.message.txt || e.message,
                    },
                },
            });
        }
    }
}

module.exports = new StudentController();