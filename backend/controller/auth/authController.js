class AuthController {
  async register(req, res, next) {
    const {
      studentName,
      email,
      phone,
      password,
      avatar,
      depertment,
      semester,
      admission_date,
      current_year,
      address,
      libraryId,
    } = req.body;

    try {
      res.status(200).json({
        message: "Thsi is regiser route",
      });
    } catch (error) {}
  }
}

const authController = new AuthController();

module.exports = authController;
