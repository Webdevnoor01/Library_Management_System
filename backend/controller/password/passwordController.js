const createError = require("http-errors");
const bcrypt = require("bcrypt");
const userService = require("../../service/userService/userService");
const findModel = require("../../util/findModel");
const UserDto = require("../../userDTO/userDto");

class PasswordController {
  async changePassword(req, res) {
    const { userId } = req.params;
    const { userRole } = req.user;
    try {
      if (!userId) {
        createError({
          message: {
            status: 400,
            txt: "Please provide userId as a params",
          },
        });
      }
      const { oldPassword, newPassword, conformNewPassword } = req.body;
      if (
        (oldPassword === undefined) ||
        (newPassword === undefined) ||
        (conformNewPassword === undefined)
      ) {
       throw createError({
          message: {
            status: 400,
            txt: "Please provide oldPassword, newPassword, conformNewPassword as a request body",
          },
        });
      }

      const model = findModel(userRole);
      const user = await userService.findUserByProperty(
        model,
        { _id: userId }
      );
      if (newPassword !== conformNewPassword) {
        throw createError({
          message: {
            status: 400,
            txt: "newPassword and conformNewPassword dosen't match",
          },
        });
      }

      const isValidPassword = await bcrypt.compare(oldPassword, user.password);
      if (!isValidPassword) {
       throw createError({
          message: {
            status: 400,
            txt: "Incorrect old password",
          },
        });
      }

      const hashPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashPassword
      await user.save()

      res.status(200).json({
        message:"Password change successfully",
        user: new UserDto(user),
      });
    } catch (e) {
      console.log(e.message);
      res.status(e.message.status || 500).json({
        errors: {
          [userRole]: {
            msg: e.message.txt,
          },
        },
      });
    }
  }
}

module.exports = new PasswordController();
