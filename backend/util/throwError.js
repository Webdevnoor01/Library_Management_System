const createError = require("http-errors")
/**
 * 
 * @param {string} msg 
 * @param {number} status 
 */
const customError = (msg, status) =>{
    return createError({
        message:{
          status:status || 500,
          txt:msg
        }
      })
}

module.exports = customError