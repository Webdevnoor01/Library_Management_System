// Libraries
const bcrypt = require("bcrypt");
const createError = require("http-errors");

// Services
const userService = require("../../../service/userService/userService");
const libraryCardSearvice = require("../../../service/libraryCardService/index");
const tokenService = require("../../../service/token/tokenService");

// Models
const RefreshToken = require("../../../models/tokens/refreshToken");

// Utility
const UserDto = require("../../../userDTO/userDto");
const findModel = require("../../../util/findModel");

class AuthController {
  async register(req, res) {
    const {
      studentName,
      teacherName,
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
      roles,
    } = req.body;
    const userName = studentName || teacherName

    try {
      const libraryCard = await libraryCardSearvice.findCardById(libraryId);

      const user = await userService.findUserByProperty(findModel(userRole), {
        ...req.body,
      });
      if(!libraryCard){
        throw createError({
          message:"Please provide valid library id"
        })
      }
      if (!user && (libraryCard.userName === userName)) {
        // Hash the password
        const hasPassword = await bcrypt.hash(password, 10);
        let payload;
        if (userRole === "Student" || userRole === "student") {
          payload = {
            studentName,
            teacherName,
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
            roles: roles || null,
          };
        }

        if (userRole === "Teacher" || userRole === "teacher") {
          payload = {
            teacherName,
            email,
            phone,
            password: hasPassword,
            avatar,
            current_year,
            userRole,
            address,
            libraryId,
            roles,
          };
        }

        const newUser = await userService.createNewUser(findModel(userRole), {
          ...payload,
        });

        if(!newUser){
          throw createError("Something went wrong")
        }
        res.status(200).json({
          message:"Ok",
          user:new UserDto(newUser)
        });
      }else{
          if(!(libraryCard.userName === userName)){

            throw createError("Please type valid library Id.")
          }
          throw createError("User already exist")
      }

    } catch (e) {
      console.log(e);
      res.status(500).json({
        errors:{
          registration:{
            msg:e.message
          }
        }
      });
    }
  }

  async login(req, res) {
    const {userId, email, password, role } = req.body;
    try {
      if(!email, !password, !role){
        throw createError({
          message:"Please provide valid email password and role"
        })
      }
      const model = findModel(role);
      const query = userId? {userId:userId} : {email:email};
      const user = await userService.findUserByProperty(model,query);
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

      const tokenPayload = {
        _id: user._id,
        userRole: user.userRole,
        userName:user.studentName || user.teacherName || user.name,
        activated: false,
      };

      const { accessToken, refreshToken } = await tokenService.generateTokens(
        tokenPayload
      );

      const isRefreshToken = await tokenService.findRefreshToken(user._id,refreshToken)
      let updateRefreshToken = refreshToken
      if(isRefreshToken){
        updateRefreshToken =  await tokenService.updateRefreshToken(user._id, refreshToken)
      }
      if(!isRefreshToken){

        await tokenService.storeRefreshToken(RefreshToken, {
          token: refreshToken,
          userId: user._id,
        });
      }

      res.cookie("accessToken", accessToken, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
      });
      res.cookie("refreshToken", updateRefreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 365,
        httpOnly: true,
      });

      const userDto = new UserDto(user);
      res.status(200).json({
        user: userDto,
        auth: true,
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

  async logout(req, res) {
    const { refreshToken } = req.cookies;
    try {
      const deleteRefreshToken = await tokenService.removeRefreshToken(
        RefreshToken,
        refreshToken
      );
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      res.status(200).json({
        user: null,
        auth: false,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async changePassword(req, res) {
    const {oldPassword, newPassword, conformNewPassword} = req.body
    const {userId} = req.params
    
    try {
      const userRole = req.user.userRole
      const user = await userService.findUserByProperty(findModel(userRole),{_id:userId})


      // verify old password
      const isValidPassword = await bcrypt.compare(oldPassword, user.password)
      if(!isValidPassword){
        throw createError({
          status:400,
          message:"Wrong old password"
        })
      }

      if(newPassword !== conformNewPassword){
        throw createError({
          status:400,
          message:"new password and conform new password are not equal"
        })
      }
      const hashPassword = await bcrypt.hash(newPassword,10)
      const payload = {
        password: hashPassword
      }
      const updatePassword = await userService.changePassword(findModel(userRole), userId,payload)
      if(updatePassword.error){
        throw createError({
          message:updatePassword.message
        })
      }

      return res.status(200).json({
        message:"Password change successfully"
      })
    } catch (e) {
      console.log(e)
      res.status(e.status || 500).json({
        errors:{
          changePass:{
            msg:e.message
          }
        }
      })
    }
  }
}

module.exports = new AuthController();
