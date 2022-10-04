const Student = require("../models/student")
const Teacher = require("../models/teacher")


function findModel(modelName){
    if(modelName === "Student" || modelName === "student"){
        return Student
    }
    
    if(modelName == "Teacher" || modelName === "teacher"){
        
        return Teacher
    }
}

module.exports = findModel