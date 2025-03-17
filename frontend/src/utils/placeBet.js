const placeBet = async (bet_number) => {
  try {
    if (!bet_number) {
      throw new Error("Invalid bet_number");
    }

    const response = await fetch(`http://localhost:1000/v1/bet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: "hello",
        token: localStorage.getItem("token"), // ✅ Get token properly
      },
      body: JSON.stringify({ bet_number: bet_number }), // ✅ Send type in request body
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Buy ticket failed");
    }

    return data; // ✅ Return API response
  } catch (err) {
    console.error("Top-up error:", err.message);
    throw err; // ✅ Re-throw error to handle it in the calling function
  }
};

export default placeBet;
