import React from "react";
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
// import "./App.css";
import useSocket from "./hooks/useSocket.js";

import Check from "./pages/Check.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import SignIn from "./pages/SignIn.jsx";
import Home from "./pages/Home.jsx";
import Account from "./pages/Account.jsx";
import History from "./pages/History.jsx";
import PageNotFound from "./pages/PageNotFound.jsx";

const App = () => {
  const { isConnected, socket } = useSocket();

  useEffect(() => {
    if (!isConnected) return;

    socket.on("welcome", (data) => {
      console.log("[ws] welcome", data);
    });
  }, [isConnected, socket]);

  return (
    <Routes>
      {/* Routes Section */}
      <Route path="/" element={<Check />} />
      <Route path="/minute-lotto" element={<LandingPage />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/home" element={<Home />} />
      <Route path="/account" element={<Account />} />
      <Route path="/history" element={<History />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default App;
