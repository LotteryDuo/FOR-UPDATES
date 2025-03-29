import React, { useState, useEffect, useRef, use } from "react";
import useSocket from "../hooks/useSocket.js";

import Input from "./Input"; // Importing the Input component
import { styled } from "styled-components";

import { Wallet, User, Star, CodeSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

import backgroundMusic from "../assets/sounds/background-music.mp3";
import ButtonWithSound from "./ButtonWithSound";

import { io } from "socket.io-client";
import { fetchAccountData, fetchPrevBet } from "../api/Account.js";

import CountDown from "./CountDown";

import fetchWinners from "../utils/fetchWinners.js";

import WinningPopup from "./WinningPopUp.jsx";
import LossingPopUp from "./LossingPopUp.jsx";

const getToken = () => localStorage.getItem("token");

const getUsername = () => localStorage.getItem("username");

const getUserId = () => localStorage.getItem("user_id");

const DisplayHome = () => {
  const { isConnected, socket } = useSocket();
  const [ticket, setTicket] = useState(0);
  const [balance, setBalance] = useState(0);
  const navigator = useNavigate();
  const [accountBets, setAccountBets] = useState([]);
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [lottoInput, setLottoInput] = useState("");
  const [hasPlacedBet, setPlaceBet] = useState(false);
  const [popupTopUp, setPopUpTopUp] = useState(false);
  const [popupWithdraw, setPopUpWithdraw] = useState(false);

  const [userInDraw, setUserInDraw] = useState(false);
  const [showWinning, setShowWinning] = useState(false);
  const [showLossing, setShowLossing] = useState(false);

  const [withdrawInput, setWithdrawInput] = useState("");

  const [users, setUsers] = useState([]);

  const [timeLeft, setTimeLeft] = useState(null);

  const [getnumbers, setNumbers] = useState([
    "--",
    "--",
    "--",
    "--",
    "--",
    "--",
  ]);

  useEffect(() => {
    if (showWinning || showLossing) {
      // ✅ Hide popup after 3 seconds
      const timer = setTimeout(() => {
        setShowWinning(false);
        setShowLossing(false);
      }, 3000);

      return () => clearTimeout(timer); // ✅ Cleanup timer on unmount
    }
  }, [showWinning, showLossing]);

  // useEffect(() => {
  //   if (!isConnected) return;

  //   const prevBet = async () => {
  //     const token = getToken();
  //     const bets = await fetchPrevBet(token);
  //     if (bets.length > 0) {
  //       setAccountBets(bets);
  //       setPlaceBet(true);
  //     } else {
  //       console.log("No bets found.");
  //     }
  //   };
  //   prevBet();
  // }, [isConnected, socket]);

  // useEffect(() => {
  //   if (!isConnected) return;

  //   socket.on("draws", async (data) => {
  //     if (typeof data == "string") {
  //       setNumbers(data.split("-").map(Number));
  //     } else {
  //       setNumbers(data);
  //     }
  //     // Convert string to array of numbers
  //     console.log(data);
  //     console.log(data.split("-").map(Number), "data.split");
  //     console.log(getnumbers, "getnumbers");
  //   });
  // }, [isConnected, socket]); // ✅ Run only on mount

  // useEffect(() => {
  //   if (!isConnected) return;
  //   socket.on("welcome", (data) => {
  //     console.log(data);
  //   });
  // }, [isConnected, socket]);

  useEffect(() => {
    if (!isConnected) return;

    const fetchUsers = () => {
      socket.emit("requestOnlineUsers");
    };

    socket.on("updateOnlineUsers", setUsers);

    const interval = setInterval(fetchUsers, 10000);
    return () => {
      clearInterval(interval);
      socket.off("updateOnlineUsers");
    };
  }, [isConnected, socket]);

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const updateBalance = async (type, amount) => {
    const token = getToken();

    console.log(token, "asdasdasdjkl");

    if (!amount || isNaN(amount) || amount <= 0) {
      console.error("Invalid amount");
      return;
    }
    socket.emit(`${type}`, { type, amount, token });

    socket.on(`${type}-success`, (data) => {
      const { message, balance } = data;
      console.log(message, "aksdkjasdjkas"); // Expected: 5 "Ticket bought successfully!" aksdkjasdjkas
      setBalance(balance);
    });
  };

  const handleBuyTicket = async (ticketPrice = 20, ticketQty) => {
    if (!isConnected) return;
    // console.log(isConnected, "aksdkjasdjkas");
    const token = getToken();
    // console.log(token, "aksdkjasdjkas");
    if (!ticketQty || isNaN(ticketQty) || ticketQty <= 0) {
      console.error("Invalid ticket quantity");
      return;
    }

    socket.emit("buy-ticket", { ticketPrice, ticketQty, token });

    // Listen for a response from the server
    socket.on("ticket-purchase-success", (data) => {
      const { tickets, balance, message } = data;
      setTicket(tickets);
      setBalance(balance);
      console.log(tickets, message, "aksdkjasdjkas"); // Expected: 5 "Ticket bought successfully!" aksdkjasdjkas
    });
    [isConnected, socket];
  };

  const handlePlaceBet = async (bet_number) => {
    if (!isConnected) return;
    const token = getToken();
    if (!bet_number) {
      setAlert("Invalid bet number", "error");
      return;
    }

    socket.emit("place-bet", { bet_number, token });

    socket.on("place-bet-success", (data) => {
      const { numbers, bet_id, message } = data;

      console.log(numbers, bet_id, message, "alsdansdkjasndjkan");
      // setTicket(bet);
    });

    socket.emit("prev-bet", { token });

    socket.on("prev-bet", (data) => {
      const { bet_data } = data;

      console.log(bet_data, "alsdansdkjasndjkan");
      setPlaceBet(false);
      setLottoInput("");
      setAccountBets(bet_data);
    });
  };

  const navigateHistory = () => {
    navigator("/history");
  };

  const navigateAccount = () => {
    navigator("/account");
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };

  useEffect(() => {
    if (!isConnected) return;

    socket.on("draws", async (data) => {
      if (
        typeof data == "string"
          ? setNumbers(data.split("-").map(Number))
          : setNumbers(data)
      );
    });
  }, [isConnected, socket]); // ✅ Run only on mount

  useEffect(() => {
    audioRef.current = new Audio(backgroundMusic);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.75;

    return () => {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    };
  }, []);

  const toggleSound = () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current
        .play()
        .catch((error) => console.error("Audio play error:", error));
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (!isConnected) return;
    const token = getToken();
    const getData = async () => {
      try {
        const data = await fetchAccountData(token);

        if (data) {
          setAccountData(data.data);
          setTicket(data.data.tickets);
          setBalance(data.data.balance);
        } else {
          setError("Failed to fetch account data");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [isConnected, socket]); // ✅ Empty dependency array to run only on mount

  useEffect(() => {
    if (!isConnected) return;
    if (timeLeft !== 0) return; // ✅ Only run when timeLeft is exactly 0
    const user_id = getUserId();

    socket.on("winners", async (data) => {
      const { winners } = data;

      console.log(winners);
      if (!winners || !winners.result || winners.result.length === 0) {
        console.log("❌ No winners data available.");
      } else {
        const winResult = winners.result.map((winner) =>
          Number(winner.user_id)
        );

        if (winResult.includes(Number(user_id))) {
          console.log("🎉 You are a winner!");
          setShowWinning(true);
          return; // ✅ Exit early to prevent "losers" from triggering
        }
      }

      // If the user is not in winners, listen for the losers event
      socket.on("lossers", async (data) => {
        const { lossers } = data;
        if (!lossers || !lossers.result || lossers.result.length === 0) {
          console.log("❌ No lossers data available.");
          return;
        }
        const lossResult = lossers.result.map((loser) => Number(loser.user_id));
        if (lossResult.includes(Number(user_id))) {
          console.log("❌ You are a loser.");
          setShowLossing(true);
        }
      });
    });

    // socket.on("lossers", async (data) => {});
  }, [timeLeft, isConnected, socket]); // ✅ Effect triggers when timeLeft changes

  const handleLottoInputChange = (e) => {
    let rawValue = e.target.value.replace(/[^0-9]/g, "");
    let formattedValue =
      rawValue
        .slice(0, 12)
        .match(/.{1,2}/g)
        ?.join("-") || "";

    setLottoInput(formattedValue);
  };

  const handleWithdrawInputChange = (e) => {
    let rawValue = e.target.value;

    setWithdrawInput(rawValue);
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div
      className="h-screen w-screen bg-cover bg-bottom bg-no-repeat"
      style={{
        backgroundImage: "url('src/assets/images/bg-main-page.png')",
        backgroundColor: "#F0E5C9",
      }}
    >
      <div
        className="absolute"
        style={{
          backgroundImage: "url('src/assets/images/final-logo.png')",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          top: "10px",
          left: "1%",
          width: "200px",
          height: "200px",
          zIndex: "10",
        }}
      ></div>

      {hasPlacedBet && (
        <div className="absolute top-[70px] pl-0 px-1">
          <div className="flex align-items right">
            <div
              className="p-4 px-6 py-6 mr-5 bg-center bg-no-repeat "
              style={{
                backgroundSize: "contain",
              }}
            ></div>
            <h1
              style={{
                fontFamily: "'Jersey 20', sans-serif",
                backgroundColor: "#E8AC41",
                fontSize: "2rem",
              }}
              className="flex justify-right px-6 py-2 rounded-lg"
            >
              JACKPOT PRIZE: $1,500.00
            </h1>
          </div>
        </div>
      )}

      <CountDown onTimeUpdate={setTimeLeft} />

      {/* <ButtonWithSound
        onClick={toggleSound}
        className="absolute top-4 left-4 bg-gray-800 text-white px-4 py-2 rounded-lg"
      >
        {isPlaying ? "🔊 On" : "🔇 Off"}
      </ButtonWithSound> */}
      {/* <div className="bg-white shadow-md rounded-lg p-4 w-64 mb-6">
        <h2
          style={{ fontFamily: "'Jersey 20', sans-serif" }}
          className="text-lg font-semibold text-gray-700 border-b pb-2"
        >
          Online Users ( {users.length} )
        </h2>
        <ul className="mt-2 text-sm text-gray-600">
          {users.length > 0 ? (
            users.map((user, index) => (
              <li key={index} className="py-1">
                {user.username} is online 🟢
              </li>
            ))
          )}
        </ul>
      </div> */}
      <div className="flex justify-center">
        <h1
          style={{ fontFamily: "'Jersey 20', sans-serif", fontSize: "3rem" }}
          className="mt-10 left-10 text-gray-800 text-center font-bold mb-10 border-blue-500 pb-5 pt-10"
        >
          WINNING COMBINATIONS
        </h1>
      </div>

      <div
        className="flex justify-center items-center"
        style={{ marginTop: -60 }}
      >
        {getnumbers.map((num, index) => (
          <div
            key={index}
            className="flex items-center justify-center w-[140px] h-[140px] bg-no-repeat bg-contain mr-2"
            style={{
              backgroundImage: "url('src/assets/images/winning-bg.png')",
              fontFamily: "'Jersey 20', sans-serif",
            }}
          >
            <p className="text-[5.5rem] text-black leading-tight flex items-center justify-center h-full w-full mr-2">
              {num}
            </p>
          </div>
        ))}
      </div>

      <div className="flex w-full h-auto justify-between gap-10">
        <div className="flex flex-col ml-80">
          <div className="flex w-[300px] mt-1 h-[50px] justify-between">
            <span
              className="text-black"
              style={{
                fontFamily: "'Jersey 20', sans-serif",
                fontSize: "2rem",
              }}
            >
              TICKET COUNTER:
            </span>
            <span
              className="text-black"
              style={{
                fontFamily: "'Jersey 20', sans-serif",
                fontSize: "2rem",
              }}
            >
              {ticket}
            </span>
          </div>
          <div className="flex justify-between items-center w-[300px] h-[60px]">
            <p
              className="justify-left text-left text-black"
              style={{
                fontFamily: "'Jersey 20', sans-serif",
                fontSize: "2rem",
              }}
            >
              QUANTITY:
            </p>
            <div className="flex items-center justify-center p-2 rounded-lg mt-1 ml-12 space-x-2">
              <button
                onClick={decreaseQuantity}
                className="py-1 px-3 bg-[#EEEEEE] text-black text-[28px]"
              >
                -
              </button>
              <p
                className="w-9 h-10 flex items-center justify-center text-black bg-[#FFFFFF] text-center rounded"
                style={{
                  fontFamily: "'Jersey 20', sans-serif",
                  fontSize: "2rem",
                }}
              >
                {quantity}
              </p>
              <button
                onClick={increaseQuantity}
                className="py-1 px-2 bg-[#EEEEEE] text-black text-[28px]"
              >
                +
              </button>
            </div>
          </div>

          <div className="relative w-full mt-3 h-auto">
            <div
              className="absolute right-0 w-[200px] h-[50px] rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: "#D01010",
                fontFamily: "'Jersey 20', sans-serif",
              }}
            >
              <p
                onClick={() => {
                  handleBuyTicket(20, quantity);
                }}
                className="text-[2rem] text-center mt-0 cursor-pointer"
              >
                BUY TICKET
              </p>
            </div>
          </div>

          <div className="flex w-full mt-16">
            <p
              style={{
                fontFamily: "'Jersey 20', sans-serif",
                fontSize: "2rem",
              }}
              className="flex justify-left text-black"
            >
              WALLET BALANCE:
            </p>
          </div>

          <div
            style={{
              fontFamily: "'Jersey 20', sans-serif",
              backgroundColor: "#41644A",
              borderRadius: "10px",
            }}
          >
            <div className="flex flex-row items-center">
              <div
                className="w-[80px] h-[80px] ml-2 bg-center bg-no-repeat"
                style={{
                  backgroundImage: "url('src/assets/images/money-img.png')",
                  backgroundSize: "contain",
                }}
              ></div>
              <p className="ml-2 text-center text-white text-[36px]">
                $ {balance}
              </p>
            </div>
          </div>

          <div
            style={{
              fontFamily: "'Jersey 20', sans-serif",
              borderRadius: "10px",
              marginTop: "10px",
            }}
          >
            <div className="flex w-full mt-2">
              <p
                style={{
                  fontFamily: "'Jersey 20', sans-serif",
                  fontSize: "2rem",
                }}
                className="flex justify-left text-black"
              >
                PREVIOUS BET:
              </p>
            </div>

            <div
              style={{
                fontFamily: "'Jersey 20', sans-serif",
                backgroundColor: "#41644A",
                borderRadius: "10px",
                // height: "100%",
              }}
            >
              <div className="flex flex-col min-h-[150px] justify-left overflow-y-scroll">
                {accountBets.map((bet, index) => (
                  <p
                    key={index}
                    className="ml-2 text-left text-white text-[2rem]"
                  >
                    {`${index + 1}. ${bet.bet_number}`}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          className="flex flex-col mr-80 text-white"
          style={{ fontFamily: "'Jersey 20', sans-serif" }}
        >
          <div className="mt-5 mr-20">
            <p
              className="text-black"
              style={{ fontSize: "2rem", margin: "0px" }}
            >
              Enter Lotto Bet:
            </p>
            <input
              type="text"
              placeholder="00-00-00-00-00-00"
              value={lottoInput}
              onChange={handleLottoInputChange}
              className="w-full p-2 border-b-2 border-black bg-transparent text-black focus:outline-none"
              style={{ fontSize: "2.5rem", marginTop: "0px" }}
            />
          </div>

          <div className="flex mt-5 mr-16 relative items-center justify-center">
            <Button
              onClick={() => handlePlaceBet(lottoInput)}
              className="w-80 text-[2rem] py-2 px-4"
              style={{ backgroundColor: "#D01010" }}
            >
              PLACE BET
            </Button>
          </div>

          <div className="flex mt-5 mr-16 relative items-center justify-center">
            <Button
              onClick={() => setPopUpWithdraw(true)}
              className="w-80 text-[2rem] py-2 px-4"
              style={{ backgroundColor: "#41644A" }}
            >
              WITHDRAW CASH
            </Button>
          </div>

          <div className="flex mt-5 mr-16 relative items-center justify-center">
            <Button
              onClick={navigateHistory}
              className="w-80 text-[2rem] py-2 px-4"
              style={{ backgroundColor: "#41644A" }}
            >
              HISTORY
            </Button>
          </div>

          <div className="flex w-[340px] mt-[10px] ml-[65px] text-[24px] h-auto justify-between">
            <div>
              <p
                style={{ backgroundColor: "#C14600" }}
                className="w-[150px] text-center rounded-lg"
              >
                GAMBLERS {users.length}
              </p>
            </div>
            <div>
              <p
                onClick={navigateAccount}
                style={{ backgroundColor: "#41644A" }}
                className="w-[150px] text-center rounded-lg cursor-pointer"
              >
                {accountData.username}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/*WITHDRAW Popup */}
      {popupWithdraw && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#FFCF50] p-20 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-semibold">ENTER AMOUNT TO WITHDRAW</h2>
            <div className="inset-0">
              <input
                type="email"
                value={withdrawInput}
                onChange={handleWithdrawInputChange}
                className="w-full p-2 border-b-2 border-black bg-transparent text-2xl text-black mb-3 focus:outline-none"
              />
            </div>
            <div className="flex justify-center gap-4">
              <ButtonWithSound
                onClick={() => setPopUpWithdraw(false)}
                className="bg-[#C14600] px-4 py-2 rounded-lg text-white transition"
              >
                Cancel
              </ButtonWithSound>
              <ButtonWithSound
                onClick={() => {
                  setPopUpWithdraw(false),
                    updateBalance(
                      "withdraw",
                      Number(withdrawInput),
                      setWithdrawInput("")
                    );
                }}
                className="bg-[#41644A] px-4 py-2 rounded-lg text-white transition"
              >
                WITHDRAW CASH
              </ButtonWithSound>
            </div>
          </div>
        </div>
      )}
      {/*TOP UP Popup */}
      {popupTopUp && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#FFCF50] p-20 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-semibold">ENTER AMOUNT TO TOP-UP</h2>
            <div className="">
              <input
                type="email"
                className="w-full p-2 border-b-2 border-black bg-transparent text-2xl text-black mb-3 focus:outline-none"
              />
            </div>
            <div className="flex justify-center gap-4">
              <ButtonWithSound
                onClick={() => setPopUpWithdraw(false)}
                className="bg-[#C14600] px-4 py-2 rounded-lg text-white transition"
              >
                Cancel
              </ButtonWithSound>
              <ButtonWithSound
                onClick={() => setPopUpTopUp(false)}
                className="bg-[#41644A] px-4 py-2 rounded-lg text-white transition"
              >
                TOP UP
              </ButtonWithSound>
            </div>
          </div>
        </div>
      )}

      {showWinning && <WinningPopup onClose={() => setShowWinning(false)} />}
      {showLossing && <LossingPopUp onClose={() => setShowLossing(false)} />}
    </div>
  );
};

const Button = styled.button`
  --bg: #000;
  --hover-bg: #fff;
  --hover-text: #000;
  color: #fff;
  cursor: pointer;
  border: 1px solid var(--bg);
  border-radius: 4px;
  padding: 0.3em 2em;
  background: var(--bg);
  transition: 0.2s;

  &:hover {
    color: #fff;
    transform: translate(-0.5rem, -0.5rem);
    background: var(--hover-bg);
    box-shadow: 0.5rem 0.5rem var(--bg),
      0.75rem 0.75rem rgba(255, 255, 255, 0.2); /* Stronger shadow */
  }

  &:active {
    transform: translate(0);
    box-shadow: none;
  }
`;

export default DisplayHome;
