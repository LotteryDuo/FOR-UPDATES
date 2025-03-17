// import React from "react";
// import { useState, useEffect } from "react";
// import Alert from "./Alert";
// import { io } from "socket.io-client";

// const socket = io(`http://localhost:4001`);

// const WinningCombination = () => {
//   const [combination, setCombination] = useState([]); // Start at 60 seconds

//   useEffect(() => {
//     socket.on("draw", (combination) => {
//       console.log(`Received combination in Room: ${combination}s`);
//       setCombination(combination);
//     });

//     return () => {
//       socket.off("draw");
//     };
//   }, []); // Add empty dependency array

//   return (
//     <div className="flex flex-column justify-center" style={{ marginTop: -40 }}>
//       {combination.map((num, index) => (
//         <div
//           key={index}
//           className="p-15 bg-no-repeat mr-2 bg-contain w-[110px] h-[110px]"
//           style={{
//             backgroundImage: "url('src/assets/images/winning-bg.png')",
//             fontFamily: "'Jersey 20', sans-serif",
//           }}
//         >
//           <p className="text-black mt-4 ml-6 text-7xl">
//             {num} {/* Show "--" before draw */}
//           </p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default WinningCombination;
