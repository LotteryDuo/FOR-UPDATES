import React from "react";
import { useState, useEffect } from "react";
import Alert from "./Alert";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const CountDown = () => {
  const [timeLeft, setTimeLeft] = useState("00"); // Start at 60 seconds

  useEffect(() => {
    socket.on("countdown", (timeLeft) => {
      setTimeLeft(timeLeft);
    });

    return () => {
      socket.off("countdown");
    };
  }, []); // Add empty dependency array

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
