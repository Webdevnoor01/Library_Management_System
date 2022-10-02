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

  async findUserByProperty(model, key, value, libraryId) {
    try {
      // First check that the library card is valid or not

      const libraryCard = await libraryCardSearvice.findCardById(libraryId);
      if (libraryCard) {
        if (key === "_id") {
          const user = await model.findById(value);

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

        const user = await model.findOne({ key: value });

        if (!user) {
          if(libraryId === libraryCard.libraryId){
            return false
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
      console.log(e);
      return e;
    }
  }
}

module.exports = new UserService();
