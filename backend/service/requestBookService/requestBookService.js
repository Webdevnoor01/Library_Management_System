const createError = require("http-errors");
const RequestBook = require("../../models/requestedBook");

class RequestBookService {
  async newBookRequest(payload) {
    try {
      const bookRequest = await RequestBook.create(payload);
      if (!bookRequest) return false;
      return bookRequest;
    } catch (e) {
      throw createError(e.message);
    }
  }

  async findRequestedBook(payload) {
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
