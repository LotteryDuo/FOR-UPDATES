import { buyTicket } from "../../src/api/Ticket.js";
import { placeBet, getPrevBet } from "../../src/api/Bet.js";

const socketSetup = async (socket) => {
  // socket for Ticket 🎫
  socket.on("buy-ticket", async (data) => {
    const { ticketPrice, ticketQty, token } = data;

    const buy = await buyTicket(ticketPrice, ticketQty, token);

    // console.log(buy.data);

    const tickets = buy.data.data.tickets;
    const message = buy.data.message;
    const balance = buy.data.data.balance;

    // console.log(tickets, message, "lasndkasndlkasndklas");

    socket.emit("ticket-purchase-success", { tickets, balance, message });
  });

  // socket for PlaceBet 🪙

  socket.on("place-bet", async (data) => {
    const { bet_number, token } = data;

    const bet = await placeBet(bet_number, token);

    const numbers = bet.data.bet_numbers;
    const bet_id = bet.data.bet_id;
    const message = bet.data.message;

    socket.emit("place-bet-success", { numbers, bet_id, message });

    // socket for Getting Prev Bet 🪙🎫
    const bets = await getPrevBet(token);

    const bet_data = bets.data.data.result;

    bet_data.forEach((bet) => console.log(bet.bet_number));

    socket.emit("prev-bet", { bet_data });

    // console.log(
    //   bet_data.map((bet) => console.log(bet)),
    //   "kasndkasnd"
    // );
  });
};

export { socketSetup };
