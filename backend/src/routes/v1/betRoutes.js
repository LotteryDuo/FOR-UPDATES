import { Router } from "express";
import BetController from "../../controllers/v1/bettingController.js";

import authorization from "../../middlewares/authorization.js";
import authentication from "../../middlewares/authentication.js";

const betRouter = new Router();
const bet = new BetController();
betRouter.use(authentication);
betRouter.use(authorization);

/**
 * Place a bet
 * @method POST
 * @path /bets/
 */
betRouter.post("/", authentication, bet.placeBet.bind(bet));

/**
 * @method GET
 * @path /bets/bettors
 */
betRouter.get("/bettors", authentication, bet.getBettors.bind(bet));

export default betRouter;
