import axios from "axios";

const API = process.env.VITE_API_URL;
const API_KEY = process.env.VITE_API_KEY;

const startDraw = async () => {
  try {
    const response = await axios.post(
      "http://localhost:1000/v1/draw/",
      {}, // ✅ Empty body if no request payload is needed
      {
        headers: {
          "Content-Type": "application/json",
          apikey: "hello",
        },
      }
    );

    console.log("🎰 Draw Response:", response.data);

    if (response.status !== 200) {
      throw new Error("Failed to start draw");
    }

    return response.data; // ✅ Return fetched data
  } catch (err) {
    console.error(
      "🚨 Error starting draw:",
      err.response ? err.response.data : err.message
    );
    return null; // ✅ Return `null` instead of undefined
  }
};

const fetchUserBetStatusByDraw = async (status) => {
  try {
    const response = await axios.get(
      `http://localhost:1000/v1/draw/bettor/${status}`,
      {
        headers: {
          "Content-Type": "application/json",
          apikey: `hello`,
        },
      }
    );

    console.log(response.data.data);
    if (response.status !== 200) throw new Error("Failed to fetch winners");
    return response.data || []; // ✅ Return fetched data instead of using useState
  } catch (err) {
    console.error("Error fetching draw:", err);
  }
};

const fetchDrawData = async () => {
  try {
    const response = await axios.get(`http://localhost:1000/v1/draw/latest`, {
      headers: {
        "Content-Type": "application/json",
        apikey: `hello`,
      },
    });

    if (response.status !== 200) {
      throw new Error(response.message || "Failed to fetch account data");
    }

    return response; // ✅ Return fetched data instead of using useState
  } catch (err) {
    console.error("Fetch error:", err.message);
    return null; // ✅ Return `null` if there is an error
  }
};

export { startDraw, fetchUserBetStatusByDraw, fetchDrawData };
