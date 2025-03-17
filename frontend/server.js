/* eslint no-restricted-globals: ["error", "event"] */
/* global process */

import fs from "node:fs";
import path from "node:path";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import express from "express";
import { createServer as createViteServer } from "vite";
import { Server } from "socket.io";

import { startCountdown } from "./public/startCountdown.js";

import fethcDrawData from "./src/utils/fetchDrawData.js";

const IS_PRODUCTION = process.env.ENV === "production";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

async function createCustomServer() {
  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*", // ✅ Allow frontend URLs
      methods: ["GET", "POST"],
    },
  });

  let vite;

  if (IS_PRODUCTION) {
    app.use(express.static(path.resolve(__dirname, "./dist/client/")));
  } else {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
      build: {
        ssr: true,
        ssrEmitAssets: true,
      },
    });

    app.use(vite.middlewares);
  }

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const index = fs.readFileSync(
        path.resolve(
          __dirname,
          IS_PRODUCTION ? "./dist/client/index.html" : "./index.html"
        ),
        "utf-8"
      );

      let render, template;

      if (IS_PRODUCTION) {
        template = index;
        render = import("./dist/server/server-entry.js").then(
          (mod) => mod.render
        );
      } else {
        template = await vite.transformIndexHtml(url, index);
        render = (await vite.ssrLoadModule("/src/server-entry.jsx")).render;
      }

      const context = {};
      const appHtml = render(url, context);

      const html = template.replace("<!-- ssr -->", appHtml);

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      next(e);
    }
  });

  io.on("connection", async (socket) => {
    console.log("user connected");
    startCountdown(io);

    const nums = await fethcDrawData();

    // console.log(nums);

    socket.emit("draws", nums.result.numbers);

    socket.emit("welcome", "A message from the server");
  });

  console.log("console", PORT);
  server.listen(PORT);
}

createCustomServer();
