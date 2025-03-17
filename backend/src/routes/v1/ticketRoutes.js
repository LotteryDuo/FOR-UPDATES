import { Router } from "express";
import TicketController from "../../controllers/v1/ticketController.js";

import authorization from "../../middlewares/authorization.js";
import authentication from "../../middlewares/authentication.js";

const ticketRouter = new Router();
const ticket = new TicketController();
ticketRouter.use(authentication);
ticketRouter.use(authorization);

/**
 * Place a ticket
 * @method POST
 * @path /ticket/
 */
ticketRouter.post("/buy", authentication, ticket.buyTicket.bind(ticket));

/**
 * Process ticket (Check winners, update pot)
 * @method POST
 * @path /ticket/process
 */
// ticketRouter.post("/process", authentication, ticket.processBets.bind(ticket));

export default ticketRouter;
