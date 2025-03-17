import Ticket from "../../models/Ticket.js";

class TicketController {
  constructor() {
    this.bet = new Ticket();
  }

  /**
   * Place a bet
   * @param {*} req - Contains user_id, ticket_price, and ticket_quantity
   * @param {*} res - Response with success or failure
   */
  async buyTicket(req, res) {
    try {
      const { ticketPrice, ticketQty } = req.body;
      const user_id = res.locals.user_id; // Assuming user ID is stored in locals after authentication

      if (!user_id) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthenticated user" });
      }

      if (!ticketPrice || ticketQty <= 0) {
        return res
          .status(400)
          .json({ success: false, message: "Missing ticket details" });
      }

      // Call buyTicket method in Ticket model
      const result = await this.bet.buyTicket(user_id, ticketPrice, ticketQty);

      return res.status(200).json(result);
    } catch (err) {
      console.error("<error> buyTicket:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  }
}

export default TicketController;
