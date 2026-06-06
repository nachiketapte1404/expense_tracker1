import { useState } from "react";
import { loginUser } from "../api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
      e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await loginUser(formData);

      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");

    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Login failed";
      setError(errorMsg);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        <br /><br />

        <button type="submit">
          Login
        </button>

      </form>

      <br />

      <Link to="/register">
        Create Account
      </Link>
    </div>
  );
}

export default Login;