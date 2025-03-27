import "dotenv/config";

import axios from "axios";
const API = process.env.VITE_API_URL;

const buyTicket = async (amount, qty, token) => {
  try {
    if (!qty || isNaN(qty) || qty <= 0) {
      throw new Error("Invalid qty");
    }

    const response = await axios.post(
      `${API}/ticket/buy`,
      { ticketPrice: amount, ticketQty: qty },
      {
        headers: {
          "Content-Type": "application/json",
          apikey: "hello",
          token: token, // ✅ Get token properly
        },
      }
    );

    return response; // ✅ Return API response
  } catch (err) {
    console.error("Top-up error:", err.message);
    throw err; // ✅ Re-throw error to handle it in the calling function
  }
};

export { buyTicket };
