const LibraryAdmin = require("../../models/lAdmin");
const IssuedBook = require("../../models/issuedBook");
const Fine = require("../../models/fine");
const createError = require("http-errors");

class LibraryAdminService {
    async create(payload) {
        try {
            const libAdmin = await LibraryAdmin.create(payload);
            if (!libAdmin) {
                return {
                    error: true,
                    message: libAdmin,
                };
            }
            return {
                error: false,
                data: libAdmin,
            };
        } catch (e) {
            throw createError(e.message);
        }
    }

    async findByProperty(query) {
        try {
            let libAdmin;
            if (query._id) {
                libAdmin = await LibraryAdmin.findById(query._id);
                if (!libAdmin) {
                    return {
                        error: true,
                        message: "library admin not found",
                    };
                }
                return {
                    error: false,
                    message: libAdmin,
                };
            }
            libAdmin = await LibraryAdmin.findOne(query);
            if (!libAdmin) {
                return {
                    error: true,
                    message: "library admin not found",
                };
            }
            return {
                error: false,
                message: libAdmin,
            };
        } catch (e) {
            console.log(e);
            throw createError(e.message);
        }
    }

    async findAll() {
        try {
            let libAdmin = await LibraryAdmin.find({});
            console.log("libAdmin: ", libAdmin)
            if (libAdmin.length === 0) {
                return {
                    error: true,
                    message: "empty library admin",
                };
            }
            return {
                error: false,
                data: libAdmin,
            };
        } catch (e) {
            console.log(e);
            throw createError(e.message);
        }
    }

    async findUserFine(query) {
        try {
            const userFine = await Fine.find(query);
            if (userFine.length === 0) {
                return {
                    error: true,
                    message: "You don't have any fine",
                };
            }
            return {
                error: false,
                data: userFine,
            };
        } catch (e) {
            console.log("findUserFine-libAdminService: ", e);
            throw createError(e.message);
        }
    }

    async delete(payload) {
        try {
            const admin = await LibraryAdmin.deleteOne(payload);
            if (!admin) {
                return {
                    error: true,
                    message: "Error to delete library admin",
                };
            }

            return {
                error: false,
                data: admin,
            };
        } catch (e) {
            console.log(e);
            throw createError(e.message);
        }
    }
}

module.exports = new LibraryAdminService();