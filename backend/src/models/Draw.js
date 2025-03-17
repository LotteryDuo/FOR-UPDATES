import { connection } from "../core/database.js";

class Draw {
  constructor() {
    this.db = connection;
  }

  async createNewDraw() {
    try {
      const [result] = await connection.execute(
        "INSERT INTO draws (numbers, status, created_at) VALUES (NULL, 'open', NOW())"
      );
      return result.insertId;
    } catch (err) {
      console.error("Error in createNewRound:", err);
      throw err;
    }
  }

  async getLatestDrawId() {
    const [draw] = await connection.execute(
      "SELECT * FROM draws WHERE status = 'open' ORDER BY created_at DESC LIMIT 1"
    );
    return draw.length ? draw[0].draw_id : await this.createNewDraw();
  }

  /**
   * Store draw result in the database
   * @param {Array} winningNumbers - The 6 winning numbers
   * @returns {Object} Insert result
   */
  async storeDrawResult(winningNumbers) {
    try {
      console.log("Winning Numbers:", winningNumbers);

      // Convert array to string
      const winningNumbersStr = winningNumbers.join("-");

      // ✅ Get the latest draw ID
      const currentDrawId = await this.getLatestDrawId();

      // ✅ Fetch the latest pot_id
      const [potData] = await this.db.execute(
        "SELECT prize_id FROM prize ORDER BY prize_id DESC LIMIT 1"
      );

      const currentPotId = potData.length > 0 ? potData[0].prize_id : null;

      // ✅ Update the latest draw with winning numbers
      const [updateResult] = await this.db.execute(
        "UPDATE draws SET numbers = ?, status = 'completed', created_at = NOW() WHERE draw_id = ?",
        [winningNumbersStr, currentDrawId]
      );

      console.log("✅ Draw result updated for draw ID:", currentDrawId);

      // ✅ Find winning bets
      const [winningBets] = await this.db.execute(
        `SELECT user_id, bet_id
       FROM bets 
       WHERE draw_id = ? AND FIND_IN_SET(bet_number, ?) 
       GROUP BY user_id`,
        [currentDrawId, winningNumbersStr]
      );

      if (winningBets.length > 0) {
        console.log("🎉 Winners Found:", winningBets);

        for (const winner of winningBets[0]) {
          // ✅ Insert only the first winning bet per user
          await this.db.execute(
            "INSERT INTO winners (user_id, draw_id, bet_id) VALUES (?, ?, ?)",
            [winner.user_id, currentDrawId, winner.bet_id]
          );
        }
      }

      // ✅ Start a new draw
      await this.createNewDraw();

      return updateResult;
    } catch (err) {
      console.error("<error> Draw.storeDrawResult", err);
      throw err;
    }
  }

  /**
   * Get winners with their usernames
   * @returns {Array} List of winners with usernames
   */
  async getWinningUsersByLatestDraw() {
    try {
      // Get the latest draw result
      const [latestDraw] = await connection.execute(
        "SELECT draw_id, round_id, winning_no FROM draw_result ORDER BY created_at DESC LIMIT 1"
      );

      if (latestDraw.length === 0) {
        return []; // No draw results found
      }

      const { draw_id, round_id, winning_no } = latestDraw[0];

      // Fetch winners for the latest draw
      const [winners] = await connection.execute(
        `SELECT 
                    wr.win_id, 
                    wr.draw_id, 
                    wr.bet_id, 
                    u.username, 
                    b.bet_amount, 
                    b.bet_number, 
                    dr.winning_no 
                 FROM win_result wr
                 JOIN users u ON wr.user_id = u.user_id
                 JOIN bet b ON wr.bet_id = b.bet_id
                 JOIN draw_result dr ON wr.draw_id = dr.draw_id
                 WHERE dr.round_id = ?
                 ORDER BY wr.win_id DESC`,
        [round_id]
      );

      return winners.length > 0 ? winners : [];
    } catch (err) {
      console.error("<error> Draw.getWinningUsersByLatestDraw", err);
      throw err;
    }
  }

  /**
   * Get the latest draw result
   * @returns {Object} Draw result
   */
  async getLatestDraw() {
    try {
      const [result] = await this.db.execute(
        "SELECT * FROM draws ORDER BY created_at DESC LIMIT 1"
      );
      return result[0] || null;
    } catch (err) {
      console.error("<error> Draw.getLatestDraw", err);
      throw err;
    }
  }

  async getLatestResult() {
    try {
      const [result] = await this.db.execute(
        "SELECT * FROM draws where status = 'completed' ORDER BY created_at DESC LIMIT 1"
      );

      // console.log(result);
      return result[0];
    } catch (err) {
      console.error("<error> Draw.getLatestDraw", err);
      throw err;
    }
  }
}

export default Draw;
