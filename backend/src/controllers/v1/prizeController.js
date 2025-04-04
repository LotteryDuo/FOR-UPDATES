import Prize from "../../models/Prize.js";
import Draw from "../../models/Draw.js";
import User from "../../models/user.js";

class PrizeController {
  constructor() {
    this.prize = new Prize();
    this.draw = new Draw();
    this.user = new User();
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

      console.log(amount);

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
   * @param {userBet} req - The total user bets to be added to the prize
   * @param {success, message} res - Response indicating success or failure
   */
  async updatePrizeAmount(req, res) {
    const { userBet } = req.body || {};
    if (!userBet || userBet <= 0) {
      return res.send({
        success: false,
        message: "Invalid bet amount",
      });
    }
    try {
      await this.prize.updatePrizeAmount(userBet);
      const amount = await this.prize.getPrizeAmount();

      res.send({
        success: true,
        message: "Prize Updated successfully",
        data: {
          money: amount,
        },
      });
    } catch (err) {
      res.send({
        success: false,
        message: "Failed to Update Prize",
      });
    }
  }
}

export default PrizeController;
