const uploader = require("../../util/uploader");

class ImageUploader {
  
  uploadImage(destination) {
    return (req, res, next) =>{
      console.log("image uploader ")
      try {
        const upload = uploader(
          destination,
          ["image/jpeg", "image/jpg", "image/png", "image/webp"],
          2000000,
          "Only .jpg, .jpeg or .png format allowed!"
        );
  
        upload.any()(req, res, (err) => {
          if (err) {
            res.status(400).json({
              errors: {
                bookImg: {
                  msg: err,
                },
              },
            });
          } else {
            console.log("next called")
            next();
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
    
  }
}

module.exports = new ImageUploader();
