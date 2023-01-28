import React from "react";
import { Outlet } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// components
import NavBar from "../components/navbar/NavBar";
import LeftBar from "../components/leftbar/LeftBar";
import RightBar from "../components/rightbar/RightBar";

// style
import "./style.scss";
import { DarkMode } from "../context/darkModeContext";

// Create a client
const queryClient = new QueryClient();

const RootLayout = () => {
  const { darkMode } = DarkMode();
  return (
    <QueryClientProvider client={queryClient}>
      <div className={`theme-${darkMode ? "dark" : "light"}`}>
        <NavBar />
        <main className="main">
          <LeftBar />
          <div className="main-container">
            <Outlet />
          </div>
          <RightBar />
        </main>
      </div>
    </QueryClientProvider>
  );
};

export default RootLayout;
