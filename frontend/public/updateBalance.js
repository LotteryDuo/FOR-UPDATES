const updateBalance = async (type, amount) => {
  try {
    if (!type || amount <= 0 || isNaN(amount)) {
      throw new Error("Invalid qty");
    }

    const response = await fetch(
      `http://localhost:1000/v1/account/${type}/${amount}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: "hello",
          token: localStorage.getItem("token"), // ✅ Get token properly
        },
        body: JSON.stringify({ type: type, amount: amount }), // ✅ Send type in request body
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Processing ${type} failed`);
    }

    return data; // ✅ Return API response
  } catch (err) {
    console.error("Top-up error:", err.message);
    throw err; // ✅ Re-throw error to handle it in the calling function
  }
};

export default updateBalance;
