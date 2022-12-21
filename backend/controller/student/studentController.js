const userService = require("../../service/userService/userService");
const requestBookService = require("../../service/requestBookService/requestBookService");
const notificationService = require("../../service/notificationService/notificationService");
const findModel = require("../../util/findModel");
const createError = require("http-errors");

class StudentController {

  async findRequestedBook(req, res) {
    const { userId } = req.params;
    console.log(findModel(req.user.userRole))

    try {
      const requestedBooks = await userService.findRequestedBook(
        findModel(req.user.userRole),
        userId
      );
      if (requestedBooks.error) {
        throw createError(requestedBooks.message);
      }

      res.status(200).json({
        message: "Ok",
        requestedBooks: requestedBooks.data,
      });
    } catch (e) {
      res.status(500).json({
        errors: {
          student: {
            msg: e.message,
          },
        },
      });
    }
  }
  async findIssuedBooks(req, res){
    const {_id:userId, userRole} = req.user
    try {
      const issuedBooks = await userService.findIssuedBooks(findModel(userRole), userId)
      if(issuedBooks.error){
        throw createError({
          message:{
            txt:issuedBooks.message
          }
        })
      }
      res.status(200).json({
        message:"your issued books",
        data: await issuedBooks.data
      })
    } catch (e) {
      console.log(e)
      res.status(e.message.status || 500).json({
        errors:{
          student:{
            msg:e.message.txt
          }
        }
      })
    }
  }

  async findStudents(req, res) {
    try {
      const students = await userService.findUserByProperty(
        findModel(req.user.userRole),
        { _id: req.user._id },
        "studentName email phone requestedBookList issuedBookList"
      );
      if (!students) {
        throw createError("Student not found");
      }
      res.status(200).json({
        message: "Ok",
        students,
      });
    } catch (e) {
      res.status(500).json({
        errors: {
          student: {
            msg: e.message,
          },
        },
      });
    }
  }

  async deleteRequestedBook(req, res) {
    const { userId, fieldName, requestedBookId } = req.query;
    try {
      if(!(userId && fieldName && requestedBookId)) {
        throw createError({
          message:"Please provide userId, fieldName, and requestedBookId"
        })
      }
      // Delete requested bookId from user requestedBookList
      const requestedBookList = await userService.deleteUserRef(
        findModel(req.user.userRole),
        { _id: userId },
        fieldName,
        requestedBookId
      );
      if (requestedBookList.error) {
        throw createError({
          message:
            "error to delete requested book id from user requestedBookList",
        });
      }

      // Find the requestedBook for deletion
      let requestedBook = await requestBookService.findRequestedBookByProperty({
        _id: requestedBookId,
      });
      if (requestedBook.error) {
        throw createError({
          message: requestedBook.message,
        });
      }

      // delete the requested book
      requestedBook = await requestBookService.deleteRequestedBook(
        requestedBookId
      );
      if (requestedBook.error) {
        throw createError({
          message: requestedBook.message,
        });
      }

      // Finaly send the response to the user
      res.status(200).json({
        message: `Deleted requestedBookId ${requestedBookId} from requestedBookList `,
        requestedBook: requestedBook.data,
      });
    } catch (e) {
      res.status(500).json({
        errors: {
          [req.user.userRole]: {
            msg: e.message,
          },
        },
      });
    }
  }

  async getNotification(req, res) {
    const { userRole, _id: userId, userName } = req.user;

    try {
      const query = {"reciever.role":userRole,"reciever.userId":userId,"reciever.userName":userName };
      const notification = await notificationService.findNotificationByProperty(
        query
      );

      if (notification.error) {
        throw createError({
          message: notification.message,
        });
      }

      res.status(200).json({
        status: "Ok",
        notifications: notification.data,
      });
    } catch (e) {
        res.status(500).json({
            errors:{
                student:{
                    msg: e.message 
                }
            }
        }) 
    }
  }
}

module.exports = new StudentController();
