const Book = require("../../models/books")
const createError = require("http-errors")

class BookService{
   async createNewBook(payload){
        try {
            const book  = await Book.create({...payload})
            if(!book) return false
            return book 
        } catch (e) {
            createError(e.message)
        }
    }

    async findBookByIsbn(isbn){
        try {
            const isBook = await Book.findOne({isbn:isbn})
            if(!isBook) return false
            return isBook
        } catch (e) {
            createError(e.message)
        }
    }
}


module.exports = new BookService()