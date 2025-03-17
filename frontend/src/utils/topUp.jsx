const topUp = async (type, amount) => {
  try {
    if (!amount || isNaN(amount) || amount <= 0) {
      throw new Error("Invalid top-up amount");
    }

    const response = await fetch(
      `http://localhost:1000/v1/account/deposit/${amount}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: "hello",
          token: localStorage.getItem("token"), // ✅ Get token properly
        },
        body: JSON.stringify({ type, amount }), // ✅ Send type in request body
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Top-up failed");
    }

    return data; // ✅ Return API response
  } catch (err) {
    console.error("Top-up error:", err.message);
    throw err; // ✅ Re-throw error to handle it in the calling function
  }
};

export default topUp;
