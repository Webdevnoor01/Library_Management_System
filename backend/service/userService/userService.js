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

  async findUserByPropertyAndRegister(model, query, libraryId) {
    try {
      // First check that the library card is valid or not

      const libraryCard = await libraryCardSearvice.findCardById(libraryId);
      console.log(libraryCard);

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
        console.log(user);
        if (!user) {
          if (libraryId === user.libraryId) {
            return false;
          }
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
        console.log(user);
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
}

module.exports = new UserService();
