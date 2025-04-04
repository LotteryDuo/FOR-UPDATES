const subscriberSocket = async (socket, hostSocket) => {
  socket.emit("welcome", "Welcome to the subscriber!");

  hostSocket.on("jackpot-add", (potMoney) => {
    console.log(potMoney.data.money);
    socket.emit("jackpot-add", potMoney);
  });

  // Subscriber Countdown ⏳
  hostSocket.on("countdown", (timeLeft) => {
    socket.emit("countdown", timeLeft);
  });

  // Subscriber Draw 🎲
  hostSocket.on("draws", (numbers) => {
    socket.emit("draws", numbers); // Emit draw numbers to subscriber
  });

  // Subscriber Winners 🏆
  hostSocket.on("winners", (winners) => {
    socket.emit("winners", winners); // Emit winners to subscriber
  });

  hostSocket.on("lossers", (lossers) => {
    socket.emit("lossers", lossers); // Emit winners to subscriber
  });

  // Subscriber Deposit 🏧
  socket.on("deposit", async (data) => {
    console.log("Received deposit from SERVER SUBSCRIBER event:", data);
    hostSocket.emit("deposit", data);
  });
  hostSocket.on("deposit-success", (message) => {
    socket.emit("deposit-success", message);
  });

  // Subscriber Withdraw 💸
  socket.on("withdraw", async (data) => {
    console.log("Received withdraw from SERVER SUBSCRIBER event:", data);
    hostSocket.emit("withdraw", data);
  });
  hostSocket.on("withdraw-success", (message) => {
    socket.emit("withdraw-success", message);
  });

  // Subscriber BuyTicket 🎟️
  socket.on("buy-ticket", (data) => {
    console.log("Received buy-ticket from SERVER SUBSCRIBER event:", data);
    hostSocket.emit("buy-ticket", data);
  });
  hostSocket.on("ticket-purchase-success", (data) => {
    socket.emit("ticket-purchase-success", data);
  });

  // Subscriber PlaceBet 🪙
  socket.on("place-bet", async (data) => {
    console.log("Received place-bet from SERVER SUBSCRIBER event:", data);
    hostSocket.emit("place-bet", data);
  });
  hostSocket.on("place-bet-success", (data) => {
    socket.emit("place-bet-success", data);
  });

  // Subscriber Prev-bet🎲
  socket.on("prev-bet", async (data) => {
    console.log("Received prev-bet from SERVER SUBSCRIBER event:", data);
    hostSocket.emit("prev-bet", data);
  });
  hostSocket.on("prev-bet", (data) => {
    socket.emit("prev-bet", data);
  });

  socket.on("userDisconnect", (data) => {
    console.log(`Client disconnected from subscriber ${PORT}: ${socket.id}`);
    hostSocket.emit("userDisconnect", data);
  });
};

export default subscriberSocket;
