import { connection } from "../core/database.js";
import { encryptPassword } from "../utils/hash.js";

class User {
  constructor() {
    this.db = connection;
  }

  /**
   * Buy Ticket for the user
   *
   * @param {String} username
   * @param {String} password
   * @param {String} fullname
   *
   * @returns {Object}
   * @throws MySQL2 error
   *
   */

  async buyTicket(username, qty, ticket_price = 20) {
    try {
      await connection.beginTransaction(); // Start transaction

      // Step 1: Get user's balance (LOCK for transaction safety)
      const [user] = await connection.execute(
        "SELECT user_id, balance FROM users WHERE username = ? FOR UPDATE",
        [username]
      );

      //check if user exists
      if (user.length === 0) throw new Error("User not found asdasdas");

      if (!username || !qty || qty <= 0)
        throw new Error("Invalid username or qty");

      const userBalance = user[0].balance;
      const totalCost = qty * ticket_price;

      // Step 2: Check if user has enough balance
      if (userBalance < totalCost) throw new Error("Insufficient balance");

      // Step 3: Deduct balance from user account
      await connection.execute(
        "UPDATE users SET balance = balance - ? WHERE user_id = ?",
        [totalCost, user[0].user_id]
      );

      // Step 4: Insert multiple tickets
      const values = [];
      for (let i = 0; i < qty; i++) {
        values.push([user[0].user_id]);
      }

      const placeholders = values.map(() => "(?, NOW(), 'unused')").join(", ");
      const queryValues = values.flat();

      const [results] = await connection.execute(
        `INSERT INTO tickets (user_id, purchased_at, status) VALUES ${placeholders}`,
        queryValues
      );

      // Step 5: Fetch updated user balance
      const [updatedUser] = await connection.execute(
        "SELECT balance FROM users WHERE user_id = ?",
        [user[0].user_id]
      );

      await connection.commit(); // Commit transaction if successful

      return {
        tickets: results.insertId,
        qty,
        balance: updatedUser[0].balance, // Updated user balance
      };
    } catch (err) {
      await connection.rollback();
      console.error("<error> lotto.buyTicket", err);
      throw err;
    }
  }

  async placeBet(username, numbers) {
    try {
      await connection.beginTransaction(); // Start transaction

      // Get the user ID
      const [user] = await connection.query(
        "SELECT user_id FROM users WHERE username = ?",
        [username]
      );
      if (user.length === 0) throw new Error("User not found.");
      const userId = user[0].user_id;

      // Get the latest open draw
      // const [draw] = await connection.query(
      //   "SELECT draw_id FROM draws WHERE status = 'open' ORDER BY draw_date DESC LIMIT 1"
      // );
      // if (draw.length === 0) throw new Error("No open draws available.");

      // const drawId = draw[0].draw_id;

      // // Check for an available unused ticket for the user
      const [ticket] = await connection.query(
        "SELECT ticket_id FROM tickets WHERE user_id = ? AND status = 'unused'",
        [userId]
      );
      if (ticket.length === 0) throw new Error("No available unused tickets.");

      const ticketId = ticket[0].ticket_id;

      // // Insert the bet with 'pending' status
      // const [betResult] = await connection.query(
      //   "INSERT INTO bets (user_id, draw_id, ticket_id, status, created_at) VALUES (?, ?, ?, 'pending', NOW())",
      //   [userId, drawId, ticketId]
      // );
      // const betId = betResult.insertId;

      // // Update the ticket status to 'used'
      // await connection.query(
      //   "UPDATE tickets SET status = 'used', ticket_number = ? WHERE ticket_id = ?",
      //   [numbers, ticketId]
      // );

      // await connection.commit(); // Commit transaction if successful

      return {
        message: "Bet placed successfully.",
        user_id: userId,
        ticket_id: ticket,

        // bet_id: betId,
        status: "pending",
      };
    } catch (err) {
      await connection.rollback(); // Rollback on error
      console.error("<error> lotto.placeBet", err);
      throw err;
    }
  }
}

export default User;
