import React, { useEffect, useState } from "react";

import { io } from "socket.io-client";

const socket = io(`http://localhost:3000`);

const DrawNumber = () => {
  const [drawNumbers, setDrawNumbers] = useState([]);

  useEffect(() => {
    socket.on("draw", (numbers) => {
      console.log(numbers);
      setDrawNumbers(numbers);
    });

    return () => {
      socket.off("draw"); // ✅ Clean up listener
    };
  }, []);

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
