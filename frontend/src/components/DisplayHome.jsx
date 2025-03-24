import React, { useState, useEffect, useRef } from "react";

import Input from "./Input"; // Importing the Input component
import { styled } from "styled-components";

import { Wallet, User, Star, CodeSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

import backgroundMusic from "../assets/sounds/background-music.mp3";
import ButtonWithSound from "./ButtonWithSound";

import { io } from "socket.io-client";
import fetchAccountData from "../utils/fetchAccountData.jsx";

import fetchPrevBet from "../utils/fetchPrevBet.js";

import buyTicket from "../utils/buyTicket.js";

import CountDown from "./CountDown";
import placeBet from "../utils/placeBet.js";

import fetchWinners from "../utils/fetchWinners.js";

const socket = io("ws://localhost:3000", {
  transports: ["websocket"],
});

const getToken = () => localStorage.getItem("token");

const getUsername = () => localStorage.getItem("username");

const getUserId = () => localStorage.getItem("user_id");

const DisplayHome = () => {
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

  const [showWinning, setShowWinning] = useState("pending");

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
    const fetchUsers = () => {
      socket.emit("requestOnlineUsers");
    };

    socket.on("updateOnlineUsers", setUsers);

    const interval = setInterval(fetchUsers, 10000);
    return () => {
      clearInterval(interval);
      socket.off("updateOnlineUsers");
    };
  }, []);

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleBuyTicket = async (ticketPrice = 20, ticketQty) => {
    if (!ticketQty || isNaN(ticketQty) || ticketQty <= 0) {
      console.error("Invalid ticket quantity");
      return;
    }

    // const sendToServerBuyTicket = () => {
    //   socket.emit("buy-ticket", { ticketPrice, ticketQty });
    //   console.log(localStorage.getItem("user_id"));
    //   // console.log(user_id, "alksndasndklasmdl;ksa");
    // };

    // sendToServerBuyTicket(); // Call the function to emit event

    // Uncomment this if you want to send a request to the backend for further processing
    try {
      const response = await buyTicket(ticketPrice, ticketQty);
      console.log("Ticket purchased successfully:", response);
      const data = await fetchAccountData();
      if (data) setAccountData(data);
    } catch (error) {
      console.error("Failed to buy ticket:", error.message);
    }
  };

  const handlePlaceBet = async (bet_number) => {
    if (!bet_number) {
      console.error("Invalid bet number");
      return;
    }

    // const sendToServerBet = () => {
    //   socket.emit("place-bet", {});
    // };

    // sendToServerBet();

    try {
      const response = await placeBet(bet_number);
      console.log("Ticket Placed successfully:", response);
      const bets = await fetchPrevBet();
      if (bets.length > 0) {
        setAccountBets(bets);
        setPlaceBet(true);
      }
      const data = await fetchAccountData();

      if (data) setAccountData(data);

      setLottoInput("");
    } catch (error) {
      console.error("Failed to buy ticket:", error.message);
    }
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
    socket.on("draws", async (data) => {
      if (typeof data === "string") setNumbers(data.split("-").map(Number)); // Convert string to array of numbers
    });

    // ✅ Cleanup function: Remove event listener on unmount
    return () => {
      socket.off("draws");
    };
  }, []); // ✅ Run only on mount

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

  // useEffect(() => {
  //   const username = getUsername();

  //   if (username) {
  //     socket.emit("userConnected", {
  //       username: username,
  //     });
  //   } else {
  //     console.log("⚠️ No username found in localStorage!");
  //   }

  //   const handleUsersUpdate = (onlineUsers) => {
  //     setUsers(onlineUsers);
  //   };

  //   const handleUserDisconnected = (disconnectedUser) => {
  //     setUsers((prevUsers) =>
  //       prevUsers.map((user) =>
  //         user.username === disconnectedUser.username
  //           ? { ...user, online: false }
  //           : user
  //       )
  //     );
  //   };

  //   socket.on("updateOnlineUsers", handleUsersUpdate);
  //   socket.on("userDisconnected", handleUserDisconnected);

  //   window.addEventListener("beforeunload", () => {
  //     if (username) {
  //       socket.emit("userDisconnected", { username });
  //     }
  //   });

  //   return () => {
  //     socket.off("updateOnlineUsers", handleUsersUpdate);
  //     socket.off("userDisconnected", handleUserDisconnected);
  //   };
  // }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchAccountData();

        if (data) {
          setAccountData(data);
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
  }, []); // ✅ Empty dependency array to run only on mount

  useEffect(() => {
    const getBets = async () => {
      try {
        const bets = await fetchPrevBet();

        if (bets.length > 0) {
          setAccountBets(bets);
          setPlaceBet(true);
          console.log(bets);
        } else {
          console.log("no Bets found.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getBets();
  }, []); // ✅ Empty dependency array to run only on mount

  useEffect(() => {
    if (timeLeft !== 0) return; // ✅ Only run when timeLeft is exactly 0

    const fetchData = async () => {
      try {
        console.log("Fetching data since timeLeft is 0...");
        const account_data = await fetchAccountData();
        console.log(account_data);
        if (account_data) setAccountData(account_data);

        // ✅ Wait 3 seconds before fetching winners
        setTimeout(async () => {
          const winners = await fetchWinners(); // ✅ Remove `[winners]`, fetchWinners() should return an array

          console.log("Winners List:", winners);

          console.log(getUserId());

          // ✅ Find the user in the winners array
          const userWin = winners.find((win) => win.user_id === getUserId());

          if (userWin) {
            console.log("🎉 You are a winner!", userWin.user_id);
          } else {
            console.log("❌ Not a winner.");
          }
        }, 3000);

        setAccountBets([]);
        setPlaceBet(true);

        console.log("Data reloaded successfully!");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [timeLeft]); // ✅ Effect triggers when timeLeft changes

  const handleLottoInputChange = (e) => {
    let rawValue = e.target.value.replace(/[^0-9]/g, "");
    let formattedValue =
      rawValue
        .slice(0, 12)
        .match(/.{1,2}/g)
        ?.join("-") || "";

    setLottoInput(formattedValue);
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
        {/* {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-center w-[140px] h-[140px] bg-no-repeat bg-contain mr-2"
            style={{
              backgroundImage: "url('src/assets/images/winning-bg.png')",
              fontFamily: "'Jersey 20', sans-serif",
            }}
          >
            <p className="text-[5.5rem] text-black leading-tight flex items-center justify-center h-full w-full mr-2">
              {getnumbers}
            </p>
          </div>
        ))
        } */}

        {
          // const numbers = str.split("-").map(Number);

          getnumbers.map((num, index) => (
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
          ))
        }
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
              {accountData.tickets}
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
                onClick={() => handleBuyTicket(20, quantity)}
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
                $ {accountData.balance}
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
              <div className="flex flex-col h-[150px] items-center overflow-y-scroll">
                {accountBets.map((bet, index) => (
                  <p
                    key={index}
                    className="ml-2 text-center text-white text-[2rem]"
                  >
                    {`${index + 1}. ${bet}`}
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
                onClick={() => setPopUpWithdraw(false)}
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

      {showWinning === "win" && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50">
          <div className="flex flex-col items-center">
            <div
              className="flex flex-row justify-center"
              style={{ marginTop: -40 }}
            >
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="pb-[200px] bg-no-repeat mr-2 bg-contain w-[120px] h-[110px]"
                  style={{
                    backgroundImage: "url('src/assets/images/winning-img.png')",
                    fontFamily: "'Jersey 20', sans-serif",
                  }}
                ></div>
              ))}
            </div>
            <div className=" bg-[#FFCF50] p-20 rounded-lg shadow-lg text-center mb-[100px]">
              <h2 className="text-[50px] font-semibold text-black">YOU WON!</h2>
            </div>
          </div>
        </div>
      )}
      {showWinning === "lost" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#9E9E9E] p-20 rounded-lg shadow-lg text-center">
            <h2 className="text-[50px] font-semibold text-black">YOU LOST!</h2>
          </div>
        </div>
      )}
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
