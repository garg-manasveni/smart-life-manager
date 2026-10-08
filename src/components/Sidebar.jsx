import {
    LayoutDashboard,
    CheckSquare,
    Target,
    Repeat2,
    CalendarDays,
    StickyNote,
    BarChart3,
    Settings,
    X,
    Sparkles,
    ChevronRight,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import { useLife } from "../context/LifeContext";


// ======================================================
// NAVIGATION ITEMS
// ======================================================

const navigationItems = [
    {
        name: "Dashboard",
        path: "/",
        icon: LayoutDashboard,
    },
    {
        name: "Tasks",
        path: "/tasks",
        icon: CheckSquare,
    },
    {
        name: "Goals",
        path: "/goals",
        icon: Target,
    },
    {
        name: "Habits",
        path: "/habits",
        icon: Repeat2,
    },
    {
        name: "Schedule",
        path: "/schedule",
        icon: CalendarDays,
    },
    {
        name: "Notes",
        path: "/notes",
        icon: StickyNote,
    },
    {
        name: "Analytics",
        path: "/analytics",
        icon: BarChart3,
    },
];


// ======================================================
// SIDEBAR COMPONENT
// ======================================================

function Sidebar({ isOpen, onClose }) {

    // Get dashboard statistics from global context
    const { statistics } = useLife();


    // ====================================================
    // NAVIGATION LINK CLASS
    // ====================================================

    const getNavLinkClass = ({ isActive }) => {
        return `sidebar-link ${isActive ? "active" : ""}`;
    };


    // ====================================================
    // CLOSE MOBILE SIDEBAR
    // ====================================================

    const handleNavigation = () => {
        if (onClose) {
            onClose();
        }
    };


    return (
        <aside
            className={`sidebar ${isOpen ? "sidebar-open" : ""
                }`}
        >

            {/* ================================================
          SIDEBAR HEADER
      ================================================ */}

            <div className="sidebar-header">

                <NavLink
                    to="/"
                    className="sidebar-brand"
                    onClick={handleNavigation}
                >

                    <div className="brand-icon">
                        <Sparkles size={20} strokeWidth={2.2} />
                    </div>

                    <div className="brand-text">
                        <span className="brand-title">
                            Smart Life
                        </span>

                        <span className="brand-subtitle">
                            Manager
                        </span>
                    </div>

                </NavLink>


                {/* Mobile close button */}

                <button
                    className="sidebar-close"
                    onClick={onClose}
                    aria-label="Close sidebar"
                >
                    <X size={20} />
                </button>

            </div>


            {/* ================================================
          QUICK OVERVIEW
      ================================================ */}

            <div className="sidebar-overview">

                <div className="sidebar-overview-label">
                    AT A GLANCE
                </div>

                <div className="sidebar-mini-stats">

                    <div className="sidebar-mini-stat">

                        <span className="sidebar-mini-value">
                            {statistics.completedTasks}
                        </span>

                        <span className="sidebar-mini-label">
                            Done
                        </span>

                    </div>


                    <div className="sidebar-mini-divider" />


                    <div className="sidebar-mini-stat">

                        <span className="sidebar-mini-value">
                            {statistics.pendingTasks}
                        </span>

                        <span className="sidebar-mini-label">
                            Pending
                        </span>

                    </div>


                    <div className="sidebar-mini-divider" />


                    <div className="sidebar-mini-stat">

                        <span className="sidebar-mini-value">
                            {statistics.completedHabitsToday}
                        </span>

                        <span className="sidebar-mini-label">
                            Habits
                        </span>

                    </div>

                </div>

            </div>


            {/* ================================================
          MAIN NAVIGATION
      ================================================ */}

            <nav className="sidebar-nav">

                <div className="sidebar-section-title">
                    WORKSPACE
                </div>


                {navigationItems.map((item) => {

                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === "/"}
                            className={getNavLinkClass}
                            onClick={handleNavigation}
                        >

                            <span className="sidebar-link-icon">
                                <Icon
                                    size={19}
                                    strokeWidth={2}
                                />
                            </span>

                            <span className="sidebar-link-text">
                                {item.name}
                            </span>

                            <ChevronRight
                                className="sidebar-link-arrow"
                                size={15}
                                strokeWidth={2}
                            />

                        </NavLink>
                    );

                })}

            </nav>


            {/* ================================================
          PRODUCTIVITY SUMMARY
      ================================================ */}

            <div className="sidebar-productivity">

                <div className="sidebar-productivity-header">

                    <div className="sidebar-productivity-icon">
                        <Target size={16} />
                    </div>

                    <span>
                        Goal Progress
                    </span>

                </div>


                <div className="sidebar-progress">

                    <div className="sidebar-progress-track">

                        <div
                            className="sidebar-progress-fill"
                            style={{
                                width: `${statistics.averageGoalProgress}%`,
                            }}
                        />

                    </div>


                    <span className="sidebar-progress-value">
                        {statistics.averageGoalProgress}%
                    </span>

                </div>


                <p className="sidebar-productivity-text">
                    Keep going! Small steps create big results.
                </p>

            </div>


            {/* ================================================
          BOTTOM NAVIGATION
      ================================================ */}

            <div className="sidebar-bottom">

                <NavLink
                    to="/settings"
                    className={getNavLinkClass}
                    onClick={handleNavigation}
                >

                    <span className="sidebar-link-icon">
                        <Settings
                            size={19}
                            strokeWidth={2}
                        />
                    </span>

                    <span className="sidebar-link-text">
                        Settings
                    </span>

                    <ChevronRight
                        className="sidebar-link-arrow"
                        size={15}
                        strokeWidth={2}
                    />

                </NavLink>


                {/* ==============================================
            PROFILE CARD
        ============================================== */}

                <div className="sidebar-profile">

                    <div className="profile-avatar">
                        M
                    </div>

                    <div className="profile-info">

                        <span className="profile-name">
                            Manasveni
                        </span>

                        <span className="profile-status">
                            Personal workspace
                        </span>

                    </div>

                </div>

            </div>

        </aside>
    );
}


export default Sidebar;