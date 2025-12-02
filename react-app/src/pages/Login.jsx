import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "./Login.css"

function Login({ setUserID, setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/database/login", {
        username,
        password
      });

      setIsLoggedIn(true);
      setUserID(response.data.userID);
      navigate('/profile');

    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.error);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  const handleSignUpRedirect = () => {
    navigate('/signup');
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <form onSubmit={handleLogin} id="loginForm">
        <input
          type="text"
          placeholder="Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Login</button>
      </form>
      <p className="redirect">
        <span onClick={handleSignUpRedirect} className="link">Don't have an account? Sign Up!</span>
      </p>
    </div>
  );
}

export default Login;