const bcrypt = require("bcrypt");
const userService = require("../../../service/userService/userService");
const Student = require("../../../models/student");

class AuthController {
  async register(req, res, next) {
    const {
      studentName,
      email,
      phone,
      password,
      avatar,
      depertment,
      semester,
      admission_date,
      current_year,
      address,
      libraryId,
    } = req.body;

    try {
      const user = await userService.findUserByProperty(
        Student,
        "libraryId",
        libraryId,
        libraryId
      );
      if (!user) {
        // Hash the password
        const hasPassword = await bcrypt.hash(password, 10);

        const payload = {
          studentName,
          email,
          phone,
          password: hasPassword,
          avatar,
          depertment,
          semester,
          admission_date,
          current_year,
          address,
          libraryId,
        };

        const newUser = await userService.createNewUser(Student, {
          ...payload,
        });

        res.status(200).json({
          message: "New user created successfully",
          newUser,
        });
      } else {
        res.status(400).json({
          message: "Please try again",
        });
      }
    } catch (error) {
      res.status(400).json({
        message: "Please try again",
      });
    }
  }
}

module.exports = new AuthController();
