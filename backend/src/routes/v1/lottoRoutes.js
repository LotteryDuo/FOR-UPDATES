import { Router } from "express";

import LottoController from "../../controllers/v1/lottoController.js";
import authorization from "../../middlewares/authorization.js";
import authentication from "../../middlewares/authentication.js";

export default function createLottoRouter(io) {
  // GET /lotto/bet/123
  // POST /lotto/bet/123
  // DELETE /lotto/bet/123
  const lottoRouter = Router();
  const lotto = new LottoController(io); // ✅ Pass io to controller

  lottoRouter.use(authorization);

  /**
   * BETTING ENDPOINTS
   */
  lottoRouter.post("/tickets", authentication, lotto.buy_ticket.bind(lotto)); // ✅ Buy ticket
  lottoRouter.post("/place-bet", authentication, lotto.place_bet.bind(lotto)); // ✅ Place bet
  // lottoRouter.get(
  //   "/tickets/:ticket_id",
  //   authentication,
  //   lotto.get_ticket_info.bind(lotto) // ✅ Get details of a specific ticket who made the bet
  // );
  // lottoRouter.get(
  //   "/tickets/user/:user_id",
  //   authentication,
  //   lotto.get_bet.bind(lotto) // ✅ Get all bets of a specific user
  // );
  // lottoRouter.delete(
  //   "/tickets/:ticket_id",
  //   authentication,
  //   lotto.cancel_bet.bind(lotto) // ✅ Cancel a bet
  // );

  /**
   * DRAW & RESULT ENDPOINTS
   */

  // lottoRouter.post("/draws", authentication, lotto.generate_draw.bind(lotto)); // ✅ Generate new Draw
  // lottoRouter.get("/draws", authentication, lotto.get_draws.bind(lotto)); // ✅ Get latest draw
  // lottoRouter.get(
  //   "/results",
  //   authentication,
  //   lotto.ger_all_results.bind(lotto)
  // ); // ✅ Get all draw results
  // lottoRouter.get(
  //   "/results/:draw_id",
  //   authentication,
  //   lotto.get_results.bind(lotto)
  // ); // ✅ Get results of a specific draw results

  /**
   * WINNERS & PAYOUT ENDPOINTS
   */

  // lottoRouter.get("/winners", authentication, lotto.get_winners.bind(lotto)); // ✅ Get all winners
  // lottoRouter.get(
  //   "/winners/:draw_id",
  //   authentication,
  //   lotto.get_winners.bind(lotto)
  // ); // ✅ Get winners of a specific draw
  // lottoRouter.get(
  //   "/claim-prize",
  //   authentication,
  //   lotto.get_winners.bind(lotto)
  // ); // ✅ Claim prize

  return lottoRouter;
}
