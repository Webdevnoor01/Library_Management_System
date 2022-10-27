const createError = require("http-errors");

class UserService {
  async createNewUser(model, payload) {
    try {
      const user = await model.create({ ...payload });
      return user;
    } catch (e) {
      return e;
    }
  }

  async findUserByProperty(model, query, requiredFields=null) {
    try {
      if(query === undefined){
        
        return await model.find({}, "studentName email phone address requestedBookList libraryId ")
      }
      if (query._id) {
        const user = await model.findById(query._id, requiredFields);
        if (!user) return false;
        return user;
      }
      const user = await model.findOne(query, requiredFields);

      if (!user) return false;

      return user;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async updateUserRef(model, query, refField, payload) {
    try {
      let user;
      if (query._id) {
        user = await model.findByIdAndUpdate(
          { _id: query._id },
          {
            $push: {
              [refField]: payload,
            },
          }
        );
      } else {
        user = await model.findOneAndUpdate(query, {
          $push: {
            [refField]: query.requestedBookId,
          },
        });
      }

      if (!user) return false;
      return user;
    } catch (e) {
      console.log(e);
      throw createError(e.message);
    }
  }

  async findRequestedBook(model, userId) {
    try {
      const requestedBooks = await model
        .findById(userId, "requestedBookList")
        .populate("requestedBookList");
      if (!requestedBooks) {
        return {
          error: true,
          message: "You don't have any requested book",
        };
      }
      return {
        error: false,
        data: requestedBooks.requestedBookList,
      };
    } catch (e) {
      console.log(e);
      throw createError(e.message);
    }
  }

}

module.exports = new UserService();
