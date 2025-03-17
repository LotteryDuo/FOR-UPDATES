import startDraw from "./startDraw.js";
import fetchDrawData from "../src/utils/fetchDrawData.js";

let countdownRunning = false;
let timeLeft = 60;

let number;

function startCountdown(io) {
  if (!countdownRunning) {
    countdownRunning = true;

    const countdownInterval = setInterval(async () => {
      if (timeLeft > 0) {
        timeLeft--;

        io.emit("countdown", timeLeft);
        // console.log(`Emitting countdown: ${timeLeft}`);`
      } else {
        // Reset countdown state
        startDraw();
        clearInterval(countdownInterval);
        countdownRunning = false;
        timeLeft = 60;
        // Restart countdown
        startCountdown(io);
      }
      const draw_data = await fetchDrawData();
      const numbers = draw_data.result.numbers;
      io.emit("draws", numbers);
    }, 1000);
  }
}

export { startCountdown };
