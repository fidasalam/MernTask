// src/Components/Header.js
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../store/slice/authSlice";
import { Link } from "react-router-dom";
import styled from "styled-components";

const StyledButton = styled.button`
  background-color: ${(props) => (props.primary ? "blue" : "green")};
  color: #fff;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
  &:hover {
    background-color: ${(props) => (props.primary ? "darkblue" : "darkgreen")};
  }
`;

const Header = () => {
  const user = useSelector((state) => state.auth.name);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearUser());
  };

  return (
    <header className="header">
      <nav className="navbar">
        <Link to="/" className="nav-link">
          Users Page
        </Link>
        {/* <Link to="/other" className="nav-link">Login Page</Link> */}
        <Link to="/adduser" className="nav-link">
          Sign Up
        </Link>
        {user ? (
          <div className="user-info">
            <span style={{ color: "white" }}>Welcome, {user}</span>
            <br />

            <StyledButton primary onClick={handleLogout}>
              Logout
            </StyledButton>
          </div>
        ) : (
          <Link to="/other" className="nav-link">
            <StyledButton>Login</StyledButton>
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
