const transaction = async (type, amount) => {
  try {
    const response = await fetch(
      `http://localhost:3000/v1/account/${type}/${amount}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: "hello",
          token: sessionStorage.getItem("token"), // ✅ Get token properly
        },
        body: JSON.stringify({ type: type, amount: amount }), // ✅ Send `type` and `amount` in body
      }
    );

    const res = await response.json();

    if (!res.success) {
      throw new Error(res.message || "Transaction failed");
    }

    console.log(res.data);

    return res.data; // ✅ Return response data
  } catch (err) {
    console.error("Transaction error:", err.message);
    return null; // ✅ Return `null` if there is an error
  }
};

export default transaction;
