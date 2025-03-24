import { connection } from "../core/database.js";
import User from "./user.js";

class Prize {
  constructor() {
    this.db = connection;
    this.user = new User();
  }

  async addPrizeMoney() {
    try {
      const [result] = await this.db.execute(
        "INSERT INTO prize (money, status) VALUES (1500, 'unclaim')"
      );

      return result[0];
    } catch (err) {
      console.error("<error> Prize.addPrizeMoney", err);
      throw err;
    }
  }

  async distributePrizes(winners) {
    try {
      const prizeAmount = await this.getPrizeAmount();

      if (!winners || winners.length === 0) {
        return;
      }

      const sharePerWinner = Math.max(
        1,
        Math.floor(prizeAmount / winners.length)
      );

      for (const winner of winners) {
        await this.user.updateBalance(
          winner.user_id,
          sharePerWinner,
          "winning"
        );
      }
      await this.db.execute(
        "UPDATE prize SET status = 'claimed' WHERE status = 'unclaim'"
      );

      await this.addPrizeMoney();

      return sharePerWinner;
    } catch (err) {
      console.error("<error> prize.getPotAmount", err);
      throw err;
    }
  }

  async getPrizeAmount() {
    try {
      const [result] = await this.db.execute("SELECT money FROM prize");

      // If no prize money exists, create a new prize entry
      if (result.length === 0) {
        await this.addPrizeMoney();
        return 1500; // Return the default prize amount
      }

      return result?.[0].money || 0;
    } catch (err) {
      console.error("<error> prize.getPotAmount", err);
      throw err;
    }
  }
}

export default Prize;
