import { useEffect, useState } from "react";
import {
    Bell,
    Check,
    Database,
    Download,
    Moon,
    Palette,
    RotateCcw,
    Settings as SettingsIcon,
    Shield,
    Sun,
    Trash2,
    User,
} from "lucide-react";

import { useLife } from "../context/LifeContext";

function Settings({ theme, onThemeChange }) {
    const { resetAllData } = useLife();

    const [notifications, setNotifications] = useState(() => {
        const saved = localStorage.getItem(
            "smart-life-notifications"
        );

        return saved !== "false";
    });

    const [dailyReminder, setDailyReminder] = useState(() => {
        const saved = localStorage.getItem(
            "smart-life-daily-reminder"
        );

        return saved !== "false";
    });

    const [compactMode, setCompactMode] = useState(() => {
        const saved = localStorage.getItem(
            "smart-life-compact-mode"
        );

        return saved === "true";
    });

    const [showResetModal, setShowResetModal] = useState(false);
    const [showSavedMessage, setShowSavedMessage] = useState(false);

    useEffect(() => {
        localStorage.setItem(
            "smart-life-notifications",
            notifications
        );
    }, [notifications]);

    useEffect(() => {
        localStorage.setItem(
            "smart-life-daily-reminder",
            dailyReminder
        );
    }, [dailyReminder]);

    useEffect(() => {
        localStorage.setItem(
            "smart-life-compact-mode",
            compactMode
        );
    }, [compactMode]);

    useEffect(() => {
        document.documentElement.setAttribute(
            "data-compact",
            compactMode
        );
    }, [compactMode]);

    const showSaved = () => {
        setShowSavedMessage(true);

        window.setTimeout(() => {
            setShowSavedMessage(false);
        }, 2200);
    };

    const handleThemeChange = (newTheme) => {
        onThemeChange(newTheme);
        showSaved();
    };

    const handleNotificationsChange = () => {
        setNotifications((current) => !current);
        showSaved();
    };

    const handleReminderChange = () => {
        setDailyReminder((current) => !current);
        showSaved();
    };

    const handleCompactModeChange = () => {
        setCompactMode((current) => !current);
        showSaved();
    };

    const handleReset = () => {
        resetAllData();

        setShowResetModal(false);

        setShowSavedMessage(true);

        window.setTimeout(() => {
            setShowSavedMessage(false);
        }, 2200);
    };

    const handleExportData = () => {
        const data = {
            exportedAt: new Date().toISOString(),
            tasks: JSON.parse(
                localStorage.getItem("smart-life-tasks") || "[]"
            ),
            goals: JSON.parse(
                localStorage.getItem("smart-life-goals") || "[]"
            ),
            habits: JSON.parse(
                localStorage.getItem("smart-life-habits") || "[]"
            ),
            schedule: JSON.parse(
                localStorage.getItem("smart-life-schedule") || "[]"
            ),
            notes: JSON.parse(
                localStorage.getItem("smart-life-notes") || "[]"
            ),
        };

        const blob = new Blob(
            [JSON.stringify(data, null, 2)],
            {
                type: "application/json",
            }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = `smart-life-manager-backup-${new Date()
            .toISOString()
            .slice(0, 10)}.json`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        showSaved();
    };

    return (
        <div className="settings-page">
            {/* PAGE INTRO */}

            <section className="page-intro settings-intro">
                <div>
                    <p className="page-eyebrow">
                        <SettingsIcon size={14} />
                        Preferences
                    </p>

                    <h1>Settings</h1>

                    <p>
                        Personalize Smart Life Manager to match the way
                        you work.
                    </p>
                </div>
            </section>

            {/* PROFILE */}

            <section className="settings-section">
                <div className="settings-section-heading">
                    <div className="settings-section-icon purple">
                        <User size={19} />
                    </div>

                    <div>
                        <span className="panel-eyebrow">
                            Personal setup
                        </span>

                        <h2>Profile</h2>
                    </div>
                </div>

                <div className="settings-card profile-settings-card">
                    <div className="settings-profile-avatar">
                        M
                    </div>

                    <div className="settings-profile-info">
                        <h3>Manasveni</h3>

                        <p>
                            Personal life-management workspace
                        </p>

                        <span className="profile-status">
                            <span />
                            Saved on this device
                        </span>
                    </div>
                </div>
            </section>

            {/* APPEARANCE */}

            <section className="settings-section">
                <div className="settings-section-heading">
                    <div className="settings-section-icon lavender">
                        <Palette size={19} />
                    </div>

                    <div>
                        <span className="panel-eyebrow">
                            Interface
                        </span>

                        <h2>Appearance</h2>
                    </div>
                </div>

                <div className="settings-card">
                    <div className="settings-row settings-theme-row">
                        <div className="settings-row-content">
                            <div className="settings-row-icon">
                                <Palette size={18} />
                            </div>

                            <div>
                                <h3>Theme</h3>

                                <p>
                                    Choose how Smart Life Manager looks.
                                </p>
                            </div>
                        </div>

                        <div className="theme-selector">
                            <button
                                type="button"
                                className={
                                    theme === "light"
                                        ? "theme-option active"
                                        : "theme-option"
                                }
                                onClick={() =>
                                    handleThemeChange("light")
                                }
                            >
                                <Sun size={16} />
                                Light

                                {theme === "light" && (
                                    <Check size={14} />
                                )}
                            </button>

                            <button
                                type="button"
                                className={
                                    theme === "dark"
                                        ? "theme-option active"
                                        : "theme-option"
                                }
                                onClick={() =>
                                    handleThemeChange("dark")
                                }
                            >
                                <Moon size={16} />
                                Dark

                                {theme === "dark" && (
                                    <Check size={14} />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="settings-divider" />

                    <div className="settings-row">
                        <div className="settings-row-content">
                            <div className="settings-row-icon">
                                <SettingsIcon size={18} />
                            </div>

                            <div>
                                <h3>Compact mode</h3>

                                <p>
                                    Reduce spacing to fit more information on
                                    screen.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            className={
                                compactMode
                                    ? "settings-toggle active"
                                    : "settings-toggle"
                            }
                            onClick={handleCompactModeChange}
                            aria-label="Toggle compact mode"
                        >
                            <span />
                        </button>
                    </div>
                </div>
            </section>

            {/* NOTIFICATIONS */}

            <section className="settings-section">
                <div className="settings-section-heading">
                    <div className="settings-section-icon rose">
                        <Bell size={19} />
                    </div>

                    <div>
                        <span className="panel-eyebrow">
                            Alerts
                        </span>

                        <h2>Notifications</h2>
                    </div>
                </div>

                <div className="settings-card">
                    <div className="settings-row">
                        <div className="settings-row-content">
                            <div className="settings-row-icon">
                                <Bell size={18} />
                            </div>

                            <div>
                                <h3>Notifications</h3>

                                <p>
                                    Allow productivity reminders and updates.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            className={
                                notifications
                                    ? "settings-toggle active"
                                    : "settings-toggle"
                            }
                            onClick={handleNotificationsChange}
                            aria-label="Toggle notifications"
                        >
                            <span />
                        </button>
                    </div>

                    <div className="settings-divider" />

                    <div className="settings-row">
                        <div className="settings-row-content">
                            <div className="settings-row-icon">
                                <Bell size={18} />
                            </div>

                            <div>
                                <h3>Daily reminder</h3>

                                <p>
                                    Keep a daily reminder for your tasks and
                                    habits.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            disabled={!notifications}
                            className={
                                dailyReminder && notifications
                                    ? "settings-toggle active"
                                    : "settings-toggle"
                            }
                            onClick={handleReminderChange}
                            aria-label="Toggle daily reminder"
                        >
                            <span />
                        </button>
                    </div>
                </div>
            </section>

            {/* DATA */}

            <section className="settings-section">
                <div className="settings-section-heading">
                    <div className="settings-section-icon blue">
                        <Database size={19} />
                    </div>

                    <div>
                        <span className="panel-eyebrow">
                            Storage
                        </span>

                        <h2>Data management</h2>
                    </div>
                </div>

                <div className="settings-card">
                    <div className="settings-row">
                        <div className="settings-row-content">
                            <div className="settings-row-icon">
                                <Download size={18} />
                            </div>

                            <div>
                                <h3>Export your data</h3>

                                <p>
                                    Download your tasks, goals, habits,
                                    schedule and notes as a backup.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="settings-action-button"
                            onClick={handleExportData}
                        >
                            <Download size={16} />
                            Export
                        </button>
                    </div>

                    <div className="settings-divider" />

                    <div className="settings-row">
                        <div className="settings-row-content">
                            <div className="settings-row-icon">
                                <Shield size={18} />
                            </div>

                            <div>
                                <h3>Local storage</h3>

                                <p>
                                    Your Smart Life Manager data is stored
                                    locally in this browser.
                                </p>
                            </div>
                        </div>

                        <span className="storage-status">
                            <span />
                            Connected
                        </span>
                    </div>
                </div>
            </section>

            {/* DANGER ZONE */}

            <section className="settings-section danger-settings-section">
                <div className="settings-section-heading">
                    <div className="settings-section-icon danger">
                        <Trash2 size={19} />
                    </div>

                    <div>
                        <span className="panel-eyebrow">
                            Advanced
                        </span>

                        <h2>Danger zone</h2>
                    </div>
                </div>

                <div className="settings-card danger-card">
                    <div className="settings-row">
                        <div className="settings-row-content">
                            <div className="settings-row-icon danger">
                                <RotateCcw size={18} />
                            </div>

                            <div>
                                <h3>Reset all data</h3>

                                <p>
                                    Permanently remove all tasks, goals,
                                    habits, events and notes from this
                                    browser.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="settings-danger-button"
                            onClick={() =>
                                setShowResetModal(true)
                            }
                        >
                            <Trash2 size={16} />
                            Reset data
                        </button>
                    </div>
                </div>
            </section>

            {/* ABOUT */}

            <section className="settings-about-card">
                <div className="settings-about-logo">
                    ✦
                </div>

                <div>
                    <span>SMART LIFE MANAGER</span>

                    <h3>Your life, organized beautifully.</h3>

                    <p>
                        A personal productivity dashboard for managing
                        tasks, goals, habits, schedules and notes in one
                        place.
                    </p>
                </div>

                <div className="settings-version">
                    Version 1.0
                </div>
            </section>

            {/* SAVED MESSAGE */}

            {showSavedMessage && (
                <div className="settings-saved-message">
                    <Check size={17} />
                    <span>Settings saved</span>
                </div>
            )}

            {/* RESET MODAL */}

            {showResetModal && (
                <div
                    className="modal-overlay"
                    onClick={() =>
                        setShowResetModal(false)
                    }
                >
                    <div
                        className="modal confirmation-modal settings-reset-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="confirmation-icon danger">
                            <Trash2 size={25} />
                        </div>

                        <h2>Reset all data?</h2>

                        <p>
                            This will permanently remove all your
                            tasks, goals, habits, schedule items and
                            notes from this browser.
                        </p>

                        <p className="reset-warning">
                            This action cannot be undone.
                        </p>

                        <div className="confirmation-actions">
                            <button
                                type="button"
                                className="secondary-button"
                                onClick={() =>
                                    setShowResetModal(false)
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="delete-button"
                                onClick={handleReset}
                            >
                                <Trash2 size={16} />
                                Reset everything
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Settings;