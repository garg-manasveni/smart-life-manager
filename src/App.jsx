import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import "./App.css";

// Context
import { LifeProvider } from "./context/LifeContext";

// Layout
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

// Pages
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Goals from "./pages/Goals";
import Habits from "./pages/Habits";
import Schedule from "./pages/Schedule";
import Notes from "./pages/Notes";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";


function App() {
  // --------------------------------------------------
  // SIDEBAR STATE
  // --------------------------------------------------

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // --------------------------------------------------
  // THEME STATE
  // --------------------------------------------------

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("smart-life-theme");

    if (savedTheme) {
      return savedTheme;
    }

    return "light";
  });

  // --------------------------------------------------
  // APPLY THEME
  // --------------------------------------------------

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    localStorage.setItem("smart-life-theme", theme);
  }, [theme]);

  // --------------------------------------------------
  // TOGGLE THEME
  // --------------------------------------------------

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === "light" ? "dark" : "light"
    );
  };

  // --------------------------------------------------
  // CLOSE SIDEBAR
  // --------------------------------------------------

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // --------------------------------------------------
  // OPEN SIDEBAR
  // --------------------------------------------------

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  return (
    <LifeProvider>
      <BrowserRouter>
        <div className="app">

          {/* ==========================================
              SIDEBAR
          ========================================== */}

          <Sidebar
            isOpen={sidebarOpen}
            onClose={closeSidebar}
          />

          {/* ==========================================
              MAIN APPLICATION AREA
          ========================================== */}

          <div className="app-main">

            {/* ========================================
                HEADER
            ======================================== */}

            <Header
              onMenuClick={openSidebar}
              theme={theme}
              onToggleTheme={toggleTheme}
            />

            {/* ========================================
                PAGE CONTENT
            ======================================== */}

            <main className="app-content">

              <Routes>

                {/* ------------------------------------
                    DASHBOARD
                ------------------------------------ */}

                <Route
                  path="/"
                  element={<Dashboard />}
                />

                <Route
                  path="/dashboard"
                  element={<Dashboard />}
                />

                {/* ------------------------------------
                    TASKS
                ------------------------------------ */}

                <Route
                  path="/tasks"
                  element={<Tasks />}
                />

                {/* ------------------------------------
                    GOALS
                ------------------------------------ */}

                <Route
                  path="/goals"
                  element={<Goals />}
                />

                {/* ------------------------------------
                    HABITS
                ------------------------------------ */}

                <Route
                  path="/habits"
                  element={<Habits />}
                />

                {/* ------------------------------------
                    SCHEDULE
                ------------------------------------ */}

                <Route
                  path="/schedule"
                  element={<Schedule />}
                />

                {/* ------------------------------------
                    NOTES
                ------------------------------------ */}

                <Route
                  path="/notes"
                  element={<Notes />}
                />

                {/* ------------------------------------
                    ANALYTICS
                ------------------------------------ */}

                <Route
                  path="/analytics"
                  element={<Analytics />}
                />

                {/* ------------------------------------
                    SETTINGS
                ------------------------------------ */}

                <Route
                  path="/settings"
                  element={
                    <Settings
                      theme={theme}
                      onThemeChange={setTheme}
                    />
                  }
                />

                {/* ------------------------------------
                    UNKNOWN URL
                    Redirect back to dashboard
                ------------------------------------ */}

                <Route
                  path="*"
                  element={
                    <Navigate
                      to="/"
                      replace
                    />
                  }
                />

              </Routes>

            </main>
          </div>

          {/* ==========================================
              MOBILE SIDEBAR OVERLAY
          ========================================== */}

          {sidebarOpen && (
            <div
              className="sidebar-overlay"
              onClick={closeSidebar}
              aria-hidden="true"
            />
          )}

        </div>
      </BrowserRouter>
    </LifeProvider>
  );
}

export default App;