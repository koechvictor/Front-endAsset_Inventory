import React, { useState } from "react";
import { loginUser } from "../services/api";
import styles from "./Login.module.css";
import { Link, useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const credentials = { email, password };
    const data = await loginUser(credentials);

    if (data.message) {
      setMessage(data.message);
    } else {
      setMessage("Login successful!");
      onLogin(data.user_id);

      const navigate = useNavigate();

      if (data.role === "admin") {
        navigate("/admin-dashboard");
      } else if (data.role === "manager") {
        navigate("/manager-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    }
  };

  return (
    <div className={styles["login-container"]}>
      <div className={styles.wrapper}>
        <div className={`${styles["form-wrapper"]} ${styles["sign-in"]}`}>
          <form onSubmit={handleSubmit}>
            <h1 className={styles["main-title"]}>Asset Maze</h1>
            <h2>Login</h2>
            {message && <p>{message}</p>}
            <div className={styles["input-group"]}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label>Email</label>
            </div>
            <div className={styles["input-group"]}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label>Password</label>
            </div>
            <div className={styles.rememder}>
              <label>
                <input type="checkbox" /> Remember me
              </label>
            </div>
            <button type="submit" className={styles["login-button"]}>
              Login
            </button>
            {message && <div>{message}</div>}
            <div className={styles["signup-link"]}>
              <p>
                Don't have an account?{" "}
                <Link to="/signup" className={styles["signupbtn-link"]}>
                  Sign up
                </Link>
              </p>
            </div>
            <Link to="/" className={styles["home-button"]}>
              Back to Home
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
