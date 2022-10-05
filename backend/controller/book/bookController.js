const bookService = require("../../service/bookService/bookService")
const createError = require("http-errors")

class BookController {

    async create(req, res) {
        const {
            bookName, authorName, bookEdition, bookQuantity,
            bookImage, isbn, almirahNo, category
        } = req.body


        try {
            const bookPayload = {
                bookName,
                authorName,
                bookEdition:req.body.bookEdition,
                bookQuantity: Number(bookQuantity),
                bookImage:req.files[0].path, isbn,
                almirahNo:+almirahNo, 
                category
            }
            
            const isBook = await bookService.findBookByIsbn(isbn)
            let book
            if(!isBook){

                book = await  bookService.createNewBook(bookPayload)
                if(!book){
                   return createError("something went wrong")
                }
            }else{
                res.status(400).json({
                    errors:{
                        book:{
                            msg:"Already exists this book"
                        }
                    }
                })
            }

            res.status(200).json({
                message:"Ok",
                book
            })

        } catch (e) {
            res.status(500).json({
                errors: {
                    book: {
                        msg: e.massage
                    }
                }
            })
        }
    }

}


module.exports = new BookController()