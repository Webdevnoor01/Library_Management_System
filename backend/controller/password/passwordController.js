const createError = require("http-errors");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const userService = require("../../service/userService/userService");
const findModel = require("../../util/findModel");
const UserDto = require("../../userDTO/userDto");
const isValidEmail = require("../../util/isValidEmail");
const otpService = require("../../service/otpService/otpService");
const hashService = require("../../service/hashService/hashService");

const customError = require("../../util/throwError");
class PasswordController {
  async changePassword(req, res) {
    const { userId } = req.params;
    const { userRole } = req.user;
    try {
      if (!userId) throw customError("Please provide userId as a params", 400);

      const { oldPassword, newPassword, conformNewPassword } = req.body;
      if (
        oldPassword === undefined ||
        newPassword === undefined ||
        conformNewPassword === undefined
      )
        throw customError(
          "Please provide oldPassword, newPassword, conformNewPassword as a request body",
          400
        );

      const model = findModel(userRole);
      const user = await userService.findUserByProperty(model, { _id: userId });
      if (newPassword !== conformNewPassword)
        throw customError(
          "newPassword and conformNewPassword dosen't match",
          400
        );

      const isValidPassword = await bcrypt.compare(oldPassword, user.password);
      if (!isValidPassword) throw customError("Incorrect old password", 400);

      const hashPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashPassword;
      await user.save();

      res.status(200).json({
        message: "Password change successfully",
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

  async sendOtp(req, res) {
    const { email } = req.body;
    try {
      if (!email) throw customError("Email is required", 400);

      if (!isValidEmail(email))
        throw customError("Please type valid email", 400);

      const otp = otpService.generateOtp();

      const tte = Date.now() + 1000 * 60 * 5;
      const data = `${email}.${otp}.${tte}`;
      const hashOtp = await hashService.hashOtp(data);

      const otpSend = await otpService.sendOtp(
        email,
        otp,
        "OTP for forgating password"
      );
      if (otpSend.error) throw customError(otpSend.message, 400);
      res.status(200).json({
        hashOtp: `${hashOtp}.${tte}`,
      });
    } catch (e) {
      console.log("password-controller-error: ", e);
      res.status(e.message.status || 500).json({
        errors: {
          password: {
            msg: e.message.txt,
          },
        },
      });
    }
  }

  async verifyOtp(req, res) {
    const { hashedOtp, otp, newPassword, conformNewPassword, email } = req.body;
    const { userRole, _id: userId } = req.user;
    try {
      if (!otp || !newPassword || !conformNewPassword || !email)
        throw customError(
          "hashedOtp, otp, newPassword, conformNewPassword, email all filed required",
          400
        );

      const [hash, expire] = hashedOtp.split(".");
      const data = `${email}.${otp}.${expire}`;

      // Create new hash otp
      const newHashedOtp = await hashService.hashOtp(data);

      // verify otp
      const verify = await otpService.virifyOtp(hash, newHashedOtp, expire);
      if (verify.error) throw customError(verify.message, 400);
      if (newPassword !== conformNewPassword)
        throw customError("password dosen't match", 400);

      // hash the password
      const hashPassword = await bcrypt.hash(newPassword, 10);

      const payload = {
        password: hashPassword,
      };
      // Update user passwrod
      const user = await userService.changePassword(
        findModel(userRole),
        userId,
        payload
      );
      if (user.error) throw customError(user.message, 400);

      res.status(200).json({
        message: "OTP hasbeen verifyed and password change successfully",
      });
    } catch (e) {
      console.log("password-controller: ", e);
      res.status(e.message.status || 500).json({
        errors: {
          password: {
            msg: e.message.txt ?? e.message,
          },
        },
      });
    }
  }
}

module.exports = new PasswordController();
