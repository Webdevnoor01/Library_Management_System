const Student = require("../models/student")
const Teacher = require("../models/teacher")
const LibAdmin = require("../models/lAdmin")
const LibraryStaff = require("../models/libraryStaff")


function findModel(modelName){
    if(modelName === "Student" || modelName === "student"){
        return Student
    }
    
    if(modelName === "Teacher" || modelName === "teacher"){
        
        return Teacher
    }

    if(modelName === "libAdmin" || modelName === "LibAdmin"){
        return LibAdmin
    }
    if(modelName === "Assistant" || modelName === "assistant" || modelName === "Staff" || modelName === "staff"){
        return LibraryStaff
    }

}

module.exports = findModel