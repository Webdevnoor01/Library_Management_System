const multer = require("multer")
const path = require("path")
const createError = require("http-errors")
function uploader(
    sub_folder_path,
    allow_file_type,
    max_size,
    err_msg
){
    const UPLOAD_FOLDER = `${__dirname}/../storage/${sub_folder_path}/`
    const storage = multer.diskStorage({
        destination:(_req,_file, cb) =>{
            cb(null, UPLOAD_FOLDER)
        },

        filename: (_req, file, cb) =>{
            const extName = path.extname(file.originalname)

            let fileName = file.originalname
                            .replace(extName, " ")
                            .toLowerCase()
                            .split(" ")
                            .join("_") + Date.now();
            
            cb(null, fileName+extName)
        }
    })

    const upload = multer({
        storage: storage,
        limits:{
            fileSize: max_size
        },
        fileFilter:(_req, file, cb) =>{
            if(allow_file_type.includes(file.mimetype)){
                cb(null, true)
            }else{
                cb(createError(err_msg))
            }
        }
    })
    return upload;

}


module.exports = uploader