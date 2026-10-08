import { useMemo, useState } from "react";
import {
    ArrowDown,
    ArrowUp,
    CalendarDays,
    Check,
    ChevronDown,
    ChevronUp,
    Edit3,
    Flag,
    MoreHorizontal,
    Plus,
    Search,
    Target,
    Trash2,
    TrendingUp,
    X,
} from "lucide-react";

import { useLife } from "../context/LifeContext";

const initialForm = {
    title: "",
    description: "",
    category: "Personal",
    progress: 0,
    targetDate: "",
    color: "purple",
};

const categories = [
    "Personal",
    "Career",
    "Education",
    "Health",
    "Finance",
    "Creative",
    "Other",
];

const colors = [
    {
        name: "purple",
        label: "Lavender",
        value: "#8b72b9",
    },
    {
        name: "green",
        label: "Sage",
        value: "#72a28a",
    },
    {
        name: "rose",
        label: "Rose",
        value: "#c58b9d",
    },
    {
        name: "blue",
        label: "Blue",
        value: "#7195b8",
    },
];

function Goals() {
    const {
        goals,
        addGoal,
        updateGoal,
        updateGoalProgress,
        deleteGoal,
    } = useLife();

    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    const [showFilters, setShowFilters] = useState(false);
    const [showGoalModal, setShowGoalModal] = useState(false);

    const [editingGoal, setEditingGoal] = useState(null);
    const [form, setForm] = useState(initialForm);

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [expandedGoal, setExpandedGoal] = useState(null);

    const filteredGoals = useMemo(() => {
        return goals.filter((goal) => {
            const searchText = search.trim().toLowerCase();

            const matchesSearch =
                !searchText ||
                goal.title.toLowerCase().includes(searchText) ||
                goal.description?.toLowerCase().includes(searchText) ||
                goal.category.toLowerCase().includes(searchText);

            const matchesCategory =
                categoryFilter === "all" ||
                goal.category.toLowerCase() === categoryFilter.toLowerCase();

            const progress = Number(goal.progress) || 0;

            let matchesStatus = true;

            if (statusFilter === "completed") {
                matchesStatus = progress >= 100;
            }

            if (statusFilter === "in-progress") {
                matchesStatus = progress > 0 && progress < 100;
            }

            if (statusFilter === "not-started") {
                matchesStatus = progress === 0;
            }

            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [goals, search, categoryFilter, statusFilter]);

    const statistics = useMemo(() => {
        const total = goals.length;

        const completed = goals.filter(
            (goal) => Number(goal.progress) >= 100
        ).length;

        const inProgress = goals.filter(
            (goal) =>
                Number(goal.progress) > 0 && Number(goal.progress) < 100
        ).length;

        const notStarted = goals.filter(
            (goal) => Number(goal.progress) === 0
        ).length;

        const average =
            total > 0
                ? Math.round(
                    goals.reduce(
                        (sum, goal) => sum + Number(goal.progress || 0),
                        0
                    ) / total
                )
                : 0;

        return {
            total,
            completed,
            inProgress,
            notStarted,
            average,
        };
    }, [goals]);

    const openAddModal = () => {
        setEditingGoal(null);
        setForm(initialForm);
        setShowGoalModal(true);
    };

    const openEditModal = (goal) => {
        setEditingGoal(goal);

        setForm({
            title: goal.title || "",
            description: goal.description || "",
            category: goal.category || "Personal",
            progress: Number(goal.progress) || 0,
            targetDate: goal.targetDate || "",
            color: goal.color || "purple",
        });

        setShowGoalModal(true);
    };

    const closeModal = () => {
        setShowGoalModal(false);
        setEditingGoal(null);
        setForm(initialForm);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleProgressChange = (event) => {
        let value = Number(event.target.value);

        if (Number.isNaN(value)) {
            value = 0;
        }

        value = Math.min(100, Math.max(0, value));

        setForm((current) => ({
            ...current,
            progress: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!form.title.trim()) {
            return;
        }

        const goalData = {
            title: form.title.trim(),
            description: form.description.trim(),
            category: form.category,
            progress: Number(form.progress),
            targetDate: form.targetDate,
            color: form.color,
        };

        if (editingGoal) {
            updateGoal(editingGoal.id, goalData);
        } else {
            addGoal(goalData);
        }

        closeModal();
    };

    const handleDelete = () => {
        if (!deleteTarget) {
            return;
        }

        deleteGoal(deleteTarget.id);
        setDeleteTarget(null);

        if (expandedGoal === deleteTarget.id) {
            setExpandedGoal(null);
        }
    };

    const changeProgress = (goal, amount) => {
        const currentProgress = Number(goal.progress) || 0;

        const newProgress = Math.min(
            100,
            Math.max(0, currentProgress + amount)
        );

        updateGoalProgress(goal.id, newProgress);
    };

    const getGoalStatus = (progress) => {
        const value = Number(progress) || 0;

        if (value >= 100) {
            return {
                label: "Completed",
                className: "goal-status-completed",
            };
        }

        if (value > 0) {
            return {
                label: "In progress",
                className: "goal-status-progress",
            };
        }

        return {
            label: "Not started",
            className: "goal-status-not-started",
        };
    };

    const formatDate = (dateString) => {
        if (!dateString) {
            return "No target date";
        }

        const date = new Date(`${dateString}T00:00:00`);

        if (Number.isNaN(date.getTime())) {
            return dateString;
        }

        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const isOverdue = (dateString, progress) => {
        if (!dateString || Number(progress) >= 100) {
            return false;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const target = new Date(`${dateString}T00:00:00`);

        return target < today;
    };

    const clearFilters = () => {
        setSearch("");
        setCategoryFilter("all");
        setStatusFilter("all");
    };

    const hasActiveFilters =
        search ||
        categoryFilter !== "all" ||
        statusFilter !== "all";

    return (
        <div className="goals-page">
            {/* PAGE INTRO */}

            <section className="page-intro">
                <div>
                    <p className="page-eyebrow">
                        <Target size={14} />
                        Long-term progress
                    </p>

                    <h1>Goals</h1>

                    <p>
                        Turn your plans into clear milestones and keep moving
                        forward.
                    </p>
                </div>

                <button
                    type="button"
                    className="primary-button"
                    onClick={openAddModal}
                >
                    <Plus size={18} />
                    New Goal
                </button>
            </section>

            {/* STATISTICS */}

            <section className="goal-stat-grid">
                <div className="goal-stat-card">
                    <div className="goal-stat-icon purple">
                        <Target size={21} />
                    </div>

                    <div>
                        <span className="goal-stat-label">Total goals</span>
                        <strong>{statistics.total}</strong>
                    </div>
                </div>

                <div className="goal-stat-card">
                    <div className="goal-stat-icon green">
                        <Check size={21} />
                    </div>

                    <div>
                        <span className="goal-stat-label">Completed</span>
                        <strong>{statistics.completed}</strong>
                    </div>
                </div>

                <div className="goal-stat-card">
                    <div className="goal-stat-icon rose">
                        <TrendingUp size={21} />
                    </div>

                    <div>
                        <span className="goal-stat-label">In progress</span>
                        <strong>{statistics.inProgress}</strong>
                    </div>
                </div>

                <div className="goal-stat-card">
                    <div className="goal-stat-icon blue">
                        <Flag size={21} />
                    </div>

                    <div>
                        <span className="goal-stat-label">Average progress</span>
                        <strong>{statistics.average}%</strong>
                    </div>
                </div>
            </section>

            {/* CONTROLS */}

            <section className="goal-controls">
                <div className="goal-search">
                    <Search size={18} />

                    <input
                        type="text"
                        placeholder="Search goals..."
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
                    onClick={() => setShowFilters((value) => !value)}
                >
                    <Target size={17} />
                    Filters

                    {hasActiveFilters && <span className="filter-count">!</span>}
                </button>
            </section>

            {/* FILTER PANEL */}

            {showFilters && (
                <section className="goal-filter-panel">
                    <div className="goal-filter-group">
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

                    <div className="goal-filter-group">
                        <label>Status</label>

                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(event.target.value)
                            }
                        >
                            <option value="all">All goals</option>
                            <option value="completed">Completed</option>
                            <option value="in-progress">In progress</option>
                            <option value="not-started">Not started</option>
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

            {/* GOAL HEADER */}

            <section className="goals-section">
                <div className="goals-section-header">
                    <div>
                        <span className="panel-eyebrow">Your goals</span>

                        <h2>
                            {filteredGoals.length}{" "}
                            {filteredGoals.length === 1 ? "goal" : "goals"}
                        </h2>
                    </div>

                    <div className="goal-average">
                        <TrendingUp size={16} />
                        <span>{statistics.average}% average progress</span>
                    </div>
                </div>

                {/* EMPTY STATE */}

                {filteredGoals.length === 0 ? (
                    <div className="goals-empty-state">
                        <div className="goals-empty-icon">
                            <Target size={30} />
                        </div>

                        <h3>No goals found</h3>

                        <p>
                            {goals.length === 0
                                ? "Start by creating your first goal."
                                : "Try changing your search or filters."}
                        </p>

                        {goals.length === 0 ? (
                            <button
                                type="button"
                                className="primary-button"
                                onClick={openAddModal}
                            >
                                <Plus size={17} />
                                Create your first goal
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
                    <div className="goals-grid">
                        {filteredGoals.map((goal) => {
                            const progress = Math.min(
                                100,
                                Math.max(0, Number(goal.progress) || 0)
                            );

                            const status = getGoalStatus(progress);

                            const expanded = expandedGoal === goal.id;

                            const overdue = isOverdue(
                                goal.targetDate,
                                progress
                            );

                            return (
                                <article
                                    className={`goal-management-card ${expanded ? "expanded" : ""
                                        }`}
                                    key={goal.id}
                                >
                                    {/* COLOR ACCENT */}

                                    <div
                                        className="goal-card-accent"
                                        style={{
                                            background:
                                                colors.find(
                                                    (color) => color.name === goal.color
                                                )?.value || "#8b72b9",
                                        }}
                                    />

                                    <div className="goal-management-content">
                                        {/* CARD TOP */}

                                        <div className="goal-card-top">
                                            <div
                                                className="goal-color-icon"
                                                style={{
                                                    color:
                                                        colors.find(
                                                            (color) =>
                                                                color.name === goal.color
                                                        )?.value || "#8b72b9",
                                                }}
                                            >
                                                <Target size={20} />
                                            </div>

                                            <div className="goal-card-menu">
                                                <button
                                                    type="button"
                                                    className="task-action-button"
                                                    onClick={() =>
                                                        setExpandedGoal(
                                                            expanded ? null : goal.id
                                                        )
                                                    }
                                                    aria-label="More goal options"
                                                >
                                                    <MoreHorizontal size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* TITLE */}

                                        <div className="goal-management-title">
                                            <div className="goal-title-row">
                                                <h3>{goal.title}</h3>

                                                <span
                                                    className={`goal-status ${status.className}`}
                                                >
                                                    {status.label}
                                                </span>
                                            </div>

                                            {goal.description && (
                                                <p>{goal.description}</p>
                                            )}
                                        </div>

                                        {/* META */}

                                        <div className="goal-management-meta">
                                            <span className="goal-category">
                                                {goal.category}
                                            </span>

                                            <span
                                                className={
                                                    overdue
                                                        ? "goal-date overdue"
                                                        : "goal-date"
                                                }
                                            >
                                                <CalendarDays size={14} />

                                                {overdue
                                                    ? "Overdue"
                                                    : formatDate(goal.targetDate)}
                                            </span>
                                        </div>

                                        {/* PROGRESS */}

                                        <div className="goal-progress-section">
                                            <div className="goal-progress-header">
                                                <span>Progress</span>

                                                <strong>{progress}%</strong>
                                            </div>

                                            <div className="goal-progress-track">
                                                <div
                                                    className="goal-progress-fill"
                                                    style={{
                                                        width: `${progress}%`,
                                                        background:
                                                            colors.find(
                                                                (color) =>
                                                                    color.name === goal.color
                                                            )?.value || "#8b72b9",
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* QUICK PROGRESS */}

                                        <div className="goal-progress-actions">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    changeProgress(goal, -10)
                                                }
                                                disabled={progress <= 0}
                                            >
                                                <ArrowDown size={15} />
                                                10%
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    changeProgress(goal, 10)
                                                }
                                                disabled={progress >= 100}
                                            >
                                                <ArrowUp size={15} />
                                                10%
                                            </button>
                                        </div>

                                        {/* EXPANDED ACTIONS */}

                                        {expanded && (
                                            <div className="goal-expanded-actions">
                                                <button
                                                    type="button"
                                                    onClick={() => openEditModal(goal)}
                                                >
                                                    <Edit3 size={16} />
                                                    Edit goal
                                                </button>

                                                <button
                                                    type="button"
                                                    className="danger-action"
                                                    onClick={() => setDeleteTarget(goal)}
                                                >
                                                    <Trash2 size={16} />
                                                    Delete goal
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* ADD / EDIT MODAL */}

            {showGoalModal && (
                <div
                    className="modal-overlay"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closeModal();
                        }
                    }}
                >
                    <div className="modal goal-modal">
                        <div className="modal-header">
                            <div>
                                <p className="modal-eyebrow">
                                    {editingGoal ? "Update goal" : "New goal"}
                                </p>

                                <h2>
                                    {editingGoal
                                        ? "Edit your goal"
                                        : "Create a new goal"}
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
                            className="goal-form"
                            onSubmit={handleSubmit}
                        >
                            <div className="form-group">
                                <label htmlFor="goal-title">Goal title</label>

                                <input
                                    id="goal-title"
                                    name="title"
                                    type="text"
                                    placeholder="e.g. Complete my portfolio"
                                    value={form.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="goal-description">
                                    Description
                                </label>

                                <textarea
                                    id="goal-description"
                                    name="description"
                                    rows="4"
                                    placeholder="What do you want to achieve?"
                                    value={form.description}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="goal-category">
                                        Category
                                    </label>

                                    <select
                                        id="goal-category"
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
                                    <label htmlFor="goal-date">
                                        Target date
                                    </label>

                                    <input
                                        id="goal-date"
                                        name="targetDate"
                                        type="date"
                                        value={form.targetDate}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="form-label-row">
                                    <label htmlFor="goal-progress">
                                        Current progress
                                    </label>

                                    <strong>{form.progress}%</strong>
                                </div>

                                <input
                                    id="goal-progress"
                                    name="progress"
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="5"
                                    value={form.progress}
                                    onChange={handleProgressChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Goal color</label>

                                <div className="goal-color-picker">
                                    {colors.map((color) => (
                                        <button
                                            type="button"
                                            key={color.name}
                                            className={`goal-color-option ${form.color === color.name
                                                    ? "selected"
                                                    : ""
                                                }`}
                                            onClick={() =>
                                                setForm((current) => ({
                                                    ...current,
                                                    color: color.name,
                                                }))
                                            }
                                            title={color.label}
                                            aria-label={`Select ${color.label}`}
                                        >
                                            <span
                                                style={{
                                                    background: color.value,
                                                }}
                                            />

                                            {form.color === color.name && (
                                                <Check size={14} />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

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

                                    {editingGoal
                                        ? "Save changes"
                                        : "Create goal"}
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

                        <h2>Delete this goal?</h2>

                        <p>
                            You're about to delete{" "}
                            <strong>{deleteTarget.title}</strong>. This
                            action cannot be undone.
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
                                Delete goal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Goals;