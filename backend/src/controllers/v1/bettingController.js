import Bet from "../../models/Bet.js";
import Prize from "../../models/Prize.js";

class BettingController {
  constructor() {
    this.bet = new Bet();
    this.prize = new Prize();
  }

  async isValidNumbers(num) {
    // Split input by `-` (or space/comma if needed)
    const numbers = num.split("-");

    for (const number of numbers) {
      const intNum = parseInt(number, 10);

      if (number === "0" || number === "00" || intNum < 1 || intNum > 49)
        return false; // Invalid number detected
    }

    return true;
  }

  /**
   * Place a bet
   * @param {*} req - user_id, bet_amount, bet_number
   * @param {*} res - success or failure response
   */
  async placeBet(req, res) {
    const { bet_number } = req.body || {};
    const user_id = res.locals.user_id;

    // console.log(bet_number, user_id);

    const validNum = await this.isValidNumbers(bet_number);

    if (!validNum)
      return res.send({
        success: false,
        message: "Invalid bet number format. (Sample input: 01-02-03-04-05-06)",
      });

    if (!user_id || !bet_number)
      return res.send({ success: false, message: "Invalid bet details" });

    // Validate bet_number format "XX-XX-XX-XX-XX-XX"
    // ^(?!0{2}([\s,-]0{2}){5}$)(\d{2}[\s,-]){5}\d{2}$
    // ^(\d{1,2}[\s,-]){5}\d{1,2}$
    const betNumberPattern = /^(?!0{2}([\s,-]0{2}){5}$)(\d{2}[\s,-]){5}\d{2}$/;
    if (!betNumberPattern.test(bet_number))
      return res.send({
        success: false,
        message: "Invalid bet number format. Use XX-XX-XX-XX-XX-XX",
      });

    try {
      // ✅ Place the bet with the latest round_id
      const { bet_id, draw_id, numbers } = await this.bet.placeBet(
        user_id,
        bet_number
      );

      res.send({
        success: true,
        message: "Bet placed successfully",
        bet_id: bet_id,
        draw_id: draw_id,
        bet_numbers: numbers,
      });
    } catch (err) {
      res.send({
        success: false,
        message: err.message,
      });
    }
  }

  async getBettors(req, res) {
    try {
      const user_id = res.locals.user_id;
      if (!user_id) {
        return res.status(400).send({
          success: false,
          message: "UnAuthenticated User",
        });
      }

      const user = await this.bet.getUserByDraws(user_id);

      if (user.length === 0) {
        return res.status(404).send({
          success: false,
          message: "No bettors found.",
          data: [],
        });
      }
      res.send({
        success: true,
        message: "User Found!",
        data: user,
      });
    } catch (err) {
      res.send({
        success: false,
        message: err.message,
      });
    }
  }
}

export default BettingController;
