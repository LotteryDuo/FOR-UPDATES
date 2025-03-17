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

  /**
   * Process bets - Check winners
   * @param {*} req - winning_number (array of 6 numbers)
   * @param {*} res - success or failure response
   */
  // async processBets(req, res) {
  //   const { winning_number } = req.body || {};

  //   if (
  //     !winning_number ||
  //     !Array.isArray(winning_number) ||
  //     winning_number.length !== 6
  //   ) {
  //     return res.send({
  //       success: false,
  //       message: "Winning number must be an array of 6 numbers",
  //     });
  //   }

  //   try {
  //     // ✅ Fetch bets for the current round
  //     const round_id = await this.bet.getLatestRoundId();
  //     const allBets = await this.bet.getBetsByRound(round_id);
  //     let winningUsers = [];

  //     for (const bet of allBets) {
  //       const betNumbersArray = bet.bet_number.split("-").map(Number);

  //       // ✅ Check if bet matches the winning numbers
  //       if (
  //         betNumbersArray.every((num, index) => num === winning_number[index])
  //       ) {
  //         winningUsers.push(bet.user_id);
  //       }
  //     }

  //     // ✅ Increment round_id (start a new round)
  //     await this.bet.incrementRoundId();

  //     res.send({
  //       success: true,
  //       message: "Bets processed successfully",
  //       winningUsers,
  //       newRoundId: round_id + 1,
  //     });
  //   } catch (err) {
  //     res.send({ success: false, message: err.message });
  //   }
  // }
}

export default BettingController;
