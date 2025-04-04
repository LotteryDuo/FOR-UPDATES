import { buyTicket } from "../api/Ticket.js";
import { placeBet, getPrevBet } from "../api/Bet.js";
import { updateBalance } from "../api/Account.js";
import { getPrizeAmount, updatePrizeAmount } from "../api/Prize.js";

const publisherSocket = async (socket) => {
  // Socket for Publish Deposit 🏧
  socket.on("deposit", async (data) => {
    console.log("Received deposit from SERVER PUBLISHER event:", data);
    const { type, amount, token } = data;
    const deposit = await updateBalance(type, amount, token);
    const message = deposit.data.message;
    socket.emit("deposit-success", {
      message,
      balance: deposit.data.balance,
    });
  });

  // Socket for Publish Withdraw 💸
  socket.on("withdraw", async (data) => {
    console.log("Received withdraw from SERVER PUBLISHER event:", data);
    const { type, amount, token } = data;
    const withdraw = await updateBalance(type, amount, token);
    const message = withdraw.data.message;
    socket.emit("withdraw-success", {
      message,
      balance: withdraw.data.balance,
    });
  });

  // Socket for Publish BuyTicket 🎟️
  socket.on("buy-ticket", async (data) => {
    console.log("Received buy-ticket from SERVER PUBLISHER  event:", data);
    const { ticketPrice, ticketQty, token } = data;
    const buy = await buyTicket(ticketPrice, ticketQty, token);
    const tickets = buy.data.data.tickets;
    const message = buy.data.message;
    const balance = buy.data.data.balance;
    socket.emit("ticket-purchase-success", { tickets, balance, message });
  });

  // Socket for Publish Draw 🎲
  socket.on("place-bet", async (data) => {
    console.log("Received place-bet from SERVER PUBLISHER event:", data);

    const { bet_number, token } = data;
    const bet = await placeBet(bet_number, token);
    const numbers = bet.data.bet_numbers;
    const bet_id = bet.data.bet_id;
    const message = bet.data.message;
    socket.emit("place-bet-success", { numbers, bet_id, message });

    const potMoney = await updatePrizeAmount(token, 20);
    const newPotMoney = potMoney.data.data.money;
    const updateMessage = potMoney.data.message;

    socket.emit("jackpot-add", { newPotMoney, updateMessage });
  });

  // Socket for Publish Prev-bet 🎲
  socket.on("prev-bet", async (data) => {
    console.log("Received prev-bet from SERVER PUBLISHER event:", data);
    const { token } = data;
    const bets = await getPrevBet(token);
    const bet_data = bets.data.data.result;
    bet_data.forEach((bet) => console.log(bet.bet_number));
    socket.emit("prev-bet", { bet_data });
  });

  socket.on("userDisconnet", (data) => {
    console.log(
      `🔌 Client disconnected from MAIN SERVER (3000): ${socket.id}, userID: ${data}`
    );
    delete socket.id;
  });

  socket.on("disconnect", () => {
    delete socket.id;
    console.log(`🔌 Client disconnected from MAIN SERVER (3000): ${socket.id}`);
  });
};

export default publisherSocket;
