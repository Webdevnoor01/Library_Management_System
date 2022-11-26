const IssuedBook = require("../../models/issuedBook");
const createError = require("http-errors");

class IssudBookService {
  async createIssueBook(payload) {
    console.log(payload);
    try {
      const { bookId, userId, whoIssued, renewDate } = payload;

      if (bookId && userId && whoIssued && renewDate) {
        const issuedBook = await IssuedBook.create(payload);

        if (!issuedBook) {
          return {
            error: true,
            message: issuedBook,
          };
        }

        return {
          error: false,
          data: issuedBook,
        };
      }

      return {
        error: true,
        message: "Plese provide bookId, userId, whoIssued to issue new book ",
      };
    } catch (e) {
      throw createError(e.message);
    }
  }

  async findIssuedBookByProperty(query) {
    try {
      const issuedBook = await IssuedBook.findOne(query);

      if (!issuedBook) {
        return {
          error: true,
          message: issuedBook,
        };
      }

      return {
        error: false,
        data: issuedBook,
      };
    } catch (e) {
      throw createError(e.message);
    }
  }
}

module.exports = new IssudBookService();