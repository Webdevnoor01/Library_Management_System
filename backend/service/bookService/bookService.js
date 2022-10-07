const Book = require("../../models/books");
const createError = require("http-errors");
const sendBookError = require("../../util/bookError");

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
    const { isbn, bookName, authorName } = query
    try {
      let book;
      if (isbn && bookName && authorName) {
        book = await Book.find({ ...query });
        
         book = book.length <=0 && sendBookError("Please type correct value.") || book
        
      } else if (isbn && bookName) {
        book = await Book.find({ isbn: isbn, bookName: bookName })

        book = book.length <=0
        && sendBookError("Please type right isbn & book name.")
        || book;

      } else if (isbn && authorName) {
        book = await Book.find({ isbn: isbn, authorName: authorName })
        book = book.length <=0
        && sendBookError("Please type right isbn & author name.")
        || book;
      } else if (bookName && authorName) {
        book = await Book.find({ bookName: bookName, authorName: authorName })
        book = book.length <=0
        && sendBookError("Please type right book name & author name.")
        || book;
      } else if (isbn) {
        book = await Book.find({ isbn: isbn });
        book = book.length <=0
        && sendBookError("Please check ISBN no.")
        || book;
      } else if (bookName) {
        book = await Book.find({ bookName: bookName });
        book = book.length <=0
        && sendBookError("Please check book name.")
        || book;
      } else {
        book = await Book.find({ authorName: authorName });
        book = book.length <=0
        && sendBookError("Please check author name.")
        || book;
      }
      return book;
    } catch (e) {
      console.log(e.message)
      throw createError(e.message);
    }
  }
}

module.exports = new BookService();
