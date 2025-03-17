const buyTicket = async (amount, qty) => {
  try {
    if (!qty || isNaN(qty) || qty <= 0) {
      throw new Error("Invalid qty");
    }

    const response = await fetch(`http://localhost:1000/v1/ticket/buy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: "hello",
        token: localStorage.getItem("token"), // ✅ Get token properly
      },
      body: JSON.stringify({ ticketPrice: amount, ticketQty: qty }), // ✅ Send type in request body
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

export default buyTicket;
