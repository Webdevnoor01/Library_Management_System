const libraryCardSearvice = require("../../service/libraryCardService/index");
const userService = require("../../service/userService/userService");
const customeError = require("../../util/throwError");

class LibraryCard {
    async create(req, res) {
        const {
            userName,
            depertment,
            issueDate,
            libraryId,
            bookLimit,
        } = req.body;

        try {
            const isLibraryCard = await libraryCardSearvice.findCardById(libraryId);
            console.log("lib: ", isLibraryCard);
            if (!isLibraryCard.error)
                throw customeError("You already create this library card", 400);

            const libraryCardPayload = {
                userName,
                depertment,
                issueDate,
                libraryId,
                bookLimit
            };
            console.log("payload: ", libraryCardPayload);
            const libraryCard = await libraryCardSearvice.createCard(
                libraryCardPayload
            );

            if (libraryCard.error) throw customeError("Something went wrong");

            res.status(200).json({
                messsage: "Library Card created successfully",
                libraryCard: libraryCard.data,
            });
        } catch (e) {
            console.log("libraryCardController-createLibraryCard: ", e.message);
            res.status(e.message.status || 500).json({
                errors: {
                    libraryCard: {
                        msg: e.message.txt || e.message,
                    },
                },
            });
        }
    }

    async findCard(_req, res) {
        const libraryCards = await libraryCardSearvice.findCard();
        try {
            if (libraryCards.error) throw customeError(libraryCards.message);

            res.status(200).json({
                message: `${libraryCards.data.length} library cards found`,
                libraryCards: libraryCards.data,
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

    async findCardByLid(req, res) {
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

    async deleteLibraryCardById(req, res) {
        const { libraryId, userRole } = req.body;
        try {
            if (!libraryId || !userRole)
                throw customeError("libraryId and userRole is required");

            const user = await userService.find;
        } catch (e) {
            console.log("libraryCardController: ", e);
            res.status(e.message.status).json({
                errors: {
                    libraryCard: {
                        msg: e.messsage.txt || e.message,
                    },
                },
            });
        }
    }
}

const LibraryCardController = new LibraryCard();

module.exports = LibraryCardController;