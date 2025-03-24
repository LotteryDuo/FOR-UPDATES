import startDraw from "./startDraw.js";
import fetchDrawData from "../src/utils/fetchDrawData.js";
import fetchWinners from "../src/utils/fetchWinners.js";

let countdownRunning = false;
let timeLeft = 20;

function startCountdown(io) {
  if (!countdownRunning) {
    countdownRunning = true;

    const countdownInterval = setInterval(async () => {
      if (timeLeft > 0) {
        timeLeft--;

        io.emit("countdown", timeLeft);
        // console.log(`Emitting countdown: ${timeLeft}`);`
      } else {
        clearInterval(countdownInterval);

        // Reset countdown state
        startDraw();
        fetchWinners();
        setTimeout(() => {
          countdownRunning = false;
          timeLeft = 20;
          startCountdown(io);
        }, 3000);
        countdownRunning = true;
      }
      const draw_data = await fetchDrawData();
      if (draw_data) {
        const numbers = draw_data.result.numbers;
        io.emit("draws", numbers);
      }
    }, 1000);
  }
}

export { startCountdown };
