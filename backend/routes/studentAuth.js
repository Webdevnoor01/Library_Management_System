const router = require("express").Router();
const studentValidator = require("../middleware/auth/student/student");


router.post("/student",studentValidator.validate(), studentValidator.validationHnadler, (req, res, next) =>{
    res.status(200).json({
        message:"Thsi is student auth route"
    })
})


module.exports = router