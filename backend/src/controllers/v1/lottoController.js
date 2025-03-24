import jwt from "jsonwebtoken";
import Lotto from "../../models/lotto.js";

class LottoControlller {
  constructor(io) {
    this.lotto = new Lotto();
    this.io = io;
  }

  /**
   * Buy ticket for the user
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {void}
   *
   */
  async buy_ticket(req, res) {
    try {
      const { qty } = req.body;
      const username = res.locals.username;

      if (!username || !qty || qty <= 0) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid input" });
      }
      const response = await this.lotto.buyTicket(username, qty);
      res.json({
        success: true,
        data: {
          tickets: response.tickets, // Array of ticket IDs
          qty: response.qty,
          balance: response.balance, // Corrected balance access
        },
      });

      res.end();
    } catch (err) {
      res.json({
        success: false,
        message: err.toString(),
      });
      res.end();
    }
  }

  async place_bet(req, res) {
    try {
      const { qty, numbers } = req.body;
      const username = res.locals.username;

      const numberPattern =
        /^((?:[1-9]|0[1-9]|[1-4][0-9])[\s,-]){5}(?:[1-9]|0[1-9]|[1-4][0-9])$/;

      // console.log("Placing bet", username, qty, numberPattern.test(numbers));

      const isAccepted = numberPattern.test(numbers);
      if (!username || !qty || qty <= 0 || !numbers || !isAccepted) {
        return res.status(400).json({
          success: false,
          message: "numbers: " + numbers + " Invalid input",
        });
      }
      const response = await this.lotto.placeBet(username, numbers);
      res.json({
        success: true,
        data: {
          number: response?.message, // Array of ticket IDs
          ticket: response?.ticket_id, // Array of ticket IDs
        },
      });

      res.end();
    } catch (err) {
      res.json({
        success: false,
        message: err.toString(),
      });
      res.end();
    }
  }

  // async generate_draw(req, res) {
  //   try {
  //     const draw = await this.lotto.generateDraw();
  //     res.json(draw);
  //   } catch (error) {
  //     res.status(400).json({ error: error.message });
  //   }
  // }
}

export default LottoControlller;
