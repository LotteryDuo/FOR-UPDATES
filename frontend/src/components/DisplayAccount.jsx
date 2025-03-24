import React, { useState, useEffect } from "react";
import { Wallet, User, LogOut, CodeSquare, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import fetchAccountData from "../utils/fetchAccountData.jsx";
import ButtonWithSound from "./ButtonWithSound";

// import ShowStatusWinning from "./ShowStatusWinning";

const socket = io("ws://localhost:3000", {
  transports: ["websocket"],
});

const getToken = () => localStorage.getItem("token");
const getUsername = () => localStorage.getItem("username") || "Guest";

const DisplayAccount = () => {
  const [accountData, setAccountData] = useState("");
  const [balance, setBalance] = useState(""); // Mock balance
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [popupWithdraw, setPopUpWithdraw] = useState(false);
  const [popupTopUp, setPopUpTopUp] = useState(false);
  const [showWinning, setShowWinning] = useState(null);
  const navigate = useNavigate();

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
    socket.on("updateBalance", (newBalance) => {
      setBalance(newBalance);
    });

    return () => {
      socket.off("updateBalance");
    };
  }, []);

  const handleLogout = () => {
    const username = getUsername();

    // Notify server that user is disconnecting
    if (username) {
      socket.emit("userDisconnected", { username });
    }

    // Clear session and redirect to login
    sessionStorage.clear();
    navigate("/sign-in");
  };

  const handleHistory = () => {
    navigate("/history");
  };

  return (
    <div
      className="flex flex-col h-screen w-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('src/assets/images/bg-account.png')",
        fontFamily: "'Jersey 20', sans-serif",
      }}
    >
      <div
        className="absolute"
        style={{
          backgroundImage: "url('src/assets/images/final-logo.png')",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          top: "20px",
          left: "2%",
          width: "200px",
          height: "200px",
          zIndex: "10",
        }}
      ></div>

      <div className="flex justify-center">
        <h1
          style={{ fontFamily: "'Jersey 20', sans-serif", fontSize: "3rem" }}
          className="mt-10 left-10  text-gray-800 text-center font-bold mb-10  border-blue-500 pb-5 pt-6"
        >
          ACCOUNT INFORMATION
        </h1>
      </div>
      <div className="absolute top-[90px] left-[250px] pl-5 px-2">
        <button
          onClick={() => navigate("/home")}
          className="w-[200px] flex  ml-70 bg-[#FFCF50] text-white rounded-lg shadow-md hover:bg-red-700 transition"
        >
          <p className="text-[1rem] px-3 py-0">RETURN TO MAIN PAGE</p>
        </button>
      </div>
      <div className="flex px-[320px] flex-row w-full h-auto justify-between gap-6 mt-5">
        {/* PROFILE */}
        <div className="flex flex-col h-[210px] w-[25%] bg-[#FBE196] rounded-lg shadow-md flex items-center justify-center ">
          <div
            className="w-[90px] h-[90px] ml-1 bg-center bg-no-repeat "
            style={{
              backgroundImage: "url('src/assets/images/account-img.png')",
              backgroundSize: "contain", // or "cover"
            }}
          ></div>
          <p className="text-black mt-2 text-center text-[42px]">
            {accountData.username}
          </p>
        </div>
        <div className="flex w-[75%] gap-[50px] justify-center pl-5 mt-5">
          {/* WALLET BALANCE */}
          <div className="flex flex-col  h-[120px] w-[38%] items-center justify-center ">
            <div className="flex flex-col w-[230px] h-[120px] bg-[#41644A] border-[#FFCF50] border-4 rounded-md shadow-md ">
              <p className="text-[18px] pl-[10px] pt-[7px]">WALLET BALANCE</p>
              <p className="text-[40px] pl-[20px] pb-5">
                ${accountData.balance}
              </p>
            </div>
            <div className="w-[300px]">
              <button
                onClick={() => setPopUpTopUp(true)}
                className="ml-[200px] mt-2 text-[24px] bg-[#C14600] px-4 py-0"
              >
                TOP UP
              </button>
            </div>
            <div className="w-[300px]">
              <button
                onClick={() => {
                  setPopUpWithdraw(true);
                }}
                className="ml-[115px] mt-2 text-[24px] bg-[#41644A] px-4 py-0"
              >
                WITHDRAW CASH
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-[140px] right-[200px] px-20 py-0">
          <button
            onClick={handleHistory}
            className="p-0 w-[150px] flex itemsp-center justify-center bg-[#FFCF50] text-white rounded-lg shadow-md  transition"
          >
            <p className="text-[20px] text-center">HISTORY</p>
          </button>
        </div>
        <div className="absolute bottom-[90px] right-[200px] px-20 py-0">
          <button
            onClick={() => setShowLogoutPopup(true)}
            className="p-0 w-[150px] flex itemsp-center justify-center bg-[#C14600] text-white rounded-lg shadow-md  transition"
          >
            <p className="text-[20px] text-center">LOG OUT</p>
          </button>
        </div>
        <div className="absolute bottom-[90px] right-[370px] px-20 py-0">
          <button
            onClick={() => setShowWinning("win")}
            className="p-0 w-[180px] flex itemsp-center justify-center bg-[#41644A] text-white rounded-lg shadow-md  transition"
          >
            <p className="text-[20px] text-center">SWITCH ACCOUNT</p>
          </button>
        </div>
        <div className="absolute bottom-[90px] left-[320px] ">
          <button
            onClick={() => setShowWinning("lost")}
            className="p-0 w-[180px] flex itemsp-center justify-center bg-[#970000] text-white rounded-lg shadow-md  transition"
          >
            <p className="text-[20px] text-center">DELETE ACCOUNT</p>
          </button>
        </div>
      </div>
      {/* Logout Button
      <ButtonWithSound
        onClick={() => setShowLogoutPopup(true)}
        className="w-[100px] flex items-center justify-center  bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition"
      >
        <p className="">Logout</p>
      </ButtonWithSound> */}

      {/* Logout Confirmation Popup */}
      {showLogoutPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to exit?
            </h2>
            <div className="flex justify-center gap-4">
              <ButtonWithSound
                onClick={handleLogout}
                className="bg-red-600 px-4 py-2 rounded-lg text-white hover:bg-red-700 transition"
              >
                Yes, Logout
              </ButtonWithSound>
              <ButtonWithSound
                onClick={() => setShowLogoutPopup(false)}
                className="bg-gray-600 px-4 py-2 rounded-lg text-white hover:bg-gray-700 transition"
              >
                Cancel
              </ButtonWithSound>
            </div>
          </div>
        </div>
      )}

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
                onClick={handleLogout}
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
                onClick={() => setPopUpTopUp(false)}
                className="bg-[#C14600] px-4 py-2 rounded-lg text-white transition"
              >
                Cancel
              </ButtonWithSound>
              <ButtonWithSound
                onClick={handleLogout}
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

export default DisplayAccount;
