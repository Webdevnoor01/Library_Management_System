const createError = require("http-errors");
const Books = require("../../models/books");
const IssuedBooks = require("../../models/issuedBook");

class UserService {
    async createNewUser(model, payload) {
            try {
                const user = await model.create({...payload });
                return user;
            } catch (e) {
                return e;
            }
        }
        /**
         * 
         * @param {} model this is a mongoose model 
         * @param {object} query this is an object
         * @param {string} requiredFields 
         * @returns 
         */
    async findUserByProperty(model, query, requiredFields = null) {
        try {
            if (query === undefined) {
                return await model.find({},
                    "studentName email phone address requestedBookList libraryId "
                );
            }
            if (query._id) {
                const user = await model.findById(query._id, requiredFields);
                if (!user) return {
                    error: true,
                    message: "User not found"
                };

                return {
                    error: false,
                    data: user
                };
            }
            const user = await model.findOne(query, requiredFields);

            if (!user) return {
                error: true,
                message: "User not found"
            };

            return {
                error: false,
                data: user
            };
        } catch (e) {
            throw new Error(e.message);
        }
    }

    async findRequestedBook(model, userId) {
        try {
            const requestedBooks = await model
                .findById(userId, "requestedBookList")
                .populate("requestedBookList");
            console.log(requestedBooks.requestedBookList.length)
            if (requestedBooks.requestedBookList.length === 0) {
                return {
                    error: true,
                    message: "You don't have any requested book",
                };
            }
            return {
                error: false,
                data: requestedBooks.requestedBookList,
            };
        } catch (e) {
            console.log(e);
            throw createError(e.message);
        }
    }

    async findIssuedBooks(userId, isReturned) {
        try {
            const issuedBooks = await IssuedBooks.find({
                userId: userId,
                isReturned: isReturned
            });
            if (issuedBooks.length <= 0) {
                return {
                    error: true,
                    message: "You dont have any issued books",
                };
            }

            return {
                error: false,
                data: issuedBooks,
            };
        } catch (e) {
            throw createError(e.message);
        }
    }

    async updateUserRef(model, query, refField, payload) {
        try {
            let user;
            if (query._id) {
                user = await model.findByIdAndUpdate({ _id: query._id }, {
                    $push: {
                        [refField]: payload,
                    },
                });
            } else {
                user = await model.findOneAndUpdate(query, {
                    $push: {
                        [refField]: query.requestedBookId,
                    },
                });
            }
            if (!user)
                return {
                    error: true,
                    message: `error to update ${refField}`,
                };
            return {
                error: false,
                data: user,
            };
        } catch (e) {
            console.log(e);
            throw createError(e.message);
        }
    }

    async deleteUserRef(model, query, fieldName, idBeDeleted) {
        try {
            const deleteUserRef = await model.updateOne(query, {
                $pull: {
                    [fieldName]: idBeDeleted
                },
            });
            if (!deleteUserRef) {
                return {
                    error: true,
                    message: `error to delete ${refField}`,
                };
            }

            return {
                error: false,
                data: deleteUserRef,
            };
        } catch (e) {
            throw createError(e.message);
        }
    }

    async changePassword(model, userId, payload) {
        try {
            const user = await model.findByIdAndUpdate(userId, {...payload });
            if (!user) {
                return {
                    error: true,
                    message: user,
                };
            }
            return {
                error: false,
                data: user,
            };
        } catch (e) {
            throw createError(e.message);
        }
    }
}

module.exports = new UserService();