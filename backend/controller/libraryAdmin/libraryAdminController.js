const bcrypt = require("bcrypt");
const createError = require("http-errors");

const LibraryAdmin = require("../../models/lAdmin");

const libraryAdminService = require("../../service/libraryAdminService/libraryAdminService");
const issuedBookService = require("../../service/issuedBookService/issuedBookService");
const userService = require("../../service/userService/userService");
const requestedBookService = require("../../service/requestBookService/requestBookService");
const bookService = require("../../service/bookService/bookService");
const notificationService = require("../../service/notificationService/notificationService");
const libraryStaffService = require("../../service/libraryStaffService/libraryStaffService");

const findModel = require("../../util/findModel");
const {
    renewDate: generateRenewDate,
} = require("../../util/generateRenewData");
const customeError = require("../../util/throwError");

const UserDto = require("../../userDTO/userDto");
const fineService = require("../../service/fineService/fineService");
const returnBookService = require("../../service/returnBookService/returnBookService");
const renewBookService = require("../../service/renewBookService/renewBookService");

class LibraryAdminController {
    async createAdmin(req, res) {
        const { name, userId, email, phone, password } = req.body;

        try {
            const isLibAdmin = await libraryAdminService.findByProperty({
                email: email,
            });
            if (isLibAdmin.error) throw customeError(isLibAdmin.message);
            // Hash the password
            const hashPassword = await bcrypt.hash(password, 10);
            const payload = {
                name,
                userId,
                email,
                phone,
                password: hashPassword,
            };
            const libAdmin = await libraryAdminService.create(payload);

            if (libAdmin.error) throw customeError(libAdmin.message);

            delete libAdmin.data.password;
            res.status(201).json({
                message: "New library admin created successfully",
                libraryAdmin: libAdmin.data,
            });
        } catch (e) {
            console.log(e);
            res.status(e.message.status).json({
                errors: {
                    libraryAdmin: {
                        msg: e.message.txt,
                    },
                },
            });
        }
    }
    async findUserRequestedBook(req, res) {
        const { userId } = req.params;
        try {
            const requestedBookPayload = {
                userId: userId,
            };
            const requestedBooks = await requestedBookService.findAllRequestedBook(
                requestedBookPayload
            );
            if (requestedBooks.error) throw customeError(requestedBooks.message);
            res.status(200).json({
                message: `total ${requestedBooks.data.length} book request send this user`,
                requestedBooks: requestedBooks.data,
            });
        } catch (e) {
            console.log("findUserRequestdBooks-libraryAdminController: ", e);
            res.status(e.message.status).json({
                errors: {
                    libraryAdmin: {
                        msg: e.message.txt || e.message,
                    },
                },
            });
        }
    }
    async acceptRequestedBook(req, res) {
        const { requestedBookId, requestedUserRole } = req.body;

        try {
            if (!(requestedBookId && requestedUserRole))
                throw customeError("plese provide all required fields", 400);

            const isRequestedBook =
                await requestedBookService.findRequestedBookByProperty({
                    _id: requestedBookId,
                });
            if (isRequestedBook.error)
                throw customeError("You don't send requst for this book", 400);
            const isBook = await bookService.findBookByProperty({
                _id: `${isRequestedBook?.data?.bookId}`,
            });
            if (isBook.error) throw customeError(isBook.message);

            // Check that you are issued this book or not
            const { userId, bookId } = isRequestedBook.data;
            const isIssued = await issuedBookService.findIssuedBookByProperty({
                userId: userId,
                bookId: bookId,
                isReturned: false,
            });
            if (!isIssued.error)
                throw customeError("You already issue this book", 400);

            const issuedBookPayload = {
                userId: userId,
                bookId: bookId,
                bookName: isBook.data.bookName,
                whoIssued: req.user.userName,
                renewDate: `${generateRenewDate()}`,
            };
            const user = await userService.findUserByProperty(
                findModel(requestedUserRole), { _id: userId },
                "studentName teacherName userRole "
            );
            const book = await bookService.findBookByProperty({ _id: bookId },
                "bookName"
            );
            if (!user && book.error) throw customeError("User and book not found");
            const issuedBook = await issuedBookService.createIssueBook(
                issuedBookPayload
            );
            if (issuedBook.error) throw customeError(issuedBook.message);
            const deleteRequestedBook =
                await requestedBookService.deleteRequestedBook(requestedBookId);
            if (deleteRequestedBook.error) {
                throw createError({
                    message: deleteRequestedBook.message,
                });
            }

            const notificationPayload = {
                message: `${
          user.studentName || user.teacherName
        } your request has been accepted for this book ${
          book.data.bookName
        }. Go to the libray and grab it. `,
                sender: {
                    role: req.user.userRole,
                    userId: req.user._id,
                    userName: req.user.userName,
                },
                reciever: {
                    role: user.userRole,
                    userId: user._id,
                    userName: user.studentName || user.teacherName || user.name,
                },
            };
            const newNotification = await notificationService.createNotification(
                notificationPayload
            );
            if (newNotification.error) {
                console.log(newNotification.message);
            }

            const updateUserRef = await userService.updateUserRef(
                findModel(requestedUserRole), { _id: userId },
                "issuedBookList",
                issuedBook.data.bookId
            );

            const deleteUserRef = await userService.deleteUserRef(
                findModel(user.userRole), { _id: user._id },
                "requestedBookList",
                requestedBookId
            );

            res.status(200).json({
                message: "Ok",
                issuedBook: issuedBook.data,
                notification: newNotification.data.message,
                updateIssuedBookList: !updateUserRef.error,
                deleteRequestedBookId: !deleteUserRef.error,
            });
        } catch (e) {
            res.status(e.message.status).json({
                errors: {
                    libraryAdmin: {
                        msg: e.message.txt,
                    },
                },
            });
        }
    }

