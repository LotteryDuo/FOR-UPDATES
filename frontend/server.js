/* eslint no-restricted-globals: ["error", "event"] */
/* global process */

import fs from "node:fs";
import path from "node:path";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import express from "express";
import { createServer as createViteServer } from "vite";
import { Server } from "socket.io";
import { io as ClientIo } from "socket.io-client";

import {
  startDraw,
  fetchDrawData,
  fetchUserBetStatusByDraw,
} from "./src/api/Draw.js";
import publisherSocket from "./src/socket/publisherSocket.js";
import subscriberSocket from "./src/socket/subscriberSocket.js";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const IS_PRODUCTION = process.env.ENV === "production";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function createCustomServer() {
  const app = express();
  const server = createServer(app);
  const io = new Server(server);

  let vite;

  if (IS_PRODUCTION) {
    app.use(
      express.static(path.resolve(__dirname, "./dist/client/"), {
        index: false,
      })
    );
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
        render = await import("./dist/server/server-entry.js").then(
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

  server.on("request", () =>
    console.log(
      `Request is received by ${process.env.APPNAME || "UNKNOWN"} (${PORT})`
    )
  );

  if (PORT === 3000) {
    // Main server logic (Publisher)
    app.get("/", (req, res) => {
      console.log(
        `Request received on port ${process.env.PORT || 3000} ${
          process.env.APPNAME
        }`
      );
      res.send("Hello World!");
    });

    console.log("🚀 Starting MAIN SERVER at PORT 3000");

    let countdownRunning = false;
    let timeLeft = 20;

    function startCountdown() {
      if (!countdownRunning) {
        countdownRunning = true;

        const countdownInterval = setInterval(async () => {
          if (timeLeft > 0) {
            timeLeft--;

            io.emit("countdown", timeLeft); // Emit to all connected clients
          } else {
            clearInterval(countdownInterval);

            // await startDraw();

            const winners = await fetchUserBetStatusByDraw("won");
            const lossers = await fetchUserBetStatusByDraw("lost");

            io.emit("winners", { winners });
            io.emit("lossers", { lossers });

            setTimeout(() => {
              countdownRunning = false;
              timeLeft = 20;
              startCountdown();
            }, 3000);
            countdownRunning = true;
          }

          // const draw_data = await fetchDrawData();
          // if (draw_data) {
          //   const numbers = draw_data.data.result.numbers;
          //   io.emit("draws", numbers); // Example draw numbers
          // }
        }, 1000);
      }
    }

    // Socket connection for the main server 📢
    io.on("connection", (socket) => {
      console.log(`🔗 Client connected to MAIN SERVER (3000): ${socket.id}`);
      socket.emit("welcome", "Welcome to the main server!");

      // startCountdown();
      publisherSocket(socket);
    });

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running at MASTER PORT http://localhost:${PORT}`);
    });
  } else {
    let isPublisherConnected = false;
    const hostSocket = ClientIo("http://localhost:3000"); // Connect to the main server

    hostSocket.on("connect", () => {
      console.log(`✅ Subscriber (${PORT}) connected to Publisher (3000)`);
      isPublisherConnected = true;
      io.emit("maintenance_mode", false);
    });

    hostSocket.on("disconnect", () => {
      console.log(`⚠️ Publisher (3000) disconnected! Stopping data emission.`);
      isPublisherConnected = false;
      io.emit("maintenance_mode", true);
    });

    io.on("connection", (socket) => {
      console.log(`Client connected to Subscriber (${PORT}): ${socket.id}`);

      if (!isPublisherConnected) {
        socket.emit("maintenance_mode", true);
      }
      subscriberSocket(socket, hostSocket);
    });

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running at CLIENT PORT http://localhost:${PORT}`);
    });
  }
}

createCustomServer();
