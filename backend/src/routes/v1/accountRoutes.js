import { Router } from "express";

import AccountController from "../../controllers/v1/accountController.js";
import authorization from "../../middlewares/authorization.js";
import authentication from "../../middlewares/authentication.js";

const accountRouter = Router();
const account = new AccountController(); // ❌ Removed io

// Ensure that all endpoints implement authorization
accountRouter.use(authorization);

accountRouter.post("/login", account.login.bind(account));
accountRouter.post("/", account.create.bind(account));
accountRouter.get("/", authentication, account.profile.bind(account));

accountRouter.get(
  "/prev-bet",
  authentication,
  account.getPrevBet.bind(account)
);

accountRouter.post(
  "/deposit/:amount",
  authentication,
  account.updateBalance.bind(account)
);
accountRouter.post(
  "/withdraw/:amount",
  authentication,
  account.updateBalance.bind(account)
);

export default accountRouter;
