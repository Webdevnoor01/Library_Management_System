const createError = require("http-errors");
const bcrypt = require("bcrypt");
const crypto = require("crypto")
const userService = require("../../service/userService/userService");
const findModel = require("../../util/findModel");
const UserDto = require("../../userDTO/userDto");
const isValidEmail = require("../../util/isValidEmail");
const otpService = require("../../service/otpService/otpService");
const hashService = require("../../service/hashService/hashService");

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

  async sendOtp(req, res){
    const {email} = req.body
    try {
      if(!email){
        throw createError({
          message:{
            status:400,
            txt:'Email is required'
          }
        })
      }

      if(!isValidEmail(email)){
        throw createError({
          message:{
            status:400,
            txt:'Please type valid email'
          }
        })
      }

      const otp = otpService.generateOtp()

      const tte = Date.now() + 1000 *60*5
      const data = `${email}.${otp}.${tte}`
      const hashOtp = await hashService.hashOtp(data)

      const otpSend = await otpService.sendOtp(email,otp,"OTP for forgating password")
      if(otpSend.error){
        throw createError({
          message:{
            status:400,
            txt:otpSend.message
          }
        })
      }
      res.status(200).json({
        hashOtp:`${hashOtp}.${tte}`
      })

    } catch (e) {
      console.log("password-controller-error: ", e)
      res.status(e.message.status || 500).json({
        errors:{
          password:{
            msg:e.message.txt
          }
        }
      })
    }
  }

  async verifyOtp(req, res){
    const {hashedOtp, otp, newPassword, conformNewPassword, email} = req.body
    const {userRole, _id:userId} = req.user
    try {
      if(!otp || !newPassword || !conformNewPassword || !email){
        throw createError({
          message:{
            status:400,
            txt:"hashedOtp, otp, newPassword, conformNewPassword, email all filed required"
          }
        })
      }
      const [hash, expire] = hashedOtp.split(".")
      const data = `${email}.${otp}.${expire}`

      // Create new hash otp
      const newHashedOtp=await hashService.hashOtp(data)
      
      // verify otp 
      const verify =await otpService.virifyOtp(hash,newHashedOtp, expire)
      if(verify.error){
        throw createError({
          message:{
            status:400,
            txt:verify.message
          }
        })
      }
      if(newPassword !== conformNewPassword){
        throw createError({
          message:{
            status:400,
            txt:"password dosen't match"
          }
        })
      }

      // hash the password
      const hashPassword = await bcrypt.hash(newPassword, 10)

      const payload = {
        password: hashPassword
      }
      // Update user passwrod
      const user = await userService.changePassword(findModel(userRole), userId, payload)
      if(user.error){
       throw createError({
          message:{
            status:400,
            txt:user.message
          }
        })
      }

      res.status(200).json({
        message:"OTP hasbeen verifyed and password change successfully"
      })
    } catch (e) {
      console.log("password-controller: ", e)
      res.status(e.message.status || 500).json({
        errors:{
          password:{
            msg:e.message.txt ?? e.message
          }
        }
      })
    }
  }
}

module.exports = new PasswordController();
