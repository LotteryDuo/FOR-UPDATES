const fetchDraw = async () => {
  try {
    const response = await fetch("http://localhost:1000/v1/draw/latest");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Draw data:", data);
    return data;
  } catch (err) {
    console.error("Error fetching draw:", err);
  }
};

// Call the function
fetchDraw();
