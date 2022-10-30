const bcrypt = require("bcrypt")
const createError = require("http-errors")

const LibraryAdmin = require("../../models/lAdmin")

const libraryAdminService = require("../../service/libraryAdminService/libraryAdminService")
const issuedBookService = require("../../service/issuedBookService/issuedBookService")
const userService = require("../../service/userService/userService")
const requestedBookService = require("../../service/requestBookService/requestBookService")
const bookService = require("../../service/bookService/bookService")
const notificationService = require("../../service/notificationService/notificationService")

const findModel = require("../../util/findModel")
const {renewDate} = require("../../util/generateRenewData")




class LibraryAdminController {

    async createAdmin(req, res){
        const {
            name,
            userId, 
            email, 
            phone, 
            password
        } = req.body

        try {
            // const isLibAdmin = await libraryAdminService.findByProperty({email:email})
            // if(isLibAdmin.error){
            //     throw createError(isLibAdmin.message)
            // }

            // Hash the password
            const hashPassword = await bcrypt.hash(password, 10)
            const payload= {
                name, userId, email, phone, password:hashPassword
            }
            const libAdmin = await libraryAdminService.create(payload)

            if(libAdmin.error){
                throw createError({
                    message:libAdmin.message
                })
            }
            delete libAdmin.data.password
            res.status(201).json({
                message:"New library admin created successfully",
                libraryAdmin:libAdmin.data
            })
        } catch (e) {
            console.log(e)
            res.status(e.status || 500).json({
                errors:{
                    libraryAdmin:{
                        msg:e.message
                    }
                }
            })
        }
    }

    async acceptRequestedBook(req, res){
        const {requestedBookId,  requestedUserRole } = req.body

        try {
            if(!(requestedBookId && requestedUserRole)){
                throw createError({
                    status:400,
                    message:"plese provide all required fields"
                })
            }

            const isRequestedBook = await requestedBookService.findRequestedBookByProperty({_id: requestedBookId})
            if(isRequestedBook.error){
                throw createError({
                    status:400,
                    message:"You don't send requst for this book"
                })
            }

            // Check that you are issued this book or not 
            const {userId, bookId} = isRequestedBook.data
            console.log("bookData", isRequestedBook.data)
            const isIssued = await issuedBookService.findIssuedBookByProperty({userId:userId,bookId:bookId})
            if(!isIssued.error){
                throw createError({
                    status:400,
                    message:"You already issue this book"
                })
            }

            const issuedBookPayload ={
                userId:userId, 
                bookId:bookId,
                whoIssued:req.user.userName,
                renewDate: `${renewDate()}` 
            }
            const user = await userService.findUserByProperty(findModel(requestedUserRole),{_id:userId},"studentName teacherName userRole ")
            const book = await bookService.findBookByProperty({_id:bookId}, "bookName")
            console.log("book", book)
            if(!user && book.error){
                throw createError({
                    message:"User and book not found"
                })
            }
            const issuedBook = await issuedBookService.createIssueBook(issuedBookPayload)
            if(issuedBook.error){
                throw createError({
                    message:issuedBook.message
                })
            }

            const deleteRequestedBook = await requestedBookService.deleteRequestedBook(requestedBookId)
            if(deleteRequestedBook.error){
                throw createError({
                    message:deleteRequestedBook.message
                })
            }

            
            
            const notificationPayload = {
                message:`${user.studentName || user.teacherName} your request has been accepted for this book ${book.data.bookName}. Go to the libray and grab it. `,
                sender:{
                    role:req.user.userRole,
                    userId:req.user._id,
                    userName:req.user.userName
                },
                reciever:{
                    role:user.userRole,
                    userId:user._id,
                    userName:user.studentName || user.teacherName || user.name
                }, 
            }
            const newNotification = await notificationService.createNotification(notificationPayload)
            if(newNotification.error){
                console.log(newNotification.message)
            }

            const updateUserRef = await userService.updateUserRef(findModel(requestedUserRole),{_id:userId},"issuedBookList",issuedBook.data._id)

            const deleteUserRef = await userService.deleteUserRef(findModel(user.userRole),{_id:user._id},"requestedBookList", requestedBookId)

            res.status(200).json({
                message:"Ok",
                issuedBook:issuedBook.data,
                notification:newNotification.data.message,
                updateIssuedBookList:!updateUserRef.error,
                deleteRequestedBookId:!deleteUserRef.error
            })
        } catch (e) {
            res.status(e.status || 500).json({
                errors:{
                    libraryAdmin:{
                        msg:e.message
                    }
                }
            })
        }
    }

}

module.exports = new LibraryAdminController()