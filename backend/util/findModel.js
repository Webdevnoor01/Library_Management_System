const Student = require("../models/student")
const Teacher = require("../models/teacher")
const LibraryStaff = require("../models/libraryStaff")
const LibraryAdmin = require("../models/lAdmin")


function findModel(userRole){
    if(userRole === "Student" || userRole === "student"){
        return Student
    }
    
    if(userRole === "Teacher" || userRole === "teacher"){
        
        return Teacher
    }

    if(userRole === "libAdmin" || userRole === "LibAdmin"){
        return LibraryAdmin
    }

    if(userRole === "Assistant" || userRole === "assistant" || userRole === "Staff" || userRole === "staff"){
        return LibraryStaff
    }

    


}

module.exports = findModel