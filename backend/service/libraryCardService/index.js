const LibraryCard = require("../../models/libraryCard");
const customError = require("../../util/throwError");

class LibraryCardSearvice {
    async createCard({ userName, depertment, issueDate, libraryId, bookLimit }) {
        const isLibraryCard = await this.findCardById(libraryId);
        // if (isLibraryCard) {
        //   return false;
        // }
        const libraryCard = await LibraryCard.create({
            userName,
            depertment,
            issueDate,
            libraryId,
            bookLimit,
        });
        if (!libraryCard) {
            return {
                error: true,
                message: libraryCard
            }
        }

        return {
            error: false,
            data: libraryCard
        };
    }

    async findCard() {
        const libraryCards = await LibraryCard.find({});
        if (libraryCards.length === 0) {
            return {
                error: true,
                message: "Empty library cards"
            }
        }
        return {
            return: false,
            data: libraryCards
        };
    }

    async findCardById(libraryId) {
        const libraryCard = await LibraryCard.findOne({
            libraryId: libraryId,
        });
        if (!libraryCard) {
            return {
                error: true,
                message: "Library card not found"
            }
        }
        return {
            error: false,
            data: libraryCard
        };
    }

    async updateLibraryCard(libraryId, payload) {
        try {
            const libraryCard = await LibraryCard.findOneAndUpdate({ libraryId: libraryId }, {...payload });
            if (!libraryCard) {
                return {
                    error: true,
                    message: libraryCard
                }
            }
            return {
                error: false,
                data: libraryCard
            };
        } catch (e) {
            throw customError(e.message, `${e?.status}`)
        }
    }
}

const libraryCardSearvice = new LibraryCardSearvice();

module.exports = libraryCardSearvice;