    async findLibraryStaff(req, res) {
        const { staffId } = req.query;
        try {
            let staff;
            if (!staffId) {
                staff = await libraryStaffService.findLibraryStaffByProperty();
            } else {
                staff = await libraryStaffService.findLibraryStaffByProperty({
                    id: staffId,
                });
            }

            if (staff.error) throw customeError(staff.message);

            res.status(200).json({
                data: staff.data,
            });
        } catch (e) {
            console.log(e);
            res.status(e.message.status).json({
                errors: {
                    libraryAdmin: {
                        msg: e.message.txt,
                    },
                },
            });
        }
    }

    async deleteLibraryStaff(req, res) {
        const { staffId } = req.params;
        try {
            if (!staffId) throw customeError("Please provide staffId", 400);

            const isStaff = await libraryStaffService.findLibraryStaffByProperty({
                id: staffId,
            });
            if (isStaff.error) throw customeError(isStaff.message, 400);
            const staff = await libraryStaffService.delete(staffId);
            const { userRole } = isStaff.data;
            if (staff.error) throw customeError(staff.message);
            res.status(200).json({
                status: "Ok",
                message: `${userRole} deleted successfully`,
                data: isStaff.data,
            });
        } catch (e) {
            console.log(e);
            res.status(e.message.status).json({
                errors: {
                    libraryAdmin: {
                        msg: e.message.txt,
                    },
                },
            });
        }
    }

    async updateLibraryStaff(req, res) {
        const { staffId } = req.params;
        const { userRole } = req.body;
        try {
            const isStaff = await libraryStaffService.findLibraryStaffByProperty({
                id: staffId,
            });
            if (isStaff.error) throw customeError(isStaff.message, 400);
            const payload = {
                userRole: userRole,
            };
            if (!userRole)
                throw customeError(
                    "You can't update anything of library staffs except User Role",
                    400
                );
            //TODO: Fix this login later when you want to do it
            //   if(( userRole !== "Assistant" )|| (userRole !== "Staff")){
            //     throw createError({
            //         message: {
            //           status: 400,
            //           txt: "You provide wrong userRole. Please provide valid userRole",
            //         },
            //       });
            //   }

            const staff = await libraryStaffService.update(staffId, payload);
            if (staff.error) throw customeError(staff.message, 400);
            res.status(200).json({
                message: `${userRole} update successfully`,
            });
        } catch (e) {
            console.log(e);
            res.status(e.message.status).json({
                errors: {
                    libraryAdmin: {
                        msg: e.message.txt,
                    },
                },
            });
        }
    }

