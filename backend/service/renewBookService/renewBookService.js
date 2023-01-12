const RenewRequest = require("../../models/renewRequest");
const createError = require("http-errors");
class RenewBookService {
  async createNewRenewRequest(payload) {
    try {
      const renewRequest = await RenewRequest.create(payload);
      if (!renewRequest) {
        return {
          error: true,
          message: renewRequest,
        };
      }

      return {
        error: false,
        data: renewRequest,
      };
    } catch (e) {
      throw createError(e.message);
    }
  }

  /**
   *
   * @param {object} payload payload must be an object
   * @returns {object} return an object with error(true/false) and data/message
   */
  async findRenewRequestByUserId(payload) {
    console.log(payload)
    try {
      const renewRequest = await RenewRequest.findOne(payload);
      if (!renewRequest) {
        return {
          error: true,
          message: "Don't have any renew request.",
        };
      }

      return {
        error: false,
        data: renewRequest,
      };
    } catch (e) {
      throw createError(e.message);
    }
  }

  async findRenewRequests(query){
    try {
      let renewQuery = query ? {...query}:{}
      console.log(renewQuery);
      
      const renewRequest = await RenewRequest.find(renewQuery)
      console.log(renewRequest)
      if(renewRequest.length === 0){ return {
        error:true,
        message:"User dont send any renew request"
      }}

      return {
        error:false,
        data:renewRequest
      }
    } catch (e) {
      throw createError(e.message)
    }
  }

  /**
   *
   * @param {object} payload payload must be an object
   * @returns {object} return an object with error(true/false) and data/message
   */
  async deleteRenewRequest(payload) {
    try {
      const deleteRenewRequest = await RenewRequest.deleteOne(payload);
      if (!deleteRenewRequest) {
        return {
          error: true,
          message: "Error occure to delete renew request ",
        };
      }
      
      return {
        error:false,
        data:deleteRenewRequest
      }
    } catch (e) {
        throw createError(e.message)
    }
  }
}

module.exports = new RenewBookService()
