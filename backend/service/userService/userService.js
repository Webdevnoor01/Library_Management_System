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
          if (libraryId === libraryCard.libraryId) {
            return false;
          }
        } else {
          if (user.libraryId == libraryCard.libraryId) {
            if (user.studentName == libraryCard.userName) {
              return false;
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
}

module.exports = new UserService();