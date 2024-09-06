// src/styles/globalStyles.js
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Arial', sans-serif;
  }

  body {
    background-color: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.text};
  }

  .container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100vw;
    background-color: ${(props) => props.theme.colors.background};
  }

  .navbar {
    background-color: ${(props) => props.theme.colors.navbarBackground};
    padding: 1rem 2rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }

  .navbar .logo {
    font-size: 1.5rem;
    color: ${(props) => props.theme.colors.navbarText};
    font-weight: 700;
  }

  .nav-link {
    color: ${(props) => props.theme.colors.navbarText};
    text-decoration: none;
    padding: 0.75rem 1.25rem;
    border-radius: 4px;
    font-weight: 500;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  .nav-link:hover {
    background-color: ${(props) => props.theme.colors.primary};
    color: #fff;
  }

  .main-content {
    flex: 1;
    padding: 2rem;
    background-color: ${(props) => props.theme.colors.formBackground};
    width: 100%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    margin: 1rem;
  }

  form {
    max-width: 500px;
    margin: 0 auto;
    padding: 2rem;
    background-color: ${(props) => props.theme.colors.formBackground};
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  form h2 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    color: ${(props) => props.theme.colors.formText};
    text-align: center;
  }

  form div {
    margin-bottom: 1rem;
  }

  form label {
    display: block;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  form input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }

  form button {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    color: #fff;
    background-color: ${(props) => props.theme.colors.buttonBackground};
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
  }

  form button:hover {
    background-color: ${(props) => props.theme.colors.buttonHover};
  }

  form button:active {
    transform: scale(0.98);
  }

  form p {
    text-align: center;
    color: ${(props) => props.theme.colors.errorText};
    font-weight: 500;
  }

  @media (max-width: 768px) {
    .navbar {
      flex-direction: column;
      padding: 1rem;
    }

    .nav-link {
      padding: 0.5rem 1rem;
    }

    .main-content {
      margin: 0;
    }
  }
`;

export default GlobalStyle;
