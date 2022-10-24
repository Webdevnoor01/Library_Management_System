const createError = require("http-errors");
const libraryCardSearvice = require("../libraryCardService/index");

class UserService {
  async createNewUser(model, payload) {
    try {
      const user = await model.create({ ...payload });
      return user;
    } catch (e) {
      return e;
    }
  }

  async findUserByProperty(model, query) {
    try {
      if (query._id) {
        const user = await model.findById(query.value);
        if (!user) return false;
        return user;
      }
      const user = await model.findOne(query);
      console.log(user);

      if (!user) return false;

      return user;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async findUserByPropertyAndRegister(model, query, lbId) {
    try {
      // First check that the library card is valid or not

      const libraryCard = await libraryCardSearvice.findCardById(lbId);
      console.log("libraryId:", lbId);

      if (libraryCard) {
        if (query._id) {
          const user = await model.findById(query.value);

          if (!user) return false;
          if (
            user.libraryId === libraryCard.libraryId &&
            user.studentName === libraryCard.userName
          ) {
            return true;
          } else {
            throw new Error("Please type valid library id");
          }
        }

        const user = await model.findOne(query);
        if (!user) {
          return false;
        } else {
          if (user.libraryId == libraryCard.libraryId) {
            if (user.studentName) {
              if (user.studentName == libraryCard.userName) {
                return false;
              }
            }
            if (user.teacherName) {
              if (user.teacherName == libraryCard.userName) {
                return false;
              }
            }
          } else {
            throw new Error("Please type valid library id");
          }
        }
      } else {
        throw new Error("Please type valid library id");
      }
    } catch (e) {
      console.log(e);
      throw new Error(e.message);
    }
  }

  async updateUserRef(model, query, payload) {
    try {
      let user;
      if (query._id) {
        user = await model.findByIdAndUpdate(
          { _id: query._id },
          {
            $push: {
              requestedBookList: payload.requestedBookId,
            },
          }
        );
      } else {
        user = await model.findOneAndUpdate(query, {
          $push: {
            requestedBookList: query.requestedBookId,
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
