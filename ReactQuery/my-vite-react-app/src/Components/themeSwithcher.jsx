// src/components/ThemeSwitcher.js
import React from "react";
import styled from "styled-components";

const SwitchButton = styled.button`
  background: ${(props) => props.theme.colors.primary};
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: ${(props) => props.theme.colors.primaryDark};
  }
`;

const ThemeSwitcher = ({ toggleTheme }) => (
  <SwitchButton onClick={toggleTheme}>Toggle Theme</SwitchButton>
);

export default ThemeSwitcher;
