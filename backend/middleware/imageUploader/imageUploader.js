const uploader = require("../../util/uploader");

 
class ImageUploader{

    uploadImage(req , res, next){
        
        try {
            const upload = uploader(
                "booksImg",
                ["image/jpeg", "image/jpg", "image/png"],
                4000000,
                "Only .jpg, .jpeg or .png format allowed!"
                )

            upload.any()(req, res, (err =>{
                if(err){
                    res.status(400).json({
                        errors:{
                            bookImg:{
                                msg:err.message
                            }
                        }
                    })
                }else{
                    next()
                }
            }))
        } catch (error) {
            console.log(error)
        }
    }

}

module.exports = new ImageUploader()