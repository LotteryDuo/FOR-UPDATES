import React from "react";
import { useState, useEffect } from "react";
import Alert from "./Alert";
import useSocket from "../hooks/useSocket";

const CountDown = ({ onTimeUpdate }) => {
  const [timeLeft, setTimeLeft] = useState("00"); // Start at 60 seconds
  const { isConnected, socket } = useSocket();

  useEffect(() => {
    if (!isConnected) return;

    socket.on("countdown", (timeLeft) => {
      setTimeLeft(timeLeft);
      onTimeUpdate(timeLeft);
    });

    return () => {
      socket.off("countdown");
    };
  }, [isConnected, socket]); // Add empty dependency array

  return (
    <div
      style={{
        fontFamily: "'Jersey 20', sans-serif",
        backgroundColor: "#E8AC41",
        fontSize: "1.9rem",
      }}
      className="absolute top-10 right-5 text-white mr-10  px-6 py-1 rounded-lg"
    >
      NEXT DRAW IN: {timeLeft}s
    </div>
  );
};

export default CountDown;
