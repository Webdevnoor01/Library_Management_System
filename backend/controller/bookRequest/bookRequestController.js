const createError = require("http-errors");
const requestBookService = require("../../service/requestBookService/requestBookService");
const userService = require("../../service/userService/userService");
const Student = require("../../models/student");
const findModel  = require("../../util/findModel")

class BookRequest {

  async newBookRequest(req, res) {
    const { bookId, userId } = req.query;
    try {
      const payload = {
        bookId,
        userId,
      };

      const isRequestedBook = await requestBookService.findRequestedBookByProperty(
        payload
      );

      if (isRequestedBook)
        throw createError("You already send request for this book");

      const requsetedBook = await requestBookService.newBookRequest(payload);
      if (requsetedBook) {
        const user = await userService.updateUserRef(
          Student,
          { _id: userId },
          { requestedBookId: requsetedBook._id }
        );

       
      }

      if (!requsetedBook) throw createError("something went wrong.");
      res.status(200).json({
        message: "Ok",
        requsetedBook,
      });
    } catch (e) {
      console.log(e)
      res.status(500).json({
        errors: {
          requestedBook: {
            msg: e.message,
          },
        },
      });
    }
  }

  async findRequestedBook(req, res) {
    const {} = req.body 
    try {
      const requestedBook = await requestBookService.findAllRequestedBook()
      if(!requestedBook) throw createError("No books found")

      res.status(200).json({
        message:"Ok",
        requestedBook
      })
    } catch (e) {
      console.log(e);
      
      res.status(500).json({
        errors:{
          requestedBook:{
            msg:e.message
          }
        }
      })
    }
  }

  async findUserRequestedBook(req, res) {
    const {userId}  = req.params
    try {
      const requestedBooks = await userService.findRequestedBook(findModel(req.userRole),userId)
      if(requestedBooks.error){
        throw createError(requestedBooks.message)
      }

      res.status(200).json({
        message:"Ok",
        requestedBooks:requestedBooks.data
      })
    } catch (e) {
      res.status(500).json({
        errors:{
          requestedBooks:{
            msg:e.message
          }
        }
      })
    }
  }


}

module.exports = new BookRequest();
