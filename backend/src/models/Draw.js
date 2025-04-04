import { slaveDb, masterDb } from "../core/database.js";
import Prize from "./Prize.js";

class Draw {
  constructor() {
    this.master = masterDb; // Master pool for write operations
    this.slave = slaveDb; // Slave pool for read operations
    this.prize = new Prize();
  }

  // Helper function to get a connection from the pool
  async getConnection() {
    return await this.master.getConnection(); // Use master for writes
  }

  // Create a new draw entry in the database
  async createNewDraw() {
    const conn = await this.getConnection(); // Get connection from the pool
    try {
      const [result] = await conn.execute(
        "INSERT INTO draws (numbers, status, created_at) VALUES (NULL, 'open', NOW())"
      );
      return result.insertId;
    } catch (err) {
      console.error("Error in createNewDraw:", err);
      throw err;
    } finally {
      conn.release(); // Release connection back to the pool
    }
  }

  // Get the latest draw ID or create a new one if none exists
  async getLatestDrawId() {
    const conn = await this.slave.getConnection(); // Get connection from the slave pool
    try {
      const [draw] = await conn.execute(
        "SELECT * FROM draws WHERE status = 'open' ORDER BY created_at DESC LIMIT 1"
      );
      return draw.length ? draw[0].draw_id : await this.createNewDraw();
    } catch (err) {
      console.error("Error in getLatestDrawId:", err);
      throw err;
    } finally {
      conn.release(); // Release connection back to the pool
    }
  }

  // Store the draw result and process winners
  async storeDrawResult(winningNumbers) {
    const conn = await this.getConnection(); // Get connection from the pool
    try {
      // Get the latest draw ID
      const currentDrawId = await this.getLatestDrawId();

      // Start a transaction to ensure atomicity
      await conn.beginTransaction();

      // Update the latest draw with winning numbers
      const [updateResult] = await conn.execute(
        "UPDATE draws SET numbers = ?, status = 'completed', created_at = NOW() WHERE draw_id = ?",
        [winningNumbers, currentDrawId]
      );

      console.log("✅ Draw result updated for draw ID:", currentDrawId);

      // Check and process winners
      await this.checkWinner(conn, currentDrawId, winningNumbers);

      // Start a new draw for the next round
      await this.createNewDraw();

      // Commit the transaction
      await conn.commit();

      return updateResult;
    } catch (err) {
      await conn.rollback(); // Rollback on error
      console.error("<error> Draw.storeDrawResult", err);
      throw err;
    } finally {
      conn.release(); // Release connection back to the pool
    }
  }

  // Check and process winners based on the draw result
  async checkWinner(conn, draw_id, numbers) {
    try {
      // Find winning bets
      const [winningBets] = await conn.execute(
        `SELECT user_id, bet_id
         FROM bets 
         WHERE draw_id = ? AND FIND_IN_SET(bet_number, ?)
         GROUP BY user_id`,
        [draw_id, numbers]
      );

      // If no winners, mark bets as lost
      if (!winningBets.length) {
        await conn.execute(
          "UPDATE bets SET status = 'lost' WHERE draw_id = ?",
          [draw_id]
        );
      }

      for (const winner of winningBets) {
        // Mark each bet as won
        await conn.execute("UPDATE bets SET status = 'won' WHERE bet_id = ?", [
          winner.bet_id,
        ]);

        // Insert each winner into the `winners` table
        await conn.execute(
          "INSERT INTO winners (user_id, draw_id, bet_id) VALUES (?, ?, ?)",
          [winner.user_id, draw_id, winner.bet_id]
        );
      }

      // Update losing bets for those not in the winners list
      if (winningBets.length > 0) {
        await conn.execute(
          `UPDATE bets 
           SET status = 'lost' 
           WHERE draw_id = ? 
           AND bet_id NOT IN (${winningBets.map(() => "?").join(",")})`,
          [draw_id, ...winningBets.map((w) => w.bet_id)]
        );
      }

      // Distribute prizes to winners
      await this.prize.distributePrizes(winningBets);

      return "Winners Processed Successfully";
    } catch (err) {
      console.error("<error> checkWinner", err);
      throw err;
    }
  }

  // Get the latest draw result
  async getLatestDraw() {
    const conn = await this.slave.getConnection(); // Get connection from the slave pool
    try {
      const [result] = await conn.execute(
        "SELECT * FROM draws ORDER BY created_at DESC LIMIT 1"
      );
      return result[0] || null;
    } catch (err) {
      console.error("<error> Draw.getLatestDraw", err);
      throw err;
    } finally {
      conn.release(); // Release connection back to the pool
    }
  }

  // Get the latest completed draw result
  async getLatestResult() {
    const conn = await this.slave.getConnection(); // Get connection from the slave pool
    try {
      const [result] = await conn.execute(
        "SELECT * FROM draws WHERE status = 'completed' ORDER BY created_at DESC LIMIT 1"
      );
      return result[0];
    } catch (err) {
      console.error("<error> Draw.getLatestResult", err);
      throw err;
    } finally {
      conn.release(); // Release connection back to the pool
    }
  }

  // Get the draw results by date
  async getAlldrawResultByDate() {
    const conn = await this.slave.getConnection(); // Get connection from the slave pool
    try {
      const [result] = await conn.execute(
        "SELECT * FROM draws WHERE status = 'completed' ORDER BY created_at DESC LIMIT 10"
      );
      return result;
    } catch (err) {
      console.error("<error> Draw.getAlldrawResultByDate", err);
      throw err;
    } finally {
      conn.release(); // Release connection back to the pool
    }
  }

  // Get the user bet status for the latest completed draw
  async getUserBetStatusByLatestDraw(status) {
    const conn = await this.slave.getConnection(); // Get connection from the slave pool
    try {
      const [latestDraw] = await conn.execute(
        "SELECT draw_id FROM draws WHERE status = 'completed' ORDER BY created_at DESC LIMIT 1"
      );

      if (latestDraw.length === 0) {
        return []; // No completed draws found
      }

      const { draw_id } = latestDraw[0];

      const [losers] = await conn.execute(
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

      return losers.length > 0 ? losers : [];
    } catch (err) {
      console.error("<error> Draw.getUserBetStatusByLatestDraw", err);
      throw err;
    } finally {
      conn.release(); // Release connection back to the pool
    }
  }
}

export default Draw;
