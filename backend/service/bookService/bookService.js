const Book = require("../../models/books");
const createError = require("http-errors");

class BookService {
  async createNewBook(payload) {
    try {
      const book = await Book.create({ ...payload });
      if (!book) return false;
      return book;
    } catch (e) {
      throw createError(e.message);
    }
  }

  async findBooks() {
    try {
      const books = await Book.find({});
      if (!books.length > 0) return false;
      return books;
    } catch (e) {
      throw createError(e.message);
    }
  }

  async findBookByProperty(query) {
    try {
      let book;
      if (query.isbn && query.bookName && query.authorName) {
        book = await Book.find({ ...query });
      } else if (query.isbn) {
        book = await Book.find({ isbn: query.isbn });
      } else if (query.bookName) {
        book = await Book.find({ bookName: query.bookName });
      } else {
        book = await Book.find({ authorName: query.authorName });
      }

      if (!book) return false;
      return book;
    } catch (e) {
      throw createError(e.message);
    }
  }
}

module.exports = new BookService();
