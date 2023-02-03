const libraryCardSearvice = require("../../service/libraryCardService/index");
const customeError = require("../../util/throwError");

class LibraryCard {
    async create(req, res, _next) {
        const { userName, depertment, issueDate, libraryId, bookLimit } = req.body;
        try {
            const isLibraryCard = await libraryCardSearvice.findCardById(libraryId);
            if (isLibraryCard.error)
                throw customeError("You already create this library card", 400);
            const libraryCard = await libraryCardSearvice.createCard({
                userName,
                depertment,
                issueDate,
                libraryId,
                bookLimit,
            });

            if (libraryCard.error) throw customeError("Something went wrong");
            res
                .status(200)
                .json({ messsage: "Library Card created successfully", libraryCard });
        } catch (e) {
            res.status(e.message.status).json({
                errors: {
                    libraryCard: {
                        msg: e.message.txt || e.message,
                    },
                },
            });
        }
    }

    async findCard(_req, res, _next) {
        const libraryCards = await libraryCardSearvice.findCard();
        try {
            if (libraryCards.error) throw customeError(libraryCards.message);

            res.status(200).json({
                message: `${libraryCards.length} library cards found`,
            });
        } catch (e) {
            console.log(e);
            res.status(e.message.status).json({
                errors: {
                    libraryCard: {
                        msg: e.message.txt,
                    },
                },
            });
        }
    }

    async findCardByLid(req, res, _next) {
        const { libraryId } = req.params;
        try {
            const libraryCard = await libraryCardSearvice.findCardById(libraryId);
            if (libraryCard.error) throw customeError(libraryCard.message);

            res.status(200).json({
                libraryCard: libraryCard.data,
            });
        } catch (e) {
            res.status(e.message.status).json({
                errors: {
                    libraryCard: {
                        msg: e.message.txt || e.message,
                    },
                },
            });
        }
    }

    async uadateCard(req, res, next) {
        const { libraryId } = req.params;
        const updateData = req.body;
        try {
            const isLibraryCard = await libraryCardSearvice.findCardById(libraryId);
            if (isLibraryCard.error) throw customeError(isLibraryCard.message);

            const libraryCard = await libraryCardSearvice.updateLibraryCard(
                libraryId, {...updateData }
            );
            if (libraryCard.error) throw libraryCard.message;

            res.status(200).json({
                message: "Your library card updated successfully",
            });
        } catch (e) {
            res.status(e.message.status).json({
                error: {
                    libraryCard: {
                        msg: e.message.txt || e.message,
                    },
                },
            });
        }
    }
}

const LibraryCardController = new LibraryCard();

module.exports = LibraryCardController;