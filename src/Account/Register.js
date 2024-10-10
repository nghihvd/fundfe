import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/register.scss";
import { toast } from "react-toastify";
import api from "../services/axios";
import Spinner from "../components/Spinner";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [sex, setSex] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/");
  };

  const isPhoneNumberValid = (phoneNumber) => {
    const regex = /^\d{9,10}$/;
    return regex.test(phoneNumber);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    if (!birthday) newErrors.birthday = "Birthday is required";
    if (!sex) newErrors.sex = "Sex is required";
    if (!address.trim()) newErrors.address = "Address is required";
    if (!phoneNumber) newErrors.phoneNumber = "Phone number is required";
    else if (!isPhoneNumberValid(phoneNumber))
      newErrors.phoneNumber = "Invalid phone number! Must be 9-10 digits.";
    if (!username.trim()) newErrors.username = "Username is required";
    if (!password) newErrors.password = "Password is required";
    if (!confirmPassword)
      newErrors.confirmPassword = "Confirm password is required";
    else if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!role) newErrors.role = "Role is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    try {
      const userData = {
        name: fullName,
        birthdate: birthday,
        sex,
        address,
        phone: phoneNumber,
        accountID: username,
        password,
        roleID: role === "Staff" ? 2 : 3,
      };

      const checkUsername = await api.get(`accounts/search/${username}`);
      if (checkUsername.data && checkUsername) {
        toast.error("Username already exists!");
        return;
      }

      await api.post("/accounts/register", userData);
      if (role === "Staff") {
        toast.success(
          "Registration successful! Please wait for admin approval."
        );
      } else {
        toast.success("Registered successfully!");
      }
      navigate("/login");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="register-container col-12 col-sm-6 mx-auto">
      <div className="title">Register</div>

      <div className="form-group">
        {errors.fullName && (
          <div className="invalid-feedback">{errors.fullName}</div>
        )}
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
        />
      </div>

      <div className="form-group">
        {errors.birthday && (
          <div className="invalid-feedback">{errors.birthday}</div>
        )}
        <input
          type="date"
          placeholder="Birthday"
          value={birthday}
          onChange={(event) => setBirthday(event.target.value)}
          className={`form-control ${errors.birthday ? "is-invalid" : ""}`}
        />
      </div>

      <div className="form-group">
        {errors.sex && <div className="invalid-feedback">{errors.sex}</div>}
        <select
          value={sex}
          onChange={(event) => setSex(event.target.value)}
          className={`form-control ${errors.sex ? "is-invalid" : ""}`}
        >
          <option value="">Select Sex</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      <div className="form-group">
        {errors.address && (
          <div className="invalid-feedback">{errors.address}</div>
        )}
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          className={`form-control ${errors.address ? "is-invalid" : ""}`}
        />
      </div>

      <div className="form-group">
        {errors.phoneNumber && (
          <div className="invalid-feedback">{errors.phoneNumber}</div>
        )}
        <input
          type="tel"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
          className={`form-control ${errors.phoneNumber ? "is-invalid" : ""}`}
        />
      </div>

      <div className="form-group">
        {errors.username && (
          <div className="invalid-feedback">{errors.username}</div>
        )}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className={`form-control ${errors.username ? "is-invalid" : ""}`}
        />
      </div>

      <div className="form-group">
        {errors.password && (
          <div className="invalid-feedback">{errors.password}</div>
        )}
        <div className="input-password">
          <input
            type={isShowPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setIsShowPassword(!isShowPassword)}
            aria-label={isShowPassword ? "Hide password" : "Show password"}
          >
            <i
              className={
                isShowPassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"
              }
            ></i>
          </button>
        </div>
      </div>

      <div className="form-group">
        {errors.confirmPassword && (
          <div className="invalid-feedback">{errors.confirmPassword}</div>
        )}
        <div className="input-password">
          <input
            type={isShowConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className={`form-control ${
              errors.confirmPassword ? "is-invalid" : ""
            }`}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
            aria-label={
              isShowConfirmPassword ? "Hide password" : "Show password"
            }
          >
            <i
              className={
                isShowConfirmPassword
                  ? "fa-solid fa-eye"
                  : "fa-solid fa-eye-slash"
              }
            ></i>
          </button>
        </div>
      </div>

      <div className="form-group">
        {errors.role && <div className="invalid-feedback">{errors.role}</div>}
        <select
          value={role}
          onChange={(event) => setRole(event.target.value)}
          className={`form-control ${errors.role ? "is-invalid" : ""}`}
        >
          <option value="">Select Role</option>
          <option value="Staff">Staff</option>
          <option value="Customer">Customer</option>
        </select>
      </div>

      <div className="button-containerR">
        <div className="backRegister" onClick={handleGoBack}>
          <i className="fa-solid fa-angles-left"></i>
          <span>Go back</span>
        </div>
        <button onClick={handleRegister} className="register-button">
          Register
        </button>
      </div>
    </div>
  );
};

export default Register;
