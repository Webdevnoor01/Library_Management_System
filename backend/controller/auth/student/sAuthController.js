const bcrypt = require("bcrypt");
const userService = require("../../../service/userService/userService");
const Student = require("../../../models/student");

class AuthController {
  async register(req, res, _next) {
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
      userRole,
      address,
      libraryId,
    } = req.body;

    try {
      const user = await userService.findUserByPropertyAndRegister(
        Student,
        { libraryId: libraryId },
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
          userRole,
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

  async login(req, res, next) {
    const { email, password, role } = req.body;

    try {
      const user = await userService.findUserByProperty(Student, {
        email: email,
      });
      if (!user) {
        return res.status(400).json({
          errors: {
            login: {
              msg: "Incorrect username and password",
            },
          },
        });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({
          errors: {
            login: {
              msg: "Incorrect username and password",
            },
          },
        });
      }
      // TODO
      // create token (access token and refresh token) and send token
      res.status(200).json({
        message: "Login successfully",
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        errors: {
          common: {
            msg: e.message,
          },
        },
      });
    }
  }
}

module.exports = new AuthController();
