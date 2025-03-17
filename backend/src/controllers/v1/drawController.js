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
      const winningNumbers = this.generateWinningNumbers();
      const winningNumber = [1, 2, 3, 4, 5, 6];
      // const response = await this.draw.storeDrawResult(winningNumbers);
      // console.log(response);

      console.log("🎉 Winning Numbers:", winningNumbers);

      // // ✅ Fetch only bets for the current round
      const currentDrawId = await this.draw.getLatestDrawId();
      // console.log(currentDrawId);
      const allBets = await this.bet.getBetsByDraw(currentDrawId);
      console.log(allBets);
      const result = await this.draw.getLatestDraw();
      console.log(result);

      // ✅ Store draw result in the database
      const response = await this.draw.storeDrawResult(winningNumbers);

      console.log(response);

      let winningUsers = [];

      for (const bet of allBets) {
        // ✅ Convert bet_number "XX-XX-XX-XX-XX-XX" into an array
        const betNumbersArray = bet.bet_number.split("-").map(Number);
        console.log("🎟️ Bet Numbers:", betNumbersArray);

        // ✅ Compare sorted arrays for an exact match
        if (
          JSON.stringify(betNumbersArray.sort()) ===
          JSON.stringify(winningNumber)
        )
          winningUsers.push(bet.user_id);
      }
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

      console.log(result);
      return res.json({ success: true, result: result });
    } catch (err) {
      console.error("❌ Error in getLatestDraw:", err);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
}

export default DrawController;
