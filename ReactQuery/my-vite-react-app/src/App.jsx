// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "styled-components";
import GlobalStyle from "./styles/globalStyles";
import ThemeSwitcher from "./Components/themeSwithcher";
import { lightTheme, darkTheme } from "./theme/theme";

import Header from "./Components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
// import UsersPage from "./Components/UserPage";
// import OtherPage from "./Components/OtherPage";
// import AddUserPage from "./Components/AddUserPage";

const UsersPage = lazy(() => import("./Components/UserPage"));
const OtherPage = lazy(() => import("./Components/OtherPage"));
const AddUserPage = lazy(() => import("./Components/AddUserPage"));

// import './App.css';

const queryClient = new QueryClient();

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <GlobalStyle />
        <Router>
          <div className="container">
            <Header />
            <ThemeSwitcher toggleTheme={toggleTheme} />
            <main className="main-content">
              <Suspense fallback={<div>
                Loading......
              </div>}>
              <Routes>
                <Route path="/" element={<UsersPage />} />
                <Route path="/other" element={<OtherPage />} />
                <Route path="/adduser" element={<AddUserPage />} />
              </Routes>
              </Suspense>
            </main>
          </div>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
