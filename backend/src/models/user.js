import { connection } from "../core/database.js";
import { encryptPassword } from "../utils/hash.js";

class User {
  constructor() {
    this.db = connection;
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
      const [results] = await connection.execute(
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
      const [results] = await connection.execute(
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
      const [results] = await connection.execute(
        `SELECT u.user_id, u.username, u.balance, COALESCE(SUM(t.ticket_count), 0) AS ticket_count
       FROM users u
       LEFT JOIN tickets t ON u.user_id = t.user_id AND t.status = 'unused'  -- ✅ Move condition to JOIN
       WHERE u.user_id = ? 
       GROUP BY u.user_id, u.username, u.balance`,
        [userId]
      );

      if (results.length === 0) {
        throw new Error("User not found");
      }

      const user = results[0]; // ✅ Get first element of array

      console.log(user.username);

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

  /**
   * POST amount to deposit or withdraw
   *
   * @param {string} username
   * @returns {Object}
   * @throws {Error}
   *
   */

  async updateBalance(userId, amount, type) {
    try {
      await connection.beginTransaction();

      const [user] = await connection.execute(
        "SELECT user_id, balance FROM users WHERE user_id = ? FOR UPDATE",
        [userId]
      );

      console.log(userId);

      //check if user exists
      if (user.length === 0) throw new Error("User not found");

      const { user_id, balance } = user[0];

      console.log(userId, balance);

      if ((type === "withdraw" || type === "buy") && balance < amount)
        throw new Error("Insufficient funds.");

      // Update balance based on transaction type
      const balanceQuery =
        type === "deposit"
          ? "UPDATE users SET balance = balance + ? WHERE user_id = ?"
          : "UPDATE users SET balance = balance - ? WHERE user_id = ?";

      const [balanceq] = await connection.execute(balanceQuery, [
        amount,
        userId,
      ]);

      console.log(balanceq, userId);

      // Insert transaction record
      await connection.execute(
        "INSERT INTO transactions (user_id, TYPE, amount, transaction_date) VALUES (?, ?, ?, NOW())",
        [userId, type, amount]
      );

      // If type is "buy", add the corresponding number of tickets
      if (type === "buy") {
        await connection.execute(
          "UPDATE users SET balance = balance - ? WHERE user_id = ?",
          [amount, userId]
        );
      }

      const [updatedUser] = await connection.execute(
        "SELECT user_id, balance FROM users WHERE user_id = ?",
        [userId]
      );

      console.log(updatedUser[0]);

      await connection.commit();

      return {
        success: true,
        message:
          type === "buy"
            ? "Ticket purchased successfully"
            : "Transaction successful",
        user: updatedUser[0],
      };
    } catch (err) {
      await connection.rollback();
      console.error(`<error> user.${type}`, err);
      throw err;
    }
  }

  async getHistory(user_id) {
    try {
      const [result] = await connection.execute(
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
        ORDER BY b.created_at DESC;`,
        [user_id]
      );
      return result;
    } catch (err) {
      console.error("<error> user.getHistory", err);
      throw err;
    }
  }

  async getLastWinHistory(user_id) {
    try {
      const [result] = await connection.execute(
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
}

export default User;
