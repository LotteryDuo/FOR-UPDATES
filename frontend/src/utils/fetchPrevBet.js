const fetchPrevBet = async () => {
  try {
    const response = await fetch("http://localhost:1000/v1/account/prev-bet", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apikey: "hello",
        token: localStorage.getItem("token"), // ✅ Get token properly
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    // console.log(data.data.bet_number);

    const betNumbers = Array.isArray(data.data)
      ? data.data.map((bet) => bet.bet_number)
      : [];

    return betNumbers || [];
  } catch (err) {
    console.error("Error fetching draw:", err);
  }
};

// Call the function
export default fetchPrevBet;
