import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axios";
import { toast } from "react-toastify";

const ProfileUser = () => {
  const [userInfo, setUserInfo] = useState({
    accountID: "",
    name: "",
    email: "",
    // Thêm các trường khác nếu cần
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.get(
          `accounts/search/${localStorage.getItem("accountID")}`
        );
        setUserInfo(response.data);
      } catch (error) {
        toast.error("Failed to fetch user information");
      }
    };

    fetchUserInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`accounts/update/${userInfo.password}`, userInfo);
      toast.success("User information updated successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to update user information");
    }
  };

  return (
    <div className="profile-user-container">
      <h2>Profile User</h2>
      <form onSubmit={handleUpdate}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={userInfo.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={userInfo.email}
            onChange={handleChange}
            required
          />
        </div>
        {/* Thêm các trường khác nếu cần */}
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default ProfileUser;
