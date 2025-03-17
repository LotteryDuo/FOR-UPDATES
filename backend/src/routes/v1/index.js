import { Router } from "express";
import accountRouter from "./accountRoutes.js";
import prizeRouter from "./prizeRoutes.js";
import betRouter from "./betRoutes.js";
import drawRouter from "./drawRoutes.js";
import homeRouter from "./homeRoutes.js";
import ticketRouter from "./ticketRoutes.js";

const v1 = new Router();

// path /v1/ticket/
v1.use("/ticket", ticketRouter);

// path /v1/draw/
v1.use("/draw", drawRouter);

// path /v1/bet/
v1.use("/bet", betRouter);

// path /v1/prize/
v1.use("/prize", prizeRouter);

// path /v1/account
v1.use("/account", accountRouter); // ✅ Pass io
v1.use("/", homeRouter);

export default v1;
