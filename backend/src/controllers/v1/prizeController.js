import Prize from "../../models/Prize.js";

class PrizeController {
  constructor() {
    this.prize = new Prize();
  }

  /**
   * Get the current prize amount
   * @param {*} req
   * @param {*} res
   */
  async getPrize(req, res) {
    try {
      const amount = await this.prize.getPrizeAmount();

      res.send({
        success: true,
        data: {
          money: amount,
        },
      });
    } catch (err) {
      res.send({
        success: false,
        message: "Failed to fetch prize amount",
      });
    }
  }

  /**
   * Update the prize amount and notify clients
   * @param {amount} req - The amount to be added to the prize
   * @param {success, message} res - Response indicating success or failure
   */
  async updatePot(req, res) {
    const { amount } = req.body || {};
    if (!amount || amount <= 0) {
      return res.send({
        success: false,
        message: "Invalid amount",
      });
    }
    try {
      await this.prize.updatesPot(amount);

      res.send({
        success: true,
        message: "Prize updated successfully",
      });
    } catch (err) {
      res.send({
        success: false,
        message: "Failed to update prize",
      });
    }
  }

  /**
   * Roll over the prize if there is no winner and notify clients
   * @param {userBets} req - The total user bets to be added to the prize
   * @param {success, message} res - Response indicating success or failure
   */
  async rollOverPrize(req, res) {
    const { userBets } = req.body || {};
    if (!userBets || userBets <= 0) {
      return res.send({
        success: false,
        message: "Invalid bet amount",
      });
    }
    try {
      // await this.prize.rollOverPot(userBets);

      res.send({
        success: true,
        message: "Prize rolled over successfully",
      });
    } catch (err) {
      res.send({
        success: false,
        message: "Failed to roll over prize",
      });
    }
  }
}

export default PrizeController;
