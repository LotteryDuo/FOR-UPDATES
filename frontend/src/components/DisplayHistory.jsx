import React from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DisplayHistory = () => {
  const navigate = useNavigate();
  const handleReturn = () => {
    navigate(-1);
  };
  return (
    <div
      className="flex flex-col h-screen w-screen bg-contain bg-center bg-no-repeat overflow-y-scroll"
      style={{
        backgroundImage: "url('src/assets/images/bg-account.png')",
        fontFamily: "'Jersey 20', sans-serif",
      }}
    >
      <div className="flex justify-center">
        <h1
          style={{ fontFamily: "'Jersey 20', sans-serif", fontSize: "40px" }}
          className="mt-10 left-10  text-gray-800 text-center font-bold mb-10  border-blue-500 pb-5 pt-10"
        >
          HISTORY
        </h1>
      </div>
      <div className="absolute top-[80px] left-[280px] pl-10 px-2">
        <button
          onClick={handleReturn}
          className="p-0 px-3 py-1 w-auto flex bg-[#FFCF50] text-white rounded-lg shadow-md transition"
        >
          <ChevronLeft />
          <p className="text-[18px] ">RETURN</p>
        </button>
      </div>
      <div className="w-full flex flex-col justify-center items-center gap-6 overflow-y">
        {[...Array(10)].map((_, index) => (
          <div
            key={index}
            className="flex flex-row border-[#AAAAAA] border-2 shadow-2xl w-[700px] h-[130px] rounded-lg justify-between"
            style={{
              fontFamily: "'Jersey 20', sans-serif",
            }}
          >
            <div className="w-[50%]">
              <h1 className="text-black mt-4 ml-6 text-[14px]">
                WINNING COMBINATION
              </h1>
              <p className="py-1/2 ml-11 text-black text-[30px]">
                09-45-43-11-14-28
              </p>
              <p className="text-black ml-6 text-[14px]">
                DRAW DATE: 02-28-2025
              </p>
              <p className="text-black ml-6 text-[14px]">DRAW TIME: 10:40 AM</p>
            </div>
            <div className="w-[50%]">
              <h1 className="text-black mt-4 text-[14px]">YOUR BET</h1>
              <p className="py-1/2 ml-5 text-black text-[30px]">
                50-43-11-21-07-01
              </p>
              <p className="text-black ml-[280px] text-[24px]">LOST</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayHistory;
