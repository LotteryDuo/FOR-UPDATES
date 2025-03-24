// const API = process.env.VITE_API_URL;

const fetchWinners = async () => {
  try {
    const response = await fetch(`http://localhost:1000/v1/draw/winners`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apikey: "hello",
      },
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();

    return data?.result;
  } catch (err) {
    console.error("Error fetching draw:", err);
  }
};

export default fetchWinners;
