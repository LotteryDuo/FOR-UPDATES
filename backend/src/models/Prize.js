import { slaveDb, masterDb } from "../core/database.js";
import User from "./user.js";

class Prize {
  constructor() {
    this.master = masterDb; // Master pool for write operations
    this.slave = slaveDb; // Slave pool for read operations
    this.user = new User();
  }

  // Helper function to get a connection from the pool
  async getConnection() {
    return await this.master.getConnection(); // Use master for writes
  }

  // Add prize money to the prize pool
  async addPrizeMoney() {
    const conn = await this.getConnection(); // Get connection from the pool
    try {
      const [result] = await conn.execute(
        "INSERT INTO prize (money, status) VALUES (1500, 'unclaim')"
      );

      return result;
    } catch (err) {
      console.error("<error> Prize.addPrizeMoney", err);
      throw err;
    } finally {
      conn.release(); // Release connection back to the pool
    }
  }

  // Distribute prizes to winners
  async distributePrizes(winners) {
    const conn = await this.getConnection(); // Get connection from the pool
    try {
      const prizeAmount = await this.getPrizeAmount();

      if (!winners || winners.length === 0) {
        return;
      }

      const sharePerWinner = Math.max(
        1,
        Math.floor(prizeAmount / winners.length)
      );

      await conn.beginTransaction(); // Start transaction

      for (const winner of winners) {
        await this.user.updateBalance(
          winner.user_id,
          sharePerWinner,
          "winning"
        );
      }

      await conn.execute(
        "UPDATE prize SET status = 'claimed' WHERE status = 'unclaim'"
      );

      // Add new prize money after distributing
      await this.addPrizeMoney();

      await conn.commit(); // Commit transaction

      return sharePerWinner;
    } catch (err) {
      await conn.rollback(); // Rollback transaction on error
      console.error("<error> prize.distributePrizes", err);
      throw err;
    } finally {
      conn.release(); // Release connection back to the pool
    }
  }

  // Get the current prize amount
  async getPrizeAmount() {
    const conn = await this.slave.getConnection(); // Use slave for reading
    try {
      const [result] = await conn.execute(
        "SELECT money FROM prize WHERE status = ?",
        ["unclaim"]
      );

      // If no prize money exists, create a new prize entry
      if (result.length === 0) {
        // No existing prize, add the default prize
        await this.addPrizeMoney();
        return 1500; // Return the default prize amount
      }

      return result?.[0].money || 0;
    } catch (err) {
      console.error("<error> prize.getPrizeAmount", err);
      throw err;
    } finally {
      conn.release(); // Release connection back to the pool
    }
  }

  // Update the prize amount after a user bet
  async updatePrizeAmount(userBet) {
    const conn = await this.getConnection(); // Get connection from the pool
    try {
      const [result] = await conn.execute(
        "UPDATE prize SET money = money + ? WHERE status = 'unclaim'",
        [userBet]
      );
      return result;
    } catch (err) {
      console.error("<error> prize.updatePrizeAmount", err);
      throw err;
    } finally {
      conn.release(); // Release connection back to the pool
    }
  }
}

export default Prize;
