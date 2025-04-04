import React, { useEffect, useState } from "react";
import useSocket from "../hooks/useSocket";

const DrawNumber = () => {
  const { isConnected, socket } = useSocket();
  const [drawNumbers, setDrawNumbers] = useState([]);

  useEffect(() => {
    if (!isConnected) return;
    socket.on("draw", (numbers) => {
      console.log(numbers);
      setDrawNumbers(numbers);
    });
  }, [isConnected, socket]);

  return (
    <div className="flex flex-column justify-center" style={{ marginTop: -40 }}>
      {drawNumbers.length > 0
        ? drawNumbers.map((num, index) => (
            <div
              key={index}
              className="p-15 bg-no-repeat mr-2 bg-contain w-[110px] h-[110px]"
              style={{
                backgroundImage: "url('src/assets/images/winning-bg.png')",
                fontFamily: "'Jersey 20', sans-serif",
              }}
            >
              <p className="text-black mt-4 ml-6 text-7xl">
                {num} {/* Show "--" before draw */}
              </p>
            </div>
          ))
        : new Array(6).fill(null).map((_, index) => (
            <div
              key={index}
              className="p-15 bg-no-repeat mr-2 bg-contain w-[110px] h-[110px]"
              style={{
                backgroundImage: "url('src/assets/images/winning-bg.png')",
                fontFamily: "'Jersey 20', sans-serif",
              }}
            >
              <p className="text-black mt-4 ml-6 text-7xl">--</p>{" "}
              {/* Placeholder */}
            </div>
          ))}
    </div>
  );
};

export default DrawNumber;
