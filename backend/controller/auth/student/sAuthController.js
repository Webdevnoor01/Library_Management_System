const bcrypt = require("bcrypt");
const userService = require("../../../service/userService/userService");
const Student = require("../../../models/student");
const tokenService = require("../../../service/token/tokenService");
const StudentRefreshModel = require("../../../models/tokens/studentRefreshToken")
const UserDto = require("../../../userDTO/userDto")

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

  async login(req, res, _next) {
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
      const tokenPayload = {
        _id: user._id,
        activated:false

      }

      const {accessToken, refreshToken} = await tokenService.generateTokens(tokenPayload)
      await tokenService.storeRefreshToken(StudentRefreshModel,{
        token:refreshToken,
        userId:user._id
      })
      res.cookie("accessToken", accessToken,{
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
      })

      res.cookie("refreshToken", refreshToken,{
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
      })

      const userDto  = new UserDto(user)
      res.status(200).json({
        user:userDto, studentAuth:true
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


  async logout(req, res, _next){
    const {refreshToken} = req.cookies
    try {
      
      const deleteRefreshToken = await tokenService.removeRefreshToken(StudentRefreshModel, refreshToken) 
      res.clearCookie("accessToken")
      res.clearCookie("refreshToken")

      res.status(200).json({
        user:null, auth:false
      })
    } catch (error) {
      console.log(error)
    }
    
  }
}

module.exports = new AuthController();
