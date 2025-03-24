import { Router } from "express";
import DrawResultController from "../../controllers/v1/drawController.js";

import authorization from "../../middlewares/authorization.js";
import authentication from "../../middlewares/authentication.js";

const drawRouter = new Router();
const draw = new DrawResultController();
drawRouter.use(authorization);

/**
 * Generate and store a new draw result
 * @method POST
 * path /v1/draw/
 */
drawRouter.post("/", draw.createDraw.bind(draw));
// drawRouter.get("/get-result", draw.getLatestResult.bind(draw));

/**
 * Get the latest draw result
 * @method GET
 * path /v1/draw/latest
 */
drawRouter.get("/latest", draw.getLatestDrawResult.bind(draw));

/**
 * Get the latest draw result
 * @method GET
 * path /v1/draw/winners
 */
drawRouter.get("/winners", draw.getWinningUsersByLatestDraw.bind(draw));

export default drawRouter;
