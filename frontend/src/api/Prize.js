import "dotenv/config";

import axios from "axios";
const API = process.env.VITE_API_URL;

const getPrizeAmount = async (token) => {
  try {
    if (!token) {
      throw new Error("UnAuthenticated user");
    }

    const response = await axios.get(`${API}/prize/`, {
      headers: {
        "Content-Type": "application/json",
        apikey: "hello",
        token: token, // ✅ Get token properly
      },
    });

    return response; // ✅ Return API response
  } catch (err) {
    console.error("Top-up error:", err.message);
    throw err; // ✅ Re-throw error to handle it in the calling function
  }
};

const updatePrizeAmount = async (token, userBet) => {
  try {
    if (!token) {
      throw new Error("UnAuthenticated user");
    }

    if (!userBet || isNaN(userBet) || userBet <= 0)
      throw new Error("Invalid Amount");

    const response = await axios.patch(
      `${API}/prize/add`,
      { userBet: userBet },
      {
        headers: {
          "Content-Type": "application/json",
          apikey: "hello",
          token: token, // ✅ Get token properly
        },
      }
    );

    // console.log(response.data)

    return response; // ✅ Return API response
  } catch (err) {
    console.error("Top-up error:", err.message);
    throw err; // ✅ Re-throw error to handle it in the calling function
  }
};

export { getPrizeAmount, updatePrizeAmount };
