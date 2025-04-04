import { slaveDb, masterDb } from "../core/database.js";
import { encryptPassword } from "../utils/hash.js";

class User {
  constructor() {
    this.slave = slaveDb; // Slave DB for read operations
    this.master = masterDb; // Master DB for write operations
  }

  /**
   * Create user profile
   *
   * @param {String} username
   * @param {String} password
   * @param {String} fullname
   *
   * @returns {Object}
   * @throws MySQL2 error
   *
   */
  async create(username, email, password) {
    try {
      if ((!username, !email, !password)) return null;
      const [results] = await this.master.execute(
        "INSERT INTO users(username, email, PASSWORD) VALUES (?, ?, ?)",
        [username, email, encryptPassword(password)]
      );

      return results;
    } catch (err) {
      console.error("<error> user.create", err);
      throw err;
    }
  }

  /**
   * Verify if account exists
   *
   * @param {string} username
   * @param {string} password
   * @returns {Object}
   * @throws {Error}
   */
  async verify(username, password) {
    try {
      const [results] = await this.slave.execute(
        "SELECT user_id, username, fullname FROM users WHERE username = ? AND password = ?",
        [username, encryptPassword(password)]
      );

      return results?.[0];
    } catch (err) {
      console.error("<error> user.verify", err);
      throw err;
    }
  }

  /**
   * Get user's information
   *
   * @param {string} username
   * @returns {Object}
   * @throws {Error}
   *
   */
  async get(userId) {
    try {
      const [results] = await this.slave.execute(
        `SELECT u.user_id, u.username, u.balance, COALESCE(SUM(t.ticket_count), 0) AS ticket_count
       FROM users u
       LEFT JOIN tickets t ON u.user_id = t.user_id AND t.status = 'unused'
       WHERE u.user_id = ? 
       GROUP BY u.user_id, u.username, u.balance`,
        [userId]
      );

      if (results.length === 0) {
        throw new Error("User not found");
      }

      const user = results[0];

      return {
        user_id: user.user_id,
        username: user.username,
        balance: user.balance,
        tickets: user.ticket_count,
      };
    } catch (err) {
      console.error("<error> user.getInformation", err);
      throw err;
    }
  }

  async updateBalance(userId, amount, type) {
    try {
      await this.master.beginTransaction();

      const [users] = await this.slave.execute(
        "SELECT user_id, balance FROM users WHERE user_id = ? FOR UPDATE",
        [userId]
      );

      if (users.length === 0) throw new Error("User not found");

      const { balance } = users[0];

      if ((type === "withdraw" || type === "buy") && balance < amount)
        throw new Error("Insufficient funds.");

      if (type === "deposit" || type === "winning") {
        await this.master.execute(
          "UPDATE users SET balance = balance + ? WHERE user_id = ?",
          [amount, userId]
        );
      }

      if (type === "withdraw" || type === "buy") {
        await this.master.execute(
          "UPDATE users SET balance = balance - ? WHERE user_id = ?",
          [amount, userId]
        );
      }

      const [updatedUser] = await this.slave.execute(
        "SELECT user_id, balance FROM users WHERE user_id = ?",
        [userId]
      );

      await this.master.commit();

      return {
        success: true,
        message:
          type === "buy"
            ? "Ticket purchased successfully"
            : "Transaction successful",
        balance: updatedUser[0].balance,
        user_id: updatedUser[0].user_id,
        users: updatedUser[0],
      };
    } catch (err) {
      await this.master.rollback();
      console.error(`<error> users.${type}`, err);
      throw err;
    }
  }

  async getHistory(user_id) {
    try {
      const [result] = await this.slave.execute(
        `SELECT 
            b.bet_id, 
            b.user_id, 
            b.round_id, 
            b.bet_amount, 
            b.bet_number, 
            b.created_at, 
            CASE 
                WHEN d.bet_id IS NOT NULL THEN 'Won'
                ELSE 'Lost'
            END AS status
        FROM bet AS b
        LEFT JOIN draw_result AS d ON b.bet_id = d.bet_id
        WHERE b.user_id = ? 
        ORDER BY b.created_at DESC`,
        [user_id]
      );
      return result;
    } catch (err) {
      console.error("<error> user.getHistory", err);
      throw err;
    }
  }

  async getPrevBet(user_id, draw_id) {
    try {
      const result = await this.slave.execute(
        `SELECT 
            b.bet_id, 
            b.user_id, 
            b.draw_id, 
            b.bet_number, 
            b.created_at
        FROM bets AS b
        LEFT JOIN draws AS d ON b.draw_id = d.draw_id
        WHERE b.user_id = ? AND b.draw_id = ? 
        ORDER BY b.created_at DESC`,
        [user_id, draw_id]
      );

      return result[0];
    } catch (err) {
      console.error("<error> user.getPrevBet", err);
      throw err;
    }
  }

  async getLastWinHistory(user_id) {
    try {
      const [result] = await this.slave.execute(
        `SELECT 
            b.bet_id, 
            b.user_id, 
            b.bet_amount, 
            b.bet_number, 
            d.winning_no, 
            d.created_at AS win_date
        FROM bet AS b
        JOIN draw_result AS d ON b.bet_id = d.bet_id
        WHERE b.user_id = ?
        ORDER BY d.created_at DESC
        LIMIT 1;`,
        [user_id]
      );
    } catch (err) {
      console.error("<error> user.getLastWinHistory", err);
      throw err;
    }
  }

  async getUserHistory(user_id) {
    try {
      const [result] = await this.slave.execute(
        `SELECT 
            b.bet_id, 
            b.user_id, 
            b.round_id, 
            b.bet_amount, 
            b.bet_number, 
            b.created_at, 
            CASE 
                WHEN d.bet_id IS NOT NULL THEN 'Won'
                ELSE 'Lost'
            END AS status
        FROM bet AS b
        LEFT JOIN draw_result AS d ON b.bet_id = d.bet_id
        WHERE b.user_id = ? 
        ORDER BY b.created_at DESC`,
        [user_id]
      );
      return result;
    } catch (err) {
      console.error("<error> user.getUserHistory", err);
      throw err;
    }
  }
}

export default User;
