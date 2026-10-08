import {
    Menu,
    Search,
    CheckSquare,
    Sun,
    Moon,
    Plus,
    ChevronDown,
    CalendarDays,
} from "lucide-react";

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useLife } from "../context/LifeContext";


// ======================================================
// PAGE INFORMATION
// ======================================================

const pageInformation = {
    "/": {
        title: "Dashboard",
        subtitle: "A calm space to organize your day.",
    },

    "/dashboard": {
        title: "Dashboard",
        subtitle: "A calm space to organize your day.",
    },

    "/tasks": {
        title: "Tasks",
        subtitle: "Stay on top of everything you need to do.",
    },

    "/goals": {
        title: "Goals",
        subtitle: "Turn your ideas into meaningful progress.",
    },

    "/habits": {
        title: "Habits",
        subtitle: "Build routines that make your days better.",
    },

    "/schedule": {
        title: "Schedule",
        subtitle: "Plan your time and make every hour count.",
    },

    "/notes": {
        title: "Notes",
        subtitle: "Capture thoughts, ideas and important information.",
    },

    "/analytics": {
        title: "Analytics",
        subtitle: "Understand your productivity and progress.",
    },

    "/settings": {
        title: "Settings",
        subtitle: "Customize your Smart Life Manager experience.",
    },
};


// ======================================================
// HEADER COMPONENT
// ======================================================

function Header({
    onMenuClick,
    theme,
    onToggleTheme,
}) {

    // ----------------------------------------------------
    // ROUTER
    // ----------------------------------------------------

    const location = useLocation();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const taskRouteSearch = location.pathname === "/tasks"
        ? new URLSearchParams(location.search).get("search") || ""
        : null;
    const visibleSearchQuery = taskRouteSearch ?? searchQuery;


    // ----------------------------------------------------
    // GLOBAL DATA
    // ----------------------------------------------------

    const {
        statistics,
    } = useLife();


    // ----------------------------------------------------
    // CURRENT PAGE
    // ----------------------------------------------------

    const currentPage =
        pageInformation[location.pathname] ||
        pageInformation["/"];


    // ----------------------------------------------------
    // CURRENT DATE
    // ----------------------------------------------------

    const today = new Date();

    const formattedDate =
        today.toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "short",
            year: "numeric",
        });


    // ----------------------------------------------------
    // GO TO TASKS
    // ----------------------------------------------------

    const handleAddTask = () => {
        navigate("/tasks");
    };


    // ----------------------------------------------------
    // SEARCH TASKS
    // ----------------------------------------------------

    const handleSearch = (event) => {
        event.preventDefault();

        const query = visibleSearchQuery.trim();

        navigate({
            pathname: "/tasks",
            search: query
                ? `?search=${encodeURIComponent(query)}`
                : "",
        });
    };

    const handleSearchChange = (value) => {
        setSearchQuery(value);

        if (location.pathname === "/tasks") {
            const query = value.trim();

            navigate({
                pathname: "/tasks",
                search: query
                    ? `?search=${encodeURIComponent(query)}`
                    : "",
            }, { replace: true });
        }
    };


    // ----------------------------------------------------
    // OPEN TASKS
    // ----------------------------------------------------

    const handleOpenTasks = () => navigate("/tasks");


    return (
        <header className="app-header">

            {/* ================================================
          LEFT SIDE
      ================================================ */}

            <div className="header-left">

                {/* Mobile menu button */}

                <button
                    className="mobile-menu-button"
                    onClick={onMenuClick}
                    aria-label="Open navigation menu"
                >
                    <Menu size={22} />
                </button>


                {/* Page heading */}

                <div className="header-page-info">

                    <h1 className="header-title">
                        {currentPage.title}
                    </h1>

                    <p className="header-subtitle">
                        {currentPage.subtitle}
                    </p>

                </div>

            </div>


            {/* ================================================
          RIGHT SIDE
      ================================================ */}

            <div className="header-right">

                {/* ==============================================
            DATE
        ============================================== */}

                <div className="header-date">

                    <CalendarDays size={16} />

                    <span>
                        {formattedDate}
                    </span>

                </div>


                {/* ==============================================
            SEARCH
        ============================================== */}

                <form
                    className="header-search"
                    role="search"
                    onSubmit={handleSearch}
                >

                    <Search
                        className="header-search-icon"
                        size={18}
                    />

                    <input
                        type="text"
                        placeholder="Search tasks..."
                        className="header-search-input"
                        aria-label="Search tasks"
                        value={visibleSearchQuery}
                        onChange={(event) =>
                            handleSearchChange(event.target.value)
                        }
                    />
                </form>


                {/* ==============================================
            QUICK ADD
        ============================================== */}

                <button
                    className="header-add-button"
                    onClick={handleAddTask}
                    title="Add a task"
                >
                    <Plus size={18} />

                    <span>
                        Add
                    </span>
                </button>


                {/* ==============================================
            NOTIFICATIONS
        ============================================== */}

                <button
                    className="header-icon-button notification-button"
                    onClick={handleOpenTasks}
                    aria-label="View tasks"
                    title="View your tasks"
                >

                    <CheckSquare size={19} />

                    {statistics.pendingTasks > 0 && (
                        <span className="notification-dot">
                            {statistics.pendingTasks > 9
                                ? "9+"
                                : statistics.pendingTasks}
                        </span>
                    )}

                </button>


                {/* ==============================================
            THEME TOGGLE
        ============================================== */}

                <button
                    className="header-icon-button theme-button"
                    onClick={onToggleTheme}
                    aria-label="Toggle theme"
                    title={
                        theme === "light"
                            ? "Switch to dark mode"
                            : "Switch to light mode"
                    }
                >

                    {theme === "light" ? (
                        <Moon size={19} />
                    ) : (
                        <Sun size={19} />
                    )}

                </button>


                {/* ==============================================
            PROFILE
        ============================================== */}

                <button
                    className="header-profile"
                    onClick={() => navigate("/settings")}
                    title="Open settings"
                >

                    <div className="header-avatar">
                        M
                    </div>

                    <div className="header-profile-info">

                        <span className="header-profile-name">
                            Manasveni
                        </span>

                        <span className="header-profile-role">
                            Personal workspace
                        </span>

                    </div>

                    <ChevronDown
                        size={15}
                        className="header-profile-arrow"
                    />

                </button>

            </div>

        </header>
    );
}


export default Header;