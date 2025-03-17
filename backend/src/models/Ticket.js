import { connection } from "../core/database.js";
import User from "./user.js";

class Ticket {
  constructor() {
    this.db = connection;
    this.user = new User();
  }

  async buyTicket(userId, ticketPrice, ticketQuantity) {
    const conn = this.db;
    try {
      await conn.beginTransaction();

      // Step 1: Check User's Balance
      const user = await this.user.get(userId);

      if (user.length === 0) throw new Error("User not found");

      const userBalance = user?.balance;
      const totalCost = ticketPrice * ticketQuantity;

      if (userBalance < totalCost) {
        throw new Error("Insufficient balance");
      }

      // Step 2: Deduct Balance
      await this.user.updateBalance(userId, totalCost, "buy");

      // Step 3: Insert or Update Ticket Count
      await conn.execute(
        `INSERT INTO tickets (user_id, ticket_count) 
         VALUES (?, ?) 
         ON DUPLICATE KEY UPDATE ticket_count = ticket_count + ?`,
        [userId, ticketQuantity, ticketQuantity]
      );

      await conn.commit();
      return {
        success: true,
        message: "Ticket purchased successfully",
        data: {
          qty: ticketQuantity,
          user_id: userId,
        },
      };
    } catch (err) {
      await conn.rollback();
      console.error("<error> buyTicket:", err);
      throw err;
    }
  }

  async getAllUserTickets(usesrId) {
    const conn = this.db;
    try {
      await conn.beginTransaction();
    } catch (err) {
      await conn.rollback();
      console.error("<error> buyTicket:", err);
      throw err;
    }
  }

  async getUserTicket(user_id) {
    try {
      const [tickets] = await this.db.execute(
        "SELECT ticket_id, ticket_count FROM tickets WHERE user_id = ? and status = 'unused' ORDER BY ticket_id ASC LIMIT 1",
        [user_id]
      );

      return tickets;
    } catch (err) {
      console.error("<error> bet.getUserTicket", err);
      throw err;
    }
  }
}

export default Ticket;
