import "dotenv/config";
import axios from "axios";
const API = process.env.VITE_API_URL;

const placeBet = async (bet_number, token) => {
  try {
    if (!bet_number) {
      throw new Error("Invalid bet_number");
    }

    const response = await axios.post(
      `${API}/bet`,
      { bet_number: bet_number },
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

const getPrevBet = async (token) => {
  try {
    const response = await axios.get(`${API}/account/prev-bet`, {
      headers: {
        "Content-Type": "application/json",
        apikey: "hello",
        token: token, // ✅ Get token properly
      },
    });

    // console.log(data.data.bet_number);

    // console.log(response.data.data);

    // const betNumbers = Array.isArray(response.data)
    //   ? data.data.map((bet) => bet.bet_number)
    //   : [];

    return response;
  } catch (err) {
    console.error("Error fetching draw:", err);
  }
};

export { placeBet, getPrevBet };
