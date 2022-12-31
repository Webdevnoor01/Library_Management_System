// Libraries 
const createError = require("http-errors")

// Models
const Notification = require("../../models/notification")


class NotificationService {

   async createNotification(payload){
        try {
            if(!(payload.message && payload.reciever && payload.sender)){
                return {
                    error:true,
                    message:"Please type valid message reciever sender"
                }
            }

            const notification = await Notification.create(payload)
            if(!notification){
                return {
                    error:true,
                    message:"error to creating notification"
                }
            }

            return {
                error:false,
                data:notification
            }
        } catch (e) {
            throw createError(e.message)
        }
    }

    /**
     * 
     * @param {Object} query {reciever:
     *  {userId, role, userName}
     * }
     */
    async findNotificationByProperty(query){
        try {
            const notification = await Notification.find(query,"message createdAt")
            console.log("notification service: ", notification)
            if(!notification.length >0 ){
                return {
                    error:true,
                    message:"Empty notification"
                }
            }

            return {
                error:false,
                data:notification
            }
        } catch (e) {
            throw createError(e.message)
        }
    }

}

module.exports = new NotificationService()