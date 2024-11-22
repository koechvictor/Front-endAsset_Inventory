// src/pages/SignUp.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import styles from "./SignUp.module.css";
import { Link } from "react-router-dom";
import { s } from "maath/dist/misc-19a3ec46.esm";
import { submitNewUser } from "../services/api";

function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, serRole] = useState("");
  const [department_id, setDepartmentId] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const newUser = {
      username: username,
      password: password,
      email: email,
      role: role,
      department_id: department_id,
    };

    try {
      // Assuming the API endpoint for creating a new user is `/Users`
      const response = await submitNewUser(newUser);
      if (response.message) {
        alert(response.message);
        return;
      } else {
        alert("User created successfully");
        navigate("/admin-dashboard");
      }
    } catch (error) {
      console.error("Sign-up failed:", error);
      alert("An error occurred while trying to sign up.");
    }
  };

  return (
    <div className={styles["signup-container"]}>
      <div className={styles.wrapper}>
        <div className={styles["form-wrapper"]}>
          <form onSubmit={handleSignUp}>
            <h1 className={styles["main-title"]}>Asset Maze</h1>
            <h2>Add New User</h2>
            <div className={styles["input-group"]}>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <label>Username</label>
            </div>

            <div className={styles["input-group"]}>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label>Email</label>
            </div>

            <div className={styles["input-group"]}>
              <select value={role} onChange={(e) => serRole(e.target.value)}>
                <option>Admin</option>
                <option>Manager</option>
                <option>Employee</option>
                <option>Normal Member</option>
              </select>

              <label>Role</label>
            </div>

            <div className={styles["input-group"]}>
              <select
                value={department_id}
                onChange={(e) => setDepartmentId(e.target.value)}
              >
                <option value="1">HR Department</option>
                <option value="2">IT Department</option>
                <option value="3">Finance Department</option>
                <option value="4">Marketing Department</option>
                <option value="5">Sales Department</option>
                <option value="6">Operations Department</option>
                <option value="7">Support Department</option>
                <option value="8">Legal Department</option>
                <option value="9">R&D Department</option>
                <option value="10">Customer Success Department</option>
              </select>
            </div>

            <div className={styles["input-group"]}>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label>Password</label>
            </div>

            <div className={styles["input-group"]}>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <label>Confirm Password</label>
            </div>

            <button type="submit" className={styles["signup-button"]}>
              Create User
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
