import React, { useState, useEffect } from "react";
import { ChevronLeft, Wallet, User, Star, CodeSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import ButtonWithSound from "./ButtonWithSound";
import fetchAccountData from "../utils/fetchAccountData";

const socket = io("http://localhost:3000");

const getToken = () => sessionStorage.getItem("token");
const getUsername = () => sessionStorage.getItem("username");

const DisplayBet = () => {
  const [balance, setBalance] = useState(""); // Mock balance
  const [betAmount, setBetAmount] = useState("");
  const [bets, setBets] = useState([]);
  const [betResult, setBetResult] = useState(null);
  const navigator = useNavigate();

  const [accountData, setAccountData] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAccountData = async () => {
      const data = await fetchAccountData();
      if (data) {
        setAccountData(data);
      } else {
        setError("Failed to load account data.");
      }
    };

    loadAccountData();
  }, []);

  // Fetch bets in real-time
  useEffect(() => {
    socket.on("updateBets", (newBets) => {
      setBets(newBets);
    });

    return () => {
      socket.off("updateBets");
    };
  }, []);

  // Handle placing bet
  const handleBet = () => {
    if (!betAmount || betAmount <= 0) {
      alert("Enter a valid bet amount!");
      return;
    }
    if (betAmount > balance) {
      alert("Insufficient balance!");
      return;
    }

    const newBet = {
      id: Date.now(),
      username: getUsername() || "Guest",
      amount: parseFloat(betAmount),
      status: "Pending...",
    };

    setBets([...bets, newBet]);
    setBalance(balance - betAmount);
    setBetAmount("");

    // Emit event to backend
    socket.emit("placeBet", newBet);

    // Simulate bet result
    setTimeout(() => {
      const isWin = Math.random() > 0.5;
      const winnings = isWin ? newBet.amount * 2 : 0;
      setBalance((prev) => prev + winnings);

      setBets((prevBets) =>
        prevBets.map((bet) =>
          bet.id === newBet.id
            ? { ...bet, status: isWin ? "Won" : "Lost" }
            : bet
        )
      );

      setBetResult(isWin ? `You won ₱${winnings}!` : "You lost!");
    }, 2000);
  };

  return (
    <div
      className="flex flex-col items-center justify-center p-6 h-screen w-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('src/assets/images/background-image.png')",
      }}
    >
      {/* Back Button */}
      <ButtonWithSound
        onClick={() => navigator(-1)}
        className="flex items-center gap-2 text-white bg-gray-800 px-4 py-2 mb-4 rounded-lg hover:bg-gray-700 transition self-start"
      >
        <ChevronLeft className="w-5 h-5" />
        <span>Back</span>
      </ButtonWithSound>

      {/* User Info & Balance */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex items-center gap-4">
          <User className="w-10 h-10 text-blue-500" />
          <div>
            <h1 className="text-2xl font-bold">
              {accountData.username || "Guest"}
            </h1>
            <p className="text-gray-400">Balance: ₱{accountData.balance}</p>
          </div>
        </div>
      </div>

      {/* Bet Input */}
      <div className="bg-gray-800 p-6 mt-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold text-center mb-4">Place a Bet</h2>
        <input
          type="number"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
          placeholder="Enter amount (₱)"
          className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
        />
        <ButtonWithSound
          onClick={handleBet}
          className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 transition rounded-lg font-semibold"
        >
          <div>Bet Now</div>
        </ButtonWithSound>
      </div>

      {/* Bet Results */}
      {betResult && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg text-center">
          <p className="text-lg font-semibold">{betResult}</p>
        </div>
      )}

      {/* Bet History */}
      <div className="bg-gray-800 p-6 mt-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold text-center mb-4">Bet History</h2>
        <div className="max-h-40 overflow-y-auto">
          {bets.length === 0 ? (
            <p className="text-gray-400 text-center">No bets placed yet.</p>
          ) : (
            bets.map((bet) => (
              <div
                key={bet.id}
                className="flex justify-between items-center p-2 border-b border-gray-700"
              >
                <p>
                  {bet.username} bet ₱{bet.amount}
                </p>
                <span
                  className={`px-2 py-1 text-sm rounded-lg ${
                    bet.status === "Won"
                      ? "bg-green-500 text-white"
                      : bet.status === "Lost"
                      ? "bg-red-500 text-white"
                      : "bg-yellow-500 text-black"
                  }`}
                >
                  {bet.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplayBet;
