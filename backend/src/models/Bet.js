import { connection } from "../core/database.js";
import Ticket from "./Ticket.js";
import Draw from "./Draw.js";

class Bet {
  constructor() {
    this.db = connection;
    this.tickets = new Ticket();
    this.draws = new Draw();
  }

  async checkDuplicatedBet(user_id, draw_id, bet_number) {
    const [betRecords] = await this.db.execute(
      "SELECT bet_number FROM bets WHERE user_id = ? AND draw_id = ?",
      [user_id, draw_id]
    );

    const recentBetNum = betRecords.map((bet) => bet.bet_number);

    if (recentBetNum.includes(bet_number)) {
      throw new Error(
        `You have already placed a bet with the number ${bet_number} in this draw.`
      );
    }
  }

  /**
   * Place a new bet
   * @param {number} user_id - The ID of the user placing the bet
   * @param {number} bet_amount - The amount being bet
   * @param {string} bet_number - The numbers the user is betting on (formatted as "XX-XX-XX-XX-XX-XX")
   * @param {number} round_id - The ID of the current round
   */
  async placeBet(user_id, bet_number) {
    try {
      const currentDrawId = await this.draws.getLatestDrawId();

      await this.checkDuplicatedBet(user_id, currentDrawId, bet_number);

      const [betCount] = await this.db.execute(
        "SELECT COUNT(*) as count FROM bets WHERE user_id = ? AND draw_id = ?",
        [user_id, currentDrawId]
      );

      // 1️⃣ Get the user's available ticket
      //

      const tickets = await this.tickets.getUserTicket(user_id);

      if (tickets.length === 0 || tickets[0].ticket_count < 1) {
        throw new Error("Not enough tickets to place a bet.");
      }

      const ticketId = tickets[0].ticket_id;
      const ticketCount = tickets[0].ticket_count;

      if (betCount[0].count >= 10)
        throw new Error(
          "You reached the maximum bet today.\n wait until the next Draw start."
        );

      // Insert new bet with round_id
      const [res] = await this.db.execute(
        "INSERT INTO bets (user_id, draw_id, ticket_id, bet_number, status, created_at) VALUES (?, ?, ?, ?, 'pending', NOW())",
        [user_id, currentDrawId, ticketId, bet_number]
      );

      // 4️⃣ Deduct the ticket count else delete it
      if (ticketCount > 1) {
        // UPDATE WHEN MORE THAN 1 TICKET
        await this.db.execute(
          "UPDATE tickets SET ticket_count = ticket_count - 1 WHERE ticket_id = ?",
          [ticketId]
        );
      } else {
        // DELETE WHEN TICKET IS 0
        await this.db.execute(
          "UPDATE tickets SET status = 'used' WHERE ticket_id = ?",
          [ticketId]
        );
      }

      return {
        bet_id: res.insertId,
        draw_id: currentDrawId,
        numbers: bet_number,
      };
    } catch (err) {
      console.error("<error> bet.placeBet", err);
      throw err;
    }
  }

  /**
   * Get all bets for a specific round
   * @param {number} round_id - The ID of the round
   */
  async getBetsByDraw(draw_id) {
    try {
      const [bets] = await this.db.execute(
        "SELECT * FROM bets WHERE draw_id = ?",
        [draw_id]
      );
      return bets;
    } catch (err) {
      console.error("<error> bets.getBetsByDraw", err);
      throw err;
    }
  }

  /**
   * Get all bets for a user (without filtering by round)
   * @param {number} user_id - The ID of the user
   */
  async getUserBets(user_id) {
    try {
      const [bets] = await this.db.execute(
        "SELECT * FROM bets WHERE user_id = ?",
        [user_id]
      );
      return bets;
    } catch (err) {
      console.error("<error> bet.getUserBets", err);
      throw err;
    }
  }

  async getUserByDraws(user_id) {
    try {
      const currentDrawId = await this.draws.getLatestDrawId();
      const [bets] = await this.db.execute(
        "SELECT * FROM bets WHERE user_id = ? and draw_id = ?",
        [user_id, currentDrawId]
      );
      return bets ? bets : "No Bettors Found.";
    } catch (err) {
      console.error("<error> bet.getUserByDraws", err);
      throw err;
    }
  }
}

export default Bet;