    async findUserFine(req, res) {
        const { userId } = req.params;
        console.log(req.params);
        try {
            if (!userId)
                throw customeError(
                    "userId is required. please give them as url params",
                    400
                );
            const findFineQuery = {
                userId,
            };
            const userFine = await libraryAdminService.findUserFine(findFineQuery);
            if (userFine.error) customeError(userFine.message, 400);
            console.log("fines: ", userFine.data);
            return res.status(200).json({
                messaga: "Your fines",
                fines: userFine.data,
            });
        } catch (e) {
            console.log("findUserFine-libAdminController: ", e);
            res.status(e.message.status).json({
                errors: {
                    libAdmin: {
                        msg: e.message.txt || e.message,
                    },
                },
            });
        }
    }

    async payBookFine(req, res) {
        const { userId, bookId, amount } = req.body;
        const { userRole } = req.user;
        try {
            const fine = await fineService.findFineByBookId({ userId, bookId });
            if (fine.error) throw customeError(fine.message, 400);

            if (
                fine.data.amount === amount ||
                fine.data.paidAmount + amount >= amount
            ) {
                const deleteFine = await fineService.deleteFine({ _id: fine.data._id });

                const deleteUserRef = await userService.deleteUserRef(
                    findModel(userRole), { _id: userId },
                    "fine",
                    fine.data._id
                );

                const isIssuedBook = await issuedBookService.findIssuedBookByProperty({
                    bookId,
                });
                const updateIssuedBookPayload = {
                    renewDate: generateRenewDate(15),
                };
                const issuedBook = await issuedBookService.updateIssuedBook(
                    isIssuedBook.data._id,
                    updateIssuedBookPayload
                );
                return res.status(200).json({
                    messaga: "Your fine is cleared. Now you can return your book",
                    deleteUserRef: !deleteUserRef.error,
                    updateRenewData: !issuedBook.error,
                    deleteFine: !deleteFine.error,
                });
            }

            fine.data.paidAmount = amount;
            await fine.data.save();

            res.status(200).json({
                message: "your fine is updated",
                fine: fine.data,
                renewDateUpdate: !issuedBook.error,
            });
        } catch (e) {
            res.status(e.message.status).json({
                errors: {
                    libraryAdmin: {
                        msg: e.message.txt || e.message,
                    },
                },
            });
        }
    }

    async findReturnRequest(req, res) {
        const { userId } = req.params;
        try {
            const returnRequest = await returnBookService.findReturnRequest({
                userId,
            });
            if (returnRequest.error) throw customeError(returnRequest.message, 400);
            res.status(200).json({
                message: `${returnRequest.data.length} return request found`,
                returnRequest: returnRequest.data,
            });
        } catch (e) {
            console.log("findReturnRequest-libraryAdminController: ", e);
            res.status(e.message.status).json({
                errors: {
                    libraryAdmin: {
                        msg: e.message.txt || e.message,
                    },
                },
            });
        }
    }

