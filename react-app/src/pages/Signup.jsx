import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])(?=.{8,})\S*$/;

  const handleSignUp = async (event) => {
    event.preventDefault();
    setError("");

    if (!strongPasswordRegex.test(password)) {
      setError("Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character, and contain no spaces.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/database/signup", {
        email,
        password
      });

      if (response.status === 200) {
        navigate('/login');

      } else {
        setError(response.data.error || "Something went wrong.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSignUp} id="loginForm">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Sign Up</button>
      </form>
      <p className="redirect">
        <span onClick={handleLoginRedirect} className="link">Already have an account? Login!</span>
      </p>
    </div>
  );
}

export default SignUp;