import axios from "axios";

const fetchAccountData = async (token) => {
  try {
    const response = await axios.get(`http://localhost:1000/v1/account/`, {
      headers: {
        "Content-Type": "application/json",
        apikey: `hello`,
        token: token, // ✅ Get token properly
      },
    });

    if (response.status !== 200) {
      throw new Error(response.message || "Failed to fetch account data");
    }
    console.log("Account data:", response.data); // ✅ Log the account data
    return response.data; // ✅ Return fetched data instead of using useState
  } catch (err) {
    console.error("Fetch error:", err.message);
    return null; // ✅ Return `null` if there is an error
  }
};

const fetchPrevBet = async (token) => {
  try {
    const response = await axios.get(
      `http://localhost:1000/v1/account/prev-bet`,
      {
        headers: {
          "Content-Type": "application/json",
          apikey: `hello`,
          token: token, // ✅ Get token properly
        },
      }
    );
    if (response.status !== 200) {
      throw new Error(response.message || "Failed to fetch previous bets");
    }

    // console.log(data.data.bet_number);

    const betNumbers = Array.isArray(response.data)
      ? response.data.map((bet) => bet.bet_number)
      : [];

    return betNumbers || [];
  } catch (err) {
    console.error("Error fetching draw:", err);
  }
};

const updateBalance = async (type, amount, token) => {
  try {
    const response = await axios.post(
      `http://localhost:1000/v1/account/${type}/${amount}`,
      { type: type },
      {
        headers: {
          "Content-Type": "application/json",
          apikey: `hello`,
          token: `${token}`, // ✅ Get token properly
        },
        params: { type: type }, //Add params to the request.
      }
    );

    if (response.status !== 200) {
      throw new Error(response.message || "Failed to fetch account data");
    }

    return response.data; // ✅ Return fetched data instead of using useState
  } catch (err) {
    console.error("Fetch error:", err.message);
    return null; // ✅ Return `null` if there is an error
  }
};

export { fetchAccountData, fetchPrevBet, updateBalance };
