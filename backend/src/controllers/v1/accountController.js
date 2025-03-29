import jwt from "jsonwebtoken";
import User from "../../models/user.js";
import Draw from "../../models/Draw.js";

class AccountController {
  constructor(io) {
    this.user = new User();
    this.draw = new Draw();
    this.io = io;
  }

  /**
   * Create account controller
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {void}
   *
   */
  async create(req, res) {
    const { username, email, PASSWORD } = req.body || {};

    try {
      // @TODO: verify if username already exists
      console.log("Creating user", username, email);
      const response = await this.user.create(username, email, PASSWORD);

      res.json({
        success: true,
        data: {
          recordIndex: response?.insertId,
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

  /**
   *  Login Controller
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {void}
   */
  async login(req, res) {
    try {
      const { username, PASSWORD } = req.body || {};

      const result = await this.user.verify(username, PASSWORD);

      console.log(result.user_id);

      if (!result?.user_id) {
        return res.json({
          success: false,
          message: "Invalid username or password",
        });
      }

      res.json({
        success: true,
        message: "Sucessfully login to your account 🎉",
        data: {
          user_id: result.user_id,
          username: result.username,
          token: jwt.sign(
            { username: username, user_id: result?.user_id },
            process.env.API_SECRET_KEY,
            {
              expiresIn: "1d",
            }
          ),
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

  /**
   * Get user profile
   *
   * @todo Update this to pull from database
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {void}
   *
   */
  async profile(req, res) {
    try {
      const infos = await this.user.get(res.locals.user_id);

      console.log(`total tickets: ${infos.tickets}`);
      console.log(`balance: ${infos.balance}`);
      console.log(`user id : ${infos.user_id}`);

      res.json({
        success: true,
        data: {
          user_id: infos.user_id, // ✅ Use `infos.user_id`
          username: infos.username,
          balance: infos.balance,
          tickets: infos.tickets,
        },
      });
      res.end();
    } catch (err) {
      res.json({
        success: false,
        message: err.toString(),
      });
    }
  }

  async getPrevBet(req, res) {
    try {
      const currentDrawId = await this.draw.getLatestDrawId();
      const prevBet = await this.user.getPrevBet(
        res.locals.user_id,
        currentDrawId
      );

      if (!prevBet) res.json({ success: false, data: [] });

      // Log bet numbers properly
      prevBet.forEach((bet) => console.log(bet.bet_number));

      return res.json({
        success: true,
        data: {
          result: prevBet,
        }, // Send the array of bets
      });
      res.end();
    } catch (err) {
      res.json({
        success: false,
        message: err.toString(),
      });
    }
  }

  /**
   * POST amount to deposit or withdraw
   *
   * @todo Update this to pull from database
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {void}
   *
   */

  async updateBalance(req, res) {
    try {
      const { type } = req.body || {};
      const amount = req.body?.amount || req.params?.amount;

      if (!amount || isNaN(amount)) {
        return res.json({
          success: false,
          message: "Invalid amount",
        });
      }

      console.log(res.locals.user_id);

      const response = await this.user.updateBalance(
        res.locals.user_id,
        amount,
        type
      );

      res.json({
        success: true,
        data: {
          message:
            type === "deposit" ? "Deposit successful" : "Withdrawal successful",
          amount: req.body.amount,
          balance: response?.balance,

          insertId: response?.user_id,
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
}

export default AccountController;
