const createError = require("http-errors");
const RequestBook = require("../../models/requestedBook");

class RequestBookService {
  async newBookRequest(payload) {
    try {
      const bookRequest = await RequestBook.create(payload);
      console.log( "New book Reauest", bookRequest)
      if (!bookRequest) return false;
      return bookRequest;
    } catch (e) {
      throw createError(e.message);
    }
  }

  async findAllRequestedBook() {
    try {
      const requestedBook = await RequestBook.find({});
      if (!requestedBook.length >0) return false;
      return requestedBook;
    } catch (e) {
      throw createError(e.message);
    }
  }

  async findRequestedBookByProperty(payload) {
    try {
      const requestedBook = await RequestBook.findOne(payload);
      if (!requestedBook) return false;
      return requestedBook;
    } catch (e) {
      throw createError(e.message);
    }
  }

}

module.exports = new RequestBookService();
