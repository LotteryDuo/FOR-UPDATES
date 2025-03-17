import { connection } from "../core/database.js";

class Prize {
  constructor() {
    this.db = connection;
  }

  async addPrizeMoney(money) {
    try {
      const [result] = await this.db.execute(
        "INSERT INTO prize (money) VALUES (1500)"
      );

      console.log(result);

      return result[0];
    } catch (err) {
      console.error("<error> Prize.addPrizeMoney", err);
      throw err;
    }
  }

  async getPrizeAmount() {
    try {
      const [result] = await this.db.execute("SELECT money FROM prize");

      if (result.length === 0) await this.rollOverPrize();
      return result?.[0].money || 0;
    } catch (err) {
      console.error("<error> pot.getPotAmount", err);
      throw err;
    }
  }

  async rollOverPrize() {
    try {
      // 1️⃣ Check if prize money exists
      const [prizeResult] = await this.db.execute(
        "SELECT money FROM prize LIMIT 1"
      );

      if (prizeResult.length === 0) {
        // 2️⃣ If no prize exists, initialize it with 1500
        await this.db.execute("INSERT INTO prize (money) VALUES (1500)");
        console.log("Prize initialized to 1500.");
      } else {
        await this.db.execute("UPDATE prize SET money = 1500");
      }

      return { success: true, message: "Prize money updated successfully." };
    } catch (err) {
      console.error("<error> Prize.rollOverPrize", err);
      throw err;
    }
  }
}

export default Prize;
