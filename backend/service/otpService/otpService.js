const crypto = require("crypto");
const createError = require("http-errors");
const nodemailer = require("nodemailer");

class OtpService {
  generateOtp() {
    return crypto.randomInt(100000, 999999);
  }

  /**
   *
   * @param {string} email
   * @param {number} otp
   * @param {string} subject
   * @returns {object} return an object with data
   */
  async sendOtp(email, otp, subject) {
    try {
      // Create nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: "gmail" ,
        auth: {
          user: `${process.env.USER_EMAIL}`,
          pass: `${process.env.USER_EMAIL_PASS}`,
        },
      });
      const message = () => {
        return (
          `Dear User, \n\n` +
          "OTP for forgating password in Library Management System is : \n\n" +
          `${otp}\n\n` +
          "This is a auto-generated email. Please do not reply to this email.\n\n" +
          "Regards\n" +
          "Abdun Noor FAruki Biswas\n\n"
        );
      };
      const mailOptions = {
        from: `"Abdun Noor Faruki Biswas"<${process.env.USER_EMAIL}>`,
        to: `${email}`,
        subject: subject,
        text: message(),
      };

      await transporter.verify((err,successs) =>{
        if(err){
            console.log("error: ", err)
        }else{
            console.log(" smtp server is ready to take our messages")
        }
      });

      //   Send otp to email
      await transporter.sendMail(mailOptions, (err) => {
        if (err) {
          return {
            error: true,
            message: err.message,
          };
        }
      });

      return {
        error: false,
        data: "OTP send successfully",
      };
    } catch (e) {
      console.log("send-otp-error: ", e);
      throw createError(e.message);
    }
  }

  virifyOtp(hashedOtpFromUser, hashedOtp, expire) {
    try {
        if(Date.now() > expire){
            return {
                error:true,
                message:"OTP hasbeen expired"
            }
        }
        if(hashedOtpFromUser !== hashedOtp){
            return {
                error:true,
                message:"Invalid OTP"
            }
        }

        return {
            error:false,
            data:"OTP verifyed"
        }
    } catch (e) {
         
    }
  }
}

module.exports = new OtpService();
