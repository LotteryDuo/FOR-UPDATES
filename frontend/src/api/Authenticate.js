import axios from "axios";

const Login = async (username, password, navigate, setAlert) => {
  if (!username || !password) {
    setAlert({ type: "error", message: "Email or password is missing!" });
    return;
  }

  try {
    const response = await axios.post(
      `http://localhost:1000/v1/account/login`,
      { username, PASSWORD: password }, // ✅ Fix: Changed PASSWORD → password
      {
        headers: {
          "Content-Type": "application/json",
          apikey: "hello",
        },
      }
    );

    const res = response.data;

    if (res) {
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user_id", res.data.user_id);

      console.log(localStorage.getItem("user_id"));
      navigate("/home");
    } else {
      setAlert({ type: "error", message: "Incorrect Username or Password" });
    }
  } catch (err) {
    console.error("Login Error:", err.response?.data?.message || err.message);
    setAlert({ type: "error", message: "Login failed. Please try again." });
  }
};

const CreateAccount = async (username, password, email, navigate, setAlert) => {
  if (!username || !password || !email) {
    setAlert({ type: "error", message: "All fields are required!" });
    return;
  }

  try {
    const response = await axios.post(
      `http://localhost:1000/v1/account/signup`,
      { username, password, email }, // ✅ Ensure backend expects these fields
      {
        headers: {
          "Content-Type": "application/json",
          apikey: "hello",
        },
      }
    );

    const res = response.data;

    if (res.success) {
      setAlert({ type: "success", message: "Account created successfully!" });
      navigate("/login");
    } else {
      setAlert({ type: "error", message: res.message || "Signup failed" });
    }
  } catch (err) {
    console.error("Signup Error:", err.response?.data?.message || err.message);
    setAlert({ type: "error", message: "Signup failed. Please try again." });
  }
};

export { Login, CreateAccount };
