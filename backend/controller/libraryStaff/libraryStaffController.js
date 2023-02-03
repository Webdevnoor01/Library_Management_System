const createError = require("http-errors");
const libraryStaffService = require("../../service/libraryStaffService/libraryStaffService");
const bcrypt = require("bcrypt");
const UserDto = require("../../userDTO/userDto");
const customeError = require("../../util/throwError");
class LibraryStaffController {
    async register(req, res) {
        const { name, email, phone, password, userRole } = req.body;
        try {
            const hashPassword = await bcrypt.hash(password, 10);
            const payload = {
                name,
                email,
                phone,
                password: hashPassword,
                userRole,
            };

            const isLibraryStaff =
                await libraryStaffService.findLibraryStaffByProperty({ email: email });
            console.log(!isLibraryStaff.error);
            if (!isLibraryStaff.error)
                throw customeError(`${userRole} already exist`, 400);
            const libraryStaff = await libraryStaffService.create(payload);
            if (libraryStaff.error) throw customeError(libraryStaff.message);
            res.status(200).json({
                message: `${userRole} has been created`,
                data: new UserDto(libraryStaff.data),
            });
        } catch (e) {
            res.status(e.message.status || 500).json({
                errors: {
                    libraryStaff: {
                        msg: e.message.txt,
                    },
                },
            });
        }
    }
}

module.exports = new LibraryStaffController();