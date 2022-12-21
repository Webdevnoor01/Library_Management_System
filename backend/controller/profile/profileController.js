const createError = require("http-errors")
const fs = require("fs")

const profileService = require("../../service/profileService/profileService");
const userService = require("../../service/userService/userService");
const findModel = require("../../util/findModel");
class ProfileController {

    async update(req, res){
        const {userRole, _id:userId} = req.user
        let payload;
        try {
            if(userRole === "Assistant" || userRole==="Staff" ||userRole === "Student" || userRole === "Teacher"){
                if(req.body.userRole){
                    throw createError({
                        message:"You cant update userRole"
                    })
                }
            }
            payload = req.files ? { avatar:req.files[0].path}:req.body
            if(req.body.password){
                throw createError("You can't update password")
            }

            if(req.body._id){
                throw createError({
                    status:400,
                    message:"You can't update _id"
                })
            }

            const user = await userService.findUserByProperty(findModel(req.user.userRole),{_id:req.user._id},"avatar")

            if(user.avatar){
                fs.unlink(user.avatar, (err) =>{
                    if(err){
                        console.log(err)
                    }
                })
            }


            const profile = await profileService.update(findModel(req.user.userRole),payload,userId)

            if(profile.error){
                throw createError({
                    message:profile.message
                })
            }
            
            res.status(201).json({
                message:"Profile updated successfully.",
                
            })
        } catch (e) {
            console.log(e)
            if(req.files){
                const path =req.files[0].path

                fs.unlink(path,(err) =>{
                    if(err){
                        console.log(err)
                    }
                })
            }
            res.status(e.status || 500).json({
                errors:{
                    profile:{
                        msg:e.message
                    }
                }
            })
        }
    }
}

module.exports = new ProfileController()