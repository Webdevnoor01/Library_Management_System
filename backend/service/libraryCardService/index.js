const LibraryCard = require("../../models/libraryCard");

class LibraryCardSearvice {
  async createCard({ userName, depertment, issueDate, libraryId, bookLimit }) {
    const isLibraryCard = await this.findCardById(libraryId);
    if (isLibraryCard) {
      return false;
    }
    const libraryCard = await LibraryCard.create({
      userName,
      depertment,
      issueDate,
      libraryId,
      bookLimit,
    });

    return libraryCard;
  }

  async findCard() {
    const libraryCards = await LibraryCard.find({});
    return libraryCards;
  }

  async findCardById(libraryId) {
    const libraryCard = await LibraryCard.findOne({
      libraryId,
    });
    return libraryCard;
  }

  async updateLibraryCard(libraryId, payload) {
    try {
      const libraryCard = await LibraryCard.findOneAndUpdate(
        { libraryId: libraryId },
        { ...payload }
      );
      return true;
    } catch (e) {
      return e;
    }
  }
}

const libraryCardSearvice = new LibraryCardSearvice();

module.exports = libraryCardSearvice;