    async acceptReturnBookRequest(req, res) {
        const { issuedBookId, userRole } = req.body;
        const { userId } = req.params;
        try {
            if (!issuedBookId || !userId || !userRole)
                throw customeError(
                    "uesrId, userRole and issuedBookId is required.",
                    400
                );
            const isReturnBookRequest = await returnBookService.findReturnRequest({
                issuedBookId,
            });
            if (isReturnBookRequest.error)
                throw customeError(isReturnBookRequest.message, 404);
            const { data: bookData, error: bookError } =
            await issuedBookService.findIssuedBookByProperty({
                _id: issuedBookId,
            });

            if (!bookError) {
                (bookData.isReturned = true), (bookData.renewData = null);
                await bookData.save();
                // await issuedBookService.updateIssuedBook(userId,{
                //   took: bookData.took +1,
                //   isReturned:true,
                //   renewDate: null
                // })
            } else {
                (bookData.isReturned = true), (bookData.renewData = null);
                await bookData.save();
            }

            const deleteReturnBook = await returnBookService.deleteReturnBookRequest({
                userId,
                issuedBookId,
            });
            if (deleteReturnBook.error) throw customeError(deleteReturnBook.message);

            const user = await userService.findUserByProperty(findModel(userRole), {
                _id: userId,
            });

            const {
                data: { bookName },
            } = await bookService.findBookByProperty({ _id: bookData.bookId });

            const notificationPayload = {
                message: `${
          user.studentName || user.teacherName
        } your  ${bookName} book returned successfully`,
                sender: {
                    role: req.user.userRole,
                    userId: req.user._id,
                    userName: req.user.userName,
                },
                reciever: {
                    role: user.userRole,
                    userId: user._id,
                    userName: user.studentName || user.teacherName || user.name,
                },
            };

            const notification = await notificationService.createNotification(
                notificationPayload
            );
            res.status(200).json({
                message: notificationPayload.message,
                notificationSent: !notification.error,
            });
        } catch (e) {
            console.log("acceptReturnRequest-libraryAdminController: ", e);
            res.status(e.message.status || 500).json({
                errors: {
                    libraryAdmin: {
                        msg: e.message.txt || e.message,
                    },
                },
            });
        }
    }

    async findRenewRequest(req, res) {
        const { userId } = req.params;
        try {
            const renewRequests = await renewBookService.findRenewRequests({
                userId,
            });
            if (renewRequests.error) throw customeError(renewRequests.message, 404);
            res.status(200).json({
                message: `${renewRequests.data.length} renew book request found`,
                renewRequests: renewRequests.data,
            });
        } catch (e) {
            console.log("libraryAdminController: ", e);
            res.status(e.message.status).json({
                errors: {
                    libraryAdmin: {
                        txt: e.message.txt || e.message,
                    },
                },
            });
        }
    }

    async acceptRenewRequest(req, res) {
        const { userId } = req.params;
        const { issuedBookId, userRole } = req.body;
        try {
            if (!issuedBookId || !userId || !userRole)
                throw customeError(
                    "Please provide userId, issuedBookId and userRole",
                    400
                );
            const isRenewRequest = await renewBookService.findRenewRequestByUserId({
                userId,
                issuedBookId,
            });
            if (isRenewRequest.error) throw customeError(isRenewRequest.message, 404);

            const isIssuedBook = await issuedBookService.findIssuedBookByProperty({
                _id: issuedBookId,
            });
            if (isIssuedBook.error) throw customeError(isIssuedBook.message, 404);
            isIssuedBook.data.renewDate = generateRenewDate(15);
            await isIssuedBook.data.save();
            const user = await userService.findUserByProperty(findModel(userRole), {
                _id: userId,
            });
            const book = await bookService.findBookByProperty({
                _id: isIssuedBook.data.bookId,
            });

            const notificationPayload = {
                message: `${
          user.studentName || user.teacherName
        } your renew request has been accepted for this book ${
          book.data.bookName
        }.Now your next renew date is ${isIssuedBook.data.renewDate} `,
                sender: {
                    role: req.user.userRole,
                    userId: req.user._id,
                    userName: req.user.userName,
                },
                reciever: {
                    role: user.userRole,
                    userId: user._id,
                    userName: user.studentName || user.teacherName || user.name,
                },
            };
            const newNotification = await notificationService.createNotification(
                notificationPayload
            );
            if (newNotification.error) {
                console.log(newNotification.message);
            }

            const deleteRenewRequest = await renewBookService.deleteRenewRequest({
                userId,
                issuedBookId,
            });

            res.status(200).json({
                message: notificationPayload.message,
                renewedBook: isIssuedBook.data,
                renewBookDelete: !deleteRenewRequest.error,
            });
        } catch (e) {
            res.status(e.message.status || 500).json({
                errors: {
                    libraryAdmin: {
                        msg: e.message.txt,
                    },
                },
            });
        }
    }
}

module.exports = new LibraryAdminController();