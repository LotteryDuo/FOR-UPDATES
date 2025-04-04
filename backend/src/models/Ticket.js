import { masterDb, slaveDb } from "../core/database.js";
import User from "./user.js";

class Ticket {
  constructor() {
    this.master = masterDb; // Master pool for write operations
    this.slave = slaveDb; // Slave pool for read operations
    this.user = new User();
  }

  // Helper function to get a connection from the pool
  async getConnection() {
    return await this.master.getConnection();
  }

  // Function to buy a ticket
  async buyTicket(userId, ticketPrice, ticketQuantity) {
    const conn = await this.getConnection(); // Get a connection from the pool
    try {
      await conn.beginTransaction(); // Start transaction

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

      const { tickets, balance } = await this.user.get(userId);

      await conn.commit(); // Commit transaction
      return {
        success: true,
        message: "Ticket purchased successfully",
        data: {
          qty: ticketQuantity,
          user_id: userId,
          balance: balance,
          tickets: tickets,
        },
      };
    } catch (err) {
      await conn.rollback(); // Rollback transaction on error
      console.error("<error> buyTicket:", err);
      throw err;
    } finally {
      conn.release(); // Release connection back to the pool
    }
  }

  // Function to get all tickets for a user
  async getAllUserTickets(userId) {
    const conn = await this.getConnection(); // Get a connection from the pool
    try {
      await conn.beginTransaction(); // Start transaction
      // Fetch tickets for the user here, for now let's assume the query is
      const tickets = await conn.execute(
        "SELECT * FROM tickets WHERE user_id = ?",
        [userId]
      );

      await conn.commit(); // Commit transaction
      return tickets;
    } catch (err) {
      await conn.rollback(); // Rollback transaction on error
      console.error("<error> getAllUserTickets:", err);
      throw err;
    } finally {
      conn.release(); // Release connection back to the pool
    }
  }

  // Function to get a user's ticket
  async getUserTicket(user_id) {
    const conn = await this.getConnection(); // Get a connection from the pool
    try {
      const [tickets] = await conn.execute(
        "SELECT ticket_id, ticket_count FROM tickets WHERE user_id = ? and status = 'unused' ORDER BY ticket_id ASC LIMIT 1",
        [user_id]
      );

      return tickets;
    } catch (err) {
      console.error("<error> getUserTicket:", err);
      throw err;
    } finally {
      conn.release(); // Release connection back to the pool
    }
  }
}

export default Ticket;
