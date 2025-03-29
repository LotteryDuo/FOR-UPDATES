import Draw from "../../models/Draw.js";
import Bet from "../../models/Bet.js";

class DrawController {
  constructor() {
    this.draw = new Draw();
    this.bet = new Bet();
  }

  generateWinningNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
      numbers.add(Math.floor(Math.random() * 49) + 1);
    }
    return Array.from(numbers);
  }

  async createDraw(req, res) {
    try {
      // const winningNumber = this.generateWinningNumbers();
      const winningNumber = [1, 2, 3, 4, 5, 6];
      const formattedNumbers = winningNumber.map((num) =>
        num < 10 ? `0${num}` : `${num}`
      );

      const winningNumbers = formattedNumbers.join("-");

      await this.draw.storeDrawResult(winningNumbers);

      res.send({
        success: true,
        message: "Draw result stored and bets processed successfully.",
        data: {
          draw_numbers: winningNumbers,
        },
      });
    } catch (err) {
      console.error("❌ Error in createDraw:", err);
      res.send({
        success: false,
        message: err.toString(),
      });
    }
  }

  async getLatestDraw(req, res) {
    try {
      const latestDraw = await this.draw.getLatestDraw();

      if (!latestDraw) {
        return res
          .status(404)
          .json({ success: false, message: "No draw found." });
      }

      res.json({ success: true, draw: latestDraw });
    } catch (err) {
      console.error("❌ Error in getLatestDraw:", err);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async getLatestDrawResult(req, res) {
    try {
      const result = await this.draw.getLatestResult();
      if (!result) {
        return res
          .status(404)
          .json({ success: false, message: "No draw found." });
      }

      return res.json({ success: true, result: result });
    } catch (err) {
      console.error("❌ Error in getLatestDraw:", err);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async getWinningUsersByLatestDraw(req, res) {
    try {
      const result = await this.draw.getWinningUsersByLatestDraw();
      if (!result) {
        return res
          .status(404)
          .json({ success: false, message: "No winner found." });
      }

      return res.json({
        success: true,
        result: result.length > 0 ? result : [],
      });
    } catch (err) {
      console.error("❌ Error in getLatestDraw:", err);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async getUserBetStatusByLatestDraw(req, res) {
    try {
      const status = req.params.status;

      console.log(status);

      const bettors = await this.draw.getUserBetStatusByLatestDraw(status); // ✅ Call the model function

      if (bettors.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No bettors found for the last completed draw.",
        });
      }

      res.json({
        success: true,
        message: "Bettors retrieved successfully.",
        result: bettors.length > 0 ? bettors : [],
      });
    } catch (err) {
      console.error("❌ Error in getUserBetsStatusByLatestDraw:", err);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
}

export default DrawController;
