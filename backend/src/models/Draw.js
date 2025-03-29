import { connection } from "../core/database.js";
import Prize from "./Prize.js";

class Draw {
  constructor() {
    this.db = connection;
    this.prize = new Prize();
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
      // ✅ Get the latest draw ID
      const currentDrawId = await this.getLatestDrawId();

      // ✅ Update the latest draw with winning numbers
      const [updateResult] = await this.db.execute(
        "UPDATE draws SET numbers = ?, status = 'completed', created_at = NOW() WHERE draw_id = ?",
        [winningNumbers, currentDrawId]
      );

      console.log("✅ Draw result updated for draw ID:", currentDrawId);

      // ✅ check Winners
      await this.checkWinner(currentDrawId, winningNumbers);

      // ✅ Start a new draw
      await this.createNewDraw();

      return updateResult;
    } catch (err) {
      console.error("<error> Draw.storeDrawResult", err);
      throw err;
    }
  }

  async checkWinner(draw_id, numbers) {
    try {
      // ✅ Find winning bets
      const [winningBets] = await this.db.execute(
        `SELECT user_id, bet_id
       FROM bets 
       WHERE draw_id = ? AND FIND_IN_SET(bet_number, ?)
       GROUP BY user_id`,
        [draw_id, numbers]
      );

      // if (!winningBets.length) return "No Winner Found";
      if (!winningBets.length)
        await this.db.execute(
          "UPDATE bets SET status = 'lost' WHERE draw_id = ?",
          [draw_id]
        );

      for (const winner of winningBets) {
        await this.db.execute(
          "UPDATE bets SET status = 'won' WHERE bet_id = ?",
          [winner.bet_id]
        );
        // ✅ Insert each winner into the `winners` table
        await this.db.execute(
          "INSERT INTO winners (user_id, draw_id, bet_id) VALUES (?, ?, ?)",
          [winner.user_id, draw_id, winner.bet_id]
        );
      }

      if (winningBets.length > 0) {
        // ✅ If there are winners, update losing bets
        await this.db.execute(
          `UPDATE bets 
     SET status = 'lost' 
     WHERE draw_id = ? 
     AND bet_id NOT IN (${winningBets.map(() => "?").join(",")})`,
          [draw_id, ...winningBets.map((w) => w.bet_id)]
        );
      }

      // ✅ Update losing bets (bets NOT in winningBets)

      // ✅ Call `distributePrizes` with all winners
      await this.prize.distributePrizes(winningBets);

      return "Winners Processed Successfully";
    } catch (err) {
      console.error("<error> checkWinner", err);
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
        "SELECT draw_id FROM draws WHERE status = 'completed' ORDER BY created_at DESC LIMIT 1"
      );

      if (latestDraw.length === 0) {
        return []; // No draw results found
      }

      const { draw_id } = latestDraw[0];

      // Fetch winners for the latest draw
      const [winners] = await connection.execute(
        `SELECT 
                    wr.winner_id, 
                    wr.draw_id, 
                    wr.bet_id, 
                    u.user_id, 
                    b.bet_number, 
                    dr.numbers 
                 FROM winners wr
                 JOIN users u ON wr.user_id = u.user_id
                 JOIN bets b ON wr.bet_id = b.bet_id
                 JOIN draws dr ON wr.draw_id = dr.draw_id
                 WHERE dr.draw_id = ? AND dr.status = 'completed'
                 ORDER BY wr.winner_id DESC`,
        [draw_id]
      );

      return winners.length > 0 ? winners || [] : [];
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

      return result[0];
    } catch (err) {
      console.error("<error> Draw.getLatestDraw", err);
      throw err;
    }
  }

  async getAlldrawResultByDate() {
    try {
      const [result] = await this.db.execute(
        "SELECT * FROM draws where status = 'completed' ORDER BY created_at DESC LIMIT 10"
      );

      return result[0];
    } catch (err) {
      console.error("<error> Draw.getLatestDraw", err);
      throw err;
    }
  }

  async getUserBetStatusByLatestDraw(status) {
    try {
      // ✅ Get the latest completed draw
      const [latestDraw] = await connection.execute(
        "SELECT draw_id FROM draws WHERE status = 'completed' ORDER BY created_at DESC LIMIT 1"
      );

      if (latestDraw.length === 0) {
        return []; // ✅ No completed draws found
      }

      const { draw_id } = latestDraw[0];

      // ✅ Fetch users who placed bets in the latest draw
      const [lossers] = await connection.execute(
        `SELECT 
                u.user_id, 
                u.username, 
                b.bet_id, 
                b.bet_number
             FROM bets b
             JOIN users u ON b.user_id = u.user_id
             WHERE b.draw_id = ? AND b.status = ?`,
        [draw_id, status]
      );

      return lossers.length > 0 ? lossers : []; // ✅ Always return an array
    } catch (err) {
      console.error("<error> Draw.getUserBetsStatusByLatestDRaw", err);
      throw err;
    }
  }
}

export default Draw;
