import React, { useState, useEffect } from "react";
import "../styles/login.scss";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { toast } from "react-toastify";
import { useNavigate, NavLink } from "react-router-dom";
import api from "../services/axios";
import Spinner from "../components/Spinner";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const roleID = localStorage.getItem("roleID");
    if (isLoggedIn) {
      if (roleID === "2") {
        navigate("/appoinment");
      } else if (roleID === "3") {
        navigate("/");
      } else if (roleID === "1") {
        navigate("/admin");
      }
    }
  }, [navigate]);

  // Handle login action
  const handleLogin = async (event) => {
    event.preventDefault();
    if (!username || !password) {
      toast.error("Username/Password is required!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("accounts/login", {
        accountID: username,
        password,
      });

      if (response && response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("roleID", response.data.roleID);
        localStorage.setItem("name", String(response.data.name));
        localStorage.setItem("accountID", String(response.data.accountID));
        sessionStorage.setItem("accountID",String(response.data.accountID));

        const currentLoginChange =
          localStorage.getItem("loginChange") === "true";
        localStorage.setItem("loginChange", (!currentLoginChange).toString());
        toast.success("Login successful!");
        window.location.reload();
        navigate("/");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        toast.error("Invalid username or password");
      }
    } catch (error) {
      toast.error("Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/");
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="login-container col-12 col-sm-4">
      <form onSubmit={handleLogin}>
        <div className="title">Login</div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <div className="input-password">
          <input
            type={isShowPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <i
            className={
              isShowPassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"
            }
            onClick={() => setIsShowPassword(!isShowPassword)}
          ></i>
        </div>

        <button
          className={`button ${username && password ? "active" : ""}`}
          disabled={!username || !password}
        >
          Login
        </button>

        <div className="action-links">
          <div className="back" onClick={handleGoBack}>
            <i className="fa-solid fa-angles-left"></i>
            <span>Go back</span>
          </div>
          <div className="register">
            <p> Don't have an account?</p>
            <NavLink to="/register" className="register-link">
              Register
            </NavLink>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
