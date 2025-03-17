import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import "dotenv/config.js";

import v1 from "./routes/v1/index.js";

// import "./core/database.js";
import morgan from "morgan";

const app = express(); // first layer server
const port = process.env.PORT || 1000;

app.use(morgan("combined"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/v1", cors(), v1);

app.listen(port, "0.0.0.0", () => {
  console.log(`App is running at port ${port}...`);
});
