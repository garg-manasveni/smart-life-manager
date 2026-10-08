import { useMemo, useState } from "react";
import {
    Activity,
    CalendarDays,
    Check,
    ChevronLeft,
    ChevronRight,
    Edit3,
    Flame,
    MoreHorizontal,
    Plus,
    Search,
    Sparkles,
    Target,
    Trash2,
    TrendingUp,
    X,
} from "lucide-react";

import { useLife } from "../context/LifeContext";

const initialForm = {
    name: "",
    icon: "✓",
    category: "Personal",
    streak: 0,
    completedToday: false,
};

const categories = [
    "Personal",
    "Health",
    "Fitness",
    "Learning",
    "Productivity",
    "Mindfulness",
    "Creative",
    "Other",
];

const habitIcons = [
    "✓",
    "📚",
    "💧",
    "🏃",
    "🧘",
    "💻",
    "🎨",
    "🧹",
    "🌱",
    "✍️",
    "🎯",
    "☀️",
];

function Habits() {
    const {
        habits,
        addHabit,
        updateHabit,
        toggleHabit,
        deleteHabit,
    } = useLife();

    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");

    const [showFilters, setShowFilters] = useState(false);
    const [showHabitModal, setShowHabitModal] = useState(false);

    const [editingHabit, setEditingHabit] = useState(null);
    const [form, setForm] = useState(initialForm);

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [expandedHabit, setExpandedHabit] = useState(null);

    const [selectedWeekOffset, setSelectedWeekOffset] = useState(0);

    const filteredHabits = useMemo(() => {
        return habits.filter((habit) => {
            const searchText = search.trim().toLowerCase();

            const matchesSearch =
                !searchText ||
                habit.name.toLowerCase().includes(searchText) ||
                habit.category.toLowerCase().includes(searchText);

            const matchesCategory =
                categoryFilter === "all" ||
                habit.category.toLowerCase() ===
                categoryFilter.toLowerCase();

            return matchesSearch && matchesCategory;
        });
    }, [habits, search, categoryFilter]);

    const statistics = useMemo(() => {
        const total = habits.length;

        const completedToday = habits.filter(
            (habit) => habit.completedToday
        ).length;

        const completionRate =
            total > 0
                ? Math.round((completedToday / total) * 100)
                : 0;

        const longestStreak =
            total > 0
                ? Math.max(
                    ...habits.map((habit) => Number(habit.streak) || 0)
                )
                : 0;

        const totalCompletions = habits.reduce((sum, habit) => {
            const history = Array.isArray(habit.history)
                ? habit.history
                : [];

            return (
                sum +
                history.filter((item) => item.completed).length
            );
        }, 0);

        return {
            total,
            completedToday,
            completionRate,
            longestStreak,
            totalCompletions,
        };
    }, [habits]);

    const getDateKey = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const getWeekDates = () => {
        const today = new Date();

        const currentDay = today.getDay();

        const mondayOffset =
            currentDay === 0 ? -6 : 1 - currentDay;

        const monday = new Date(today);

        monday.setDate(
            today.getDate() +
            mondayOffset +
            selectedWeekOffset * 7
        );

        monday.setHours(0, 0, 0, 0);

        return Array.from({ length: 7 }, (_, index) => {
            const date = new Date(monday);

            date.setDate(monday.getDate() + index);

            return date;
        });
    };

    const weekDates = getWeekDates();

    const isToday = (date) => {
        return getDateKey(date) === getDateKey(new Date());
    };

    const getHistoryValue = (habit, date) => {
        const dateKey = getDateKey(date);

        const history = Array.isArray(habit.history)
            ? habit.history
            : [];

        const item = history.find((entry) => {
            if (typeof entry === "string") {
                return entry === dateKey;
            }

            return entry.date === dateKey;
        });

        if (!item) {
            return false;
        }

        if (typeof item === "string") {
            return true;
        }

        return item.completed === true;
    };

    const getWeekCompletion = (habit) => {
        const completedDays = weekDates.filter((date) =>
            getHistoryValue(habit, date)
        ).length;

        return Math.round((completedDays / 7) * 100);
    };

    const openAddModal = () => {
        setEditingHabit(null);
        setForm(initialForm);
        setShowHabitModal(true);
    };

    const openEditModal = (habit) => {
        setEditingHabit(habit);

        setForm({
            name: habit.name || "",
            icon: habit.icon || "✓",
            category: habit.category || "Personal",
            streak: Number(habit.streak) || 0,
            completedToday: Boolean(habit.completedToday),
        });

        setShowHabitModal(true);
    };

    const closeModal = () => {
        setShowHabitModal(false);
        setEditingHabit(null);
        setForm(initialForm);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!form.name.trim()) {
            return;
        }

        const habitData = {
            name: form.name.trim(),
            icon: form.icon,
            category: form.category,
            streak: Number(form.streak) || 0,
            completedToday: Boolean(form.completedToday),
        };

        if (editingHabit) {
            updateHabit(editingHabit.id, habitData);
        } else {
            addHabit(habitData);
        }

        closeModal();
    };

    const handleDelete = () => {
        if (!deleteTarget) {
            return;
        }

        deleteHabit(deleteTarget.id);

        if (expandedHabit === deleteTarget.id) {
            setExpandedHabit(null);
        }

        setDeleteTarget(null);
    };

    const clearFilters = () => {
        setSearch("");
        setCategoryFilter("all");
    };

    const hasActiveFilters =
        search || categoryFilter !== "all";

    const goToPreviousWeek = () => {
        setSelectedWeekOffset((current) => current - 1);
    };

    const goToNextWeek = () => {
        setSelectedWeekOffset((current) => current + 1);
    };

    const goToCurrentWeek = () => {
        setSelectedWeekOffset(0);
    };

    const formatWeekRange = () => {
        if (!weekDates.length) {
            return "";
        }

        const first = weekDates[0];
        const last = weekDates[6];

        const firstMonth = first.toLocaleDateString("en-US", {
            month: "short",
        });

        const lastMonth = last.toLocaleDateString("en-US", {
            month: "short",
        });

        if (firstMonth === lastMonth) {
            return `${firstMonth} ${first.getDate()}–${last.getDate()}`;
        }

        return `${firstMonth} ${first.getDate()} – ${lastMonth} ${last.getDate()}`;
    };

    return (
        <div className="habits-page">
            {/* PAGE INTRO */}

            <section className="page-intro">
                <div>
                    <p className="page-eyebrow">
                        <Activity size={14} />
                        Daily consistency
                    </p>

                    <h1>Habits</h1>

                    <p>
                        Small actions repeated every day can create meaningful
                        change.
                    </p>
                </div>

                <button
                    type="button"
                    className="primary-button"
                    onClick={openAddModal}
                >
                    <Plus size={18} />
                    New Habit
                </button>
            </section>

            {/* STATISTICS */}

            <section className="habit-stat-grid">
                <div className="habit-stat-card">
                    <div className="habit-stat-icon purple">
                        <Target size={21} />
                    </div>

                    <div>
                        <span className="habit-stat-label">
                            Active habits
                        </span>

                        <strong>{statistics.total}</strong>
                    </div>
                </div>

                <div className="habit-stat-card">
                    <div className="habit-stat-icon green">
                        <Check size={21} />
                    </div>

                    <div>
                        <span className="habit-stat-label">
                            Completed today
                        </span>

                        <strong>
                            {statistics.completedToday}/{statistics.total}
                        </strong>
                    </div>
                </div>

                <div className="habit-stat-card">
                    <div className="habit-stat-icon rose">
                        <TrendingUp size={21} />
                    </div>

                    <div>
                        <span className="habit-stat-label">
                            Today's rate
                        </span>

                        <strong>{statistics.completionRate}%</strong>
                    </div>
                </div>

                <div className="habit-stat-card">
                    <div className="habit-stat-icon orange">
                        <Flame size={21} />
                    </div>

                    <div>
                        <span className="habit-stat-label">
                            Longest streak
                        </span>

                        <strong>{statistics.longestStreak} days</strong>
                    </div>
                </div>
            </section>

            {/* TODAY PROGRESS */}

            <section className="habit-progress-banner">
                <div className="habit-progress-banner-icon">
                    <Sparkles size={21} />
                </div>

                <div className="habit-progress-banner-content">
                    <div className="habit-progress-banner-heading">
                        <div>
                            <span>Today's consistency</span>

                            <strong>
                                {statistics.completionRate}% complete
                            </strong>
                        </div>

                        <span>
                            {statistics.completedToday} of{" "}
                            {statistics.total} habits
                        </span>
                    </div>

                    <div className="habit-overall-track">
                        <div
                            className="habit-overall-fill"
                            style={{
                                width: `${statistics.completionRate}%`,
                            }}
                        />
                    </div>
                </div>
            </section>

            {/* CONTROLS */}

            <section className="habit-controls">
                <div className="habit-search">
                    <Search size={18} />

                    <input
                        type="text"
                        placeholder="Search habits..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />

                    {search && (
                        <button
                            type="button"
                            className="search-clear"
                            onClick={() => setSearch("")}
                            aria-label="Clear search"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                <button
                    type="button"
                    className={`filter-button ${showFilters ? "active" : ""
                        }`}
                    onClick={() =>
                        setShowFilters((current) => !current)
                    }
                >
                    <Activity size={17} />
                    Filters

                    {hasActiveFilters && (
                        <span className="filter-count">!</span>
                    )}
                </button>
            </section>

            {/* FILTERS */}

            {showFilters && (
                <section className="habit-filter-panel">
                    <div className="habit-filter-group">
                        <label>Category</label>

                        <select
                            value={categoryFilter}
                            onChange={(event) =>
                                setCategoryFilter(event.target.value)
                            }
                        >
                            <option value="all">All categories</option>

                            {categories.map((category) => (
                                <option
                                    value={category.toLowerCase()}
                                    key={category}
                                >
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    {hasActiveFilters && (
                        <button
                            type="button"
                            className="clear-filters"
                            onClick={clearFilters}
                        >
                            Clear filters
                        </button>
                    )}
                </section>
            )}

            {/* WEEK VIEW */}

            <section className="habit-week-panel">
                <div className="habit-week-header">
                    <div>
                        <span className="panel-eyebrow">
                            Weekly overview
                        </span>

                        <h2>{formatWeekRange()}</h2>
                    </div>

                    <div className="habit-week-actions">
                        <button
                            type="button"
                            onClick={goToPreviousWeek}
                            aria-label="Previous week"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        <button
                            type="button"
                            className={
                                selectedWeekOffset === 0 ? "current" : ""
                            }
                            onClick={goToCurrentWeek}
                        >
                            Today
                        </button>

                        <button
                            type="button"
                            onClick={goToNextWeek}
                            aria-label="Next week"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

                <div className="habit-week-days">
                    {weekDates.map((date) => (
                        <div
                            className={`habit-week-day ${isToday(date) ? "today" : ""
                                }`}
                            key={getDateKey(date)}
                        >
                            <span>
                                {date.toLocaleDateString("en-US", {
                                    weekday: "short",
                                })}
                            </span>

                            <strong>{date.getDate()}</strong>
                        </div>
                    ))}
                </div>
            </section>

            {/* HABITS */}

            <section className="habits-section">
                <div className="habits-section-header">
                    <div>
                        <span className="panel-eyebrow">
                            Your habits
                        </span>

                        <h2>
                            {filteredHabits.length}{" "}
                            {filteredHabits.length === 1
                                ? "habit"
                                : "habits"}
                        </h2>
                    </div>

                    <span className="habit-section-note">
                        Check off each day to build your streak
                    </span>
                </div>

                {filteredHabits.length === 0 ? (
                    <div className="habits-empty-state">
                        <div className="habits-empty-icon">
                            <Activity size={30} />
                        </div>

                        <h3>No habits found</h3>

                        <p>
                            {habits.length === 0
                                ? "Create your first habit and start building consistency."
                                : "Try changing your search or category filter."}
                        </p>

                        {habits.length === 0 ? (
                            <button
                                type="button"
                                className="primary-button"
                                onClick={openAddModal}
                            >
                                <Plus size={17} />
                                Create your first habit
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="secondary-button"
                                onClick={clearFilters}
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="habits-list">
                        {filteredHabits.map((habit) => {
                            const weekCompletion =
                                getWeekCompletion(habit);

                            const expanded =
                                expandedHabit === habit.id;

                            return (
                                <article
                                    className={`habit-management-card ${habit.completedToday ? "completed" : ""
                                        } ${expanded ? "expanded" : ""}`}
                                    key={habit.id}
                                >
                                    {/* MAIN HABIT AREA */}

                                    <div className="habit-main-row">
                                        <button
                                            type="button"
                                            className={`habit-complete-button ${habit.completedToday
                                                    ? "checked"
                                                    : ""
                                                }`}
                                            onClick={() => toggleHabit(habit.id)}
                                            aria-label={
                                                habit.completedToday
                                                    ? "Mark habit incomplete"
                                                    : "Mark habit complete"
                                            }
                                        >
                                            {habit.completedToday ? (
                                                <Check size={20} />
                                            ) : (
                                                <span />
                                            )}
                                        </button>

                                        <div className="habit-icon-box">
                                            <span>{habit.icon || "✓"}</span>
                                        </div>

                                        <div className="habit-management-info">
                                            <div className="habit-management-title">
                                                <h3>{habit.name}</h3>

                                                {habit.completedToday && (
                                                    <span className="habit-done-label">
                                                        Done today
                                                    </span>
                                                )}
                                            </div>

                                            <div className="habit-management-meta">
                                                <span className="habit-category">
                                                    {habit.category}
                                                </span>

                                                <span className="habit-streak">
                                                    <Flame size={14} />
                                                    {habit.streak || 0} day
                                                    {Number(habit.streak) === 1
                                                        ? ""
                                                        : "s"}{" "}
                                                    streak
                                                </span>
                                            </div>
                                        </div>

                                        <div className="habit-week-mini">
                                            <div className="habit-mini-label">
                                                <span>This week</span>
                                                <strong>
                                                    {weekCompletion}%
                                                </strong>
                                            </div>

                                            <div className="habit-mini-track">
                                                <div
                                                    className="habit-mini-fill"
                                                    style={{
                                                        width: `${weekCompletion}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            className="habit-more-button"
                                            onClick={() =>
                                                setExpandedHabit(
                                                    expanded ? null : habit.id
                                                )
                                            }
                                            aria-label="Habit options"
                                        >
                                            <MoreHorizontal size={19} />
                                        </button>
                                    </div>

                                    {/* WEEKLY CHECKBOXES */}

                                    <div className="habit-history">
                                        <div className="habit-history-label">
                                            <CalendarDays size={15} />
                                            <span>Weekly activity</span>
                                        </div>

                                        <div className="habit-history-grid">
                                            {weekDates.map((date) => {
                                                const completed =
                                                    getHistoryValue(habit, date);

                                                return (
                                                    <div
                                                        className={`habit-history-day ${isToday(date)
                                                                ? "today"
                                                                : ""
                                                            }`}
                                                        key={getDateKey(date)}
                                                    >
                                                        <span>
                                                            {date.toLocaleDateString(
                                                                "en-US",
                                                                {
                                                                    weekday: "narrow",
                                                                }
                                                            )}
                                                        </span>

                                                        <button
                                                            type="button"
                                                            className={
                                                                completed
                                                                    ? "completed"
                                                                    : ""
                                                            }
                                                            disabled={
                                                                !isToday(date)
                                                            }
                                                            title={
                                                                isToday(date)
                                                                    ? "Toggle today's habit"
                                                                    : "Past days are shown for tracking"
                                                            }
                                                            onClick={() => {
                                                                if (isToday(date)) {
                                                                    toggleHabit(habit.id);
                                                                }
                                                            }}
                                                        >
                                                            {completed && (
                                                                <Check size={13} />
                                                            )}
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* EXPANDED ACTIONS */}

                                    {expanded && (
                                        <div className="habit-expanded-actions">
                                            <button
                                                type="button"
                                                onClick={() => openEditModal(habit)}
                                            >
                                                <Edit3 size={16} />
                                                Edit habit
                                            </button>

                                            <button
                                                type="button"
                                                className="danger-action"
                                                onClick={() =>
                                                    setDeleteTarget(habit)
                                                }
                                            >
                                                <Trash2 size={16} />
                                                Delete habit
                                            </button>
                                        </div>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* ADD / EDIT MODAL */}

            {showHabitModal && (
                <div
                    className="modal-overlay"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closeModal();
                        }
                    }}
                >
                    <div className="modal habit-modal">
                        <div className="modal-header">
                            <div>
                                <p className="modal-eyebrow">
                                    {editingHabit
                                        ? "Update habit"
                                        : "New habit"}
                                </p>

                                <h2>
                                    {editingHabit
                                        ? "Edit your habit"
                                        : "Create a new habit"}
                                </h2>
                            </div>

                            <button
                                type="button"
                                className="modal-close"
                                onClick={closeModal}
                                aria-label="Close"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form
                            className="habit-form"
                            onSubmit={handleSubmit}
                        >
                            <div className="form-group">
                                <label htmlFor="habit-name">
                                    Habit name
                                </label>

                                <input
                                    id="habit-name"
                                    name="name"
                                    type="text"
                                    placeholder="e.g. Read for 20 minutes"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="habit-category">
                                        Category
                                    </label>

                                    <select
                                        id="habit-category"
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                    >
                                        {categories.map((category) => (
                                            <option
                                                value={category}
                                                key={category}
                                            >
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="habit-streak">
                                        Starting streak
                                    </label>

                                    <input
                                        id="habit-streak"
                                        name="streak"
                                        type="number"
                                        min="0"
                                        value={form.streak}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Choose an icon</label>

                                <div className="habit-icon-picker">
                                    {habitIcons.map((icon) => (
                                        <button
                                            type="button"
                                            key={icon}
                                            className={
                                                form.icon === icon
                                                    ? "selected"
                                                    : ""
                                            }
                                            onClick={() =>
                                                setForm((current) => ({
                                                    ...current,
                                                    icon,
                                                }))
                                            }
                                        >
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {editingHabit && (
                                <label className="habit-modal-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={form.completedToday}
                                        onChange={(event) =>
                                            setForm((current) => ({
                                                ...current,
                                                completedToday:
                                                    event.target.checked,
                                            }))
                                        }
                                    />

                                    <span>
                                        Mark this habit as completed today
                                    </span>
                                </label>
                            )}

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="primary-button"
                                >
                                    <Check size={17} />

                                    {editingHabit
                                        ? "Save changes"
                                        : "Create habit"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DELETE CONFIRMATION */}

            {deleteTarget && (
                <div
                    className="modal-overlay"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setDeleteTarget(null);
                        }
                    }}
                >
                    <div className="modal confirmation-modal">
                        <div className="confirmation-icon">
                            <Trash2 size={23} />
                        </div>

                        <h2>Delete this habit?</h2>

                        <p>
                            You're about to delete{" "}
                            <strong>{deleteTarget.name}</strong>. Its habit
                            history and streak will also be removed.
                        </p>

                        <div className="confirmation-actions">
                            <button
                                type="button"
                                className="secondary-button"
                                onClick={() => setDeleteTarget(null)}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="delete-button"
                                onClick={handleDelete}
                            >
                                <Trash2 size={16} />
                                Delete habit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Habits;