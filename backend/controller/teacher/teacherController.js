const createError = require("http-errors");

const userService = require("../../service/userService/userService");

const findModel = require("../../util/findModel");

class TeacherController {
  async findRequestedBooks(req, res) {
    const { userId } = req.params;
    const { userRole } = req.user;
    try {
      const requestedBook = await userService.findRequestedBook(
        findModel(userRole),
        userId
      );
      if (requestedBook.error) {
        throw createError({
          message: {
            status: 400,
            txt: requestedBook.message,
          },
        });
      }

      res.status(200).json({
        message: "Ok",
        requestedBooks: requestedBooks.data,
      });
    } catch (e) {
        res.status(e.message.status ||500).json({
            errors: {
              teacher: {
                msg: e.message.txt,
              },
            },
          });
    }
  }
}

module.exports = new TeacherController()