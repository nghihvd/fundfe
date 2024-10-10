import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import logoApp from "../assets/images/logo.png";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import "../styles/header.scss";
import { useState, useEffect } from "react";
import Notification from "../Notifications/Notification";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [roleID, setRoleID] = useState(null);
  const [username, setUserName] = useState(null);

  const name = localStorage.getItem("name");
  const loggedIn = localStorage.getItem("isLoggedIn") === "true";

  useEffect(() => {
    const role = Number(localStorage.getItem("roleID"));
    setUserName(name);
    setIsLoggedIn(loggedIn);
    setRoleID(role);
  }, [name, loggedIn]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.removeItem("accountID");
    setIsLoggedIn(false);
    setRoleID(null);
    navigate("/");
  };

  const renderNavLinks = () => {
    return (
      <>
        {(!isLoggedIn || roleID === 3) && (
          <>
            <NavLink to="/" className="nav-link">
              <h3>Home</h3>
            </NavLink>
            <NavLink to="/petlist" className="nav-link">
              <h3>Adopt</h3>
            </NavLink>
            <NavLink to="/contact" className="nav-link">
              <h3>Contact</h3>
            </NavLink>
          </>
        )}
        <NavLink to="/events" className="nav-link">
          <h3>Events</h3>
        </NavLink>
        <NavLink to="/donate" className="nav-link">
          <h3>Donate</h3>
        </NavLink>
        {isLoggedIn && roleID === 1 && (
          <>
            <NavLink to="/admin" className="nav-link">
              <h3>Admin</h3>
            </NavLink>
            <NavDropdown title="Request" id="admin-notification-dropdown">
              <NavDropdown.Item as={NavLink} to="/admin-notifications/add-pet">
                Add Pet
              </NavDropdown.Item>
              <NavDropdown.Item
                as={NavLink}
                to="/admin-notifications/request-register"
              >
                Request Register
              </NavDropdown.Item>
              <NavDropdown.Item
                as={NavLink}
                to="/admin-notifications/ban-request"
              >
                Ban Request
              </NavDropdown.Item>
            </NavDropdown>
          </>
        )}
        {isLoggedIn && roleID === 2 && (
          <>
            <NavLink to="/petlist" className="nav-link">
              <h3>Pet List</h3>
            </NavLink>
            {/* <NavLink to="/staff" className="nav-link">
              <h3>Staff</h3>
            </NavLink> */}
            <NavLink to="/appointment" className="nav-link">
              <h3>Appointment</h3>
            </NavLink>
          </>
        )}
        {isLoggedIn && roleID === 1 && (
          <NavDropdown title="Request" id="admin-notification-dropdown">
            <NavDropdown.Item as={NavLink} to="/admin-notifications/add-pet">
              Add Pet
            </NavDropdown.Item>
            <NavDropdown.Item
              as={NavLink}
              to="/admin-notifications/request-register"
            >
              Request Register
            </NavDropdown.Item>
            <NavDropdown.Item
              as={NavLink}
              to="/admin-notifications/ban-request"
            >
              Ban Request
            </NavDropdown.Item>
          </NavDropdown>
        )}
      </>
    );
  };

  return (
    <Navbar expand="lg" className="header">
      {/* Logo */}
      <Navbar.Brand className="logo" href="/">
        <img
          src={logoApp}
          width="45"
          height="45"
          className="d-inline-block align-top"
          alt="FurryFriendsFund logo"
        />
        <p>FurryFriendsFund</p>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        {/* Thanh menu */}
        <Nav className="me-auto" activeKey={location.pathname}>
          {renderNavLinks()}
        </Nav>

        {/* Chỉ hiển thị Notification khi đã đăng nhập */}
        {isLoggedIn && <Notification roleID={roleID?.toString()} />}

        {/* Tên người dùng nếu đã đăng nhập */}
        {isLoggedIn && <h4 className="username">{username}</h4>}

        {/* Đổi đăng nhập và đăng ký thành profile */}
        <Nav className="settings">
          {isLoggedIn ? (
            <NavDropdown
              title={<i className="fa-solid fa-gear"></i>}
              id="basic-nav-dropdown"
            >
              <NavDropdown.Item as={NavLink} to="/profile">
                Profile
              </NavDropdown.Item>
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          ) : (
            <>
              <NavLink to="/login" className="nav-link">
                <h3>Login</h3>
              </NavLink>
              <NavLink to="/register" className="nav-link">
                <h3>Register</h3>
              </NavLink>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
