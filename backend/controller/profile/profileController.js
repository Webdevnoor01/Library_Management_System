const createError = require("http-errors");
const fs = require("fs");

const profileService = require("../../service/profileService/profileService");
const userService = require("../../service/userService/userService");
const findModel = require("../../util/findModel");
const customeError = require("../../util/throwError");
class ProfileController {
  async update(req, res) {
    const { userRole, _id: userId } = req.user;
    let payload;
    try {
      if (req.url !== `/update/avatar/${userId}`) {
        if (Object.keys(req.body).length === 0)
          throw customeError("Please choose at least on filed to update", 400);
      } else {
        if (req.files.length === 0)
          throw customeError("Please choose an image");
      }
      if (
        userRole === "Assistant" ||
        userRole === "Staff" ||
        userRole === "Student" ||
        userRole === "Teacher"
      ) {
        if (
          req.body.userRole ||
          req.body.roles ||
          req.body.libraryId ||
          req.body.issuedBookList ||
          req.body.requestedBookList ||
          req.body.fine
        )
          throw customeError("Something went worng", 403);
      }
      payload = req.files ? { avatar: req.files[0].path } : req.body;
      if (req.body.password) throw customeError("You can't update password");

      if (req.body._id) throw customeError("You can't update _id", 403);

      const user = await userService.findUserByProperty(
        findModel(req.user.userRole),
        { _id: req.user._id },
        "avatar"
      );

      if (user.avatar) {
        fs.unlink(user.avatar, (err) => {
          if (err) {
            console.log(err);
          }
        });
      }

      const profile = await profileService.update(
        findModel(req.user.userRole),
        payload,
        userId
      );

      if (profile.error) throw customeError(profile.message);

      res.status(201).json({
        message: "Profile updated successfully.",
      });
    } catch (e) {
      console.log(e);
      if (req.files) {
        const path = req.files[0].path;

        fs.unlink(path, (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
      res.status(e.message.status).json({
        errors: {
          profile: {
            msg: e.message.txt || e.message,
          },
        },
      });
    }
  }
}

module.exports = new ProfileController();
