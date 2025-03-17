import { Router } from "express";
import PrizeController from "../../controllers/v1/prizeController.js";

import authorization from "../../middlewares/authorization.js";
import authentication from "../../middlewares/authentication.js";

const prizeRouter = new Router();
const prize = new PrizeController();
prizeRouter.use(authorization);

/**
 * Get the current prize amount
 * @method GET
 * @path /v1/prize/
 */
prizeRouter.get("/", prize.getPrize.bind(prize));

/**
 * Roll over the prize if there is no winner
 * @method PATCH
 * @path /v1/prize/rollover
 */
prizeRouter.patch("/rollover", authentication, prize.rollOverPrize.bind(prize));

export default prizeRouter;
