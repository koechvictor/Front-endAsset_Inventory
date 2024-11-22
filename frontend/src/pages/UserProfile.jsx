import React, { useState, useEffect } from "react";
import { fetchProfile } from "../services/api";
import Logout from "./Logout";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getProfile = async () => {
      const data = await fetchProfile();
      if (data.message) {
        setMessage(data.message);
      } else {
        setProfile(data.user);
      }
    };
    getProfile();
  }, []);

  return (
    <div>
      <h2>Profile</h2>
      {message && <p>{message}</p>}
      {profile && (
        <div>
          <h3>{profile.username}</h3>
          <p>Email: {profile.email}</p>
          <p>Department: {profile.department}</p>
          <p>Role: {profile.role}</p>
          <p>Created At: {profile.created_at}</p>
        </div>
      )}
      <Logout />
    </div>
  );
}

export default Profile;
