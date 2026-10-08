import { useMemo, useState } from "react";
import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Clock3,
    Edit3,
    MapPin,
    MoreHorizontal,
    Plus,
    Search,
    Trash2,
    X,
    Check,
    Calendar,
} from "lucide-react";

import { useLife } from "../context/LifeContext";

const initialForm = {
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    category: "Personal",
    color: "purple",
};

const categories = [
    "Personal",
    "College",
    "Work",
    "Meeting",
    "Study",
    "Health",
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

function Schedule() {
    const {
        schedule,
        addScheduleItem,
        updateScheduleItem,
        deleteScheduleItem,
    } = useLife();

    const [selectedDate, setSelectedDate] = useState(
        new Date()
    );

    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");

    const [showFilters, setShowFilters] = useState(false);
    const [showScheduleModal, setShowScheduleModal] =
        useState(false);

    const [editingItem, setEditingItem] = useState(null);
    const [form, setForm] = useState(initialForm);

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [expandedItem, setExpandedItem] = useState(null);

    const formatDateKey = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const todayKey = formatDateKey(new Date());

    const selectedDateKey = formatDateKey(selectedDate);

    const isToday = selectedDateKey === todayKey;

    const formatDisplayDate = (date) => {
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatShortDate = (date) => {
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    const filteredSchedule = useMemo(() => {
        const searchText = search.trim().toLowerCase();

        return schedule
            .filter((item) => {
                const matchesDate = item.date === selectedDateKey;

                const matchesSearch =
                    !searchText ||
                    item.title.toLowerCase().includes(searchText) ||
                    item.description
                        ?.toLowerCase()
                        .includes(searchText) ||
                    item.category.toLowerCase().includes(searchText);

                const matchesCategory =
                    categoryFilter === "all" ||
                    item.category.toLowerCase() ===
                    categoryFilter.toLowerCase();

                return (
                    matchesDate &&
                    matchesSearch &&
                    matchesCategory
                );
            })
            .sort((a, b) => {
                return (
                    (a.startTime || "").localeCompare(
                        b.startTime || ""
                    )
                );
            });
    }, [
        schedule,
        selectedDateKey,
        search,
        categoryFilter,
    ]);

    const upcomingSchedule = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return schedule
            .filter((item) => {
                if (!item.date) {
                    return false;
                }

                const date = new Date(`${item.date}T00:00:00`);

                return date >= today;
            })
            .sort((a, b) => {
                const first = `${a.date} ${a.startTime || "00:00"}`;
                const second = `${b.date} ${b.startTime || "00:00"}`;

                return first.localeCompare(second);
            })
            .slice(0, 5);
    }, [schedule]);

    const statistics = useMemo(() => {
        const total = schedule.length;

        const todayCount = schedule.filter(
            (item) => item.date === todayKey
        ).length;

        const selectedCount = schedule.filter(
            (item) => item.date === selectedDateKey
        ).length;

        const categoriesCount = new Set(
            schedule.map((item) => item.category)
        ).size;

        return {
            total,
            todayCount,
            selectedCount,
            categoriesCount,
        };
    }, [schedule, selectedDateKey, todayKey]);

    const changeDate = (amount) => {
        setSelectedDate((current) => {
            const next = new Date(current);

            next.setDate(next.getDate() + amount);

            return next;
        });
    };

    const goToToday = () => {
        setSelectedDate(new Date());
    };

    const openAddModal = () => {
        setEditingItem(null);

        setForm({
            ...initialForm,
            date: selectedDateKey,
        });

        setShowScheduleModal(true);
    };

    const openEditModal = (item) => {
        setEditingItem(item);

        setForm({
            title: item.title || "",
            description: item.description || "",
            date: item.date || selectedDateKey,
            startTime: item.startTime || "",
            endTime: item.endTime || "",
            category: item.category || "Personal",
            color: item.color || "purple",
        });

        setShowScheduleModal(true);
    };

    const closeModal = () => {
        setShowScheduleModal(false);
        setEditingItem(null);
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

        if (!form.title.trim() || !form.date) {
            return;
        }

        const itemData = {
            title: form.title.trim(),
            description: form.description.trim(),
            date: form.date,
            startTime: form.startTime,
            endTime: form.endTime,
            category: form.category,
            color: form.color,
        };

        if (editingItem) {
            updateScheduleItem(editingItem.id, itemData);

            if (editingItem.date !== form.date) {
                setSelectedDate(
                    new Date(`${form.date}T00:00:00`)
                );
            }
        } else {
            addScheduleItem(itemData);

            if (form.date !== selectedDateKey) {
                setSelectedDate(
                    new Date(`${form.date}T00:00:00`)
                );
            }
        }

        closeModal();
    };

    const handleDelete = () => {
        if (!deleteTarget) {
            return;
        }

        deleteScheduleItem(deleteTarget.id);
        setDeleteTarget(null);
        setExpandedItem(null);
    };

    const clearFilters = () => {
        setSearch("");
        setCategoryFilter("all");
    };

    const hasActiveFilters =
        search || categoryFilter !== "all";

    const formatTime = (time) => {
        if (!time) {
            return "";
        }

        const [hours, minutes] = time.split(":");
        const hour = Number(hours);

        if (Number.isNaN(hour)) {
            return time;
        }

        const suffix = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 || 12;

        return `${displayHour}:${minutes} ${suffix}`;
    };

    const getTimeRange = (item) => {
        if (!item.startTime && !item.endTime) {
            return "Time not specified";
        }

        if (!item.endTime) {
            return formatTime(item.startTime);
        }

        return `${formatTime(item.startTime)} – ${formatTime(
            item.endTime
        )}`;
    };

    const getColor = (colorName) => {
        return (
            colors.find((color) => color.name === colorName)
                ?.value || "#8b72b9"
        );
    };

    const getRelativeDateLabel = (dateString) => {
        if (dateString === todayKey) {
            return "Today";
        }

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (dateString === formatDateKey(tomorrow)) {
            return "Tomorrow";
        }

        const date = new Date(`${dateString}T00:00:00`);

        return date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="schedule-page">
            {/* PAGE INTRO */}

            <section className="page-intro">
                <div>
                    <p className="page-eyebrow">
                        <CalendarDays size={14} />
                        Plan your time
                    </p>

                    <h1>Schedule</h1>

                    <p>
                        Organize classes, meetings, study sessions, and
                        everything important in your day.
                    </p>
                </div>

                <button
                    type="button"
                    className="primary-button"
                    onClick={openAddModal}
                >
                    <Plus size={18} />
                    Add Event
                </button>
            </section>

            {/* STATISTICS */}

            <section className="schedule-stat-grid">
                <div className="schedule-stat-card">
                    <div className="schedule-stat-icon purple">
                        <CalendarDays size={21} />
                    </div>

                    <div>
                        <span className="schedule-stat-label">
                            Total events
                        </span>

                        <strong>{statistics.total}</strong>
                    </div>
                </div>

                <div className="schedule-stat-card">
                    <div className="schedule-stat-icon green">
                        <Clock3 size={21} />
                    </div>

                    <div>
                        <span className="schedule-stat-label">
                            Today
                        </span>

                        <strong>{statistics.todayCount}</strong>
                    </div>
                </div>

                <div className="schedule-stat-card">
                    <div className="schedule-stat-icon rose">
                        <Calendar size={21} />
                    </div>

                    <div>
                        <span className="schedule-stat-label">
                            Selected day
                        </span>

                        <strong>{statistics.selectedCount}</strong>
                    </div>
                </div>

                <div className="schedule-stat-card">
                    <div className="schedule-stat-icon blue">
                        <MapPin size={21} />
                    </div>

                    <div>
                        <span className="schedule-stat-label">
                            Categories
                        </span>

                        <strong>{statistics.categoriesCount}</strong>
                    </div>
                </div>
            </section>

            {/* DATE NAVIGATION */}

            <section className="schedule-date-panel">
                <div className="schedule-date-main">
                    <button
                        type="button"
                        className="schedule-date-arrow"
                        onClick={() => changeDate(-1)}
                        aria-label="Previous day"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <div className="schedule-date-icon">
                        <CalendarDays size={22} />
                    </div>

                    <div>
                        <span className="schedule-date-label">
                            {isToday ? "Today" : "Selected date"}
                        </span>

                        <h2>{formatDisplayDate(selectedDate)}</h2>
                    </div>

                    <button
                        type="button"
                        className="schedule-date-arrow"
                        onClick={() => changeDate(1)}
                        aria-label="Next day"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                {!isToday && (
                    <button
                        type="button"
                        className="secondary-button small"
                        onClick={goToToday}
                    >
                        Go to today
                    </button>
                )}
            </section>

            {/* CONTROLS */}

            <section className="schedule-controls">
                <div className="schedule-search">
                    <Search size={18} />

                    <input
                        type="text"
                        placeholder="Search events..."
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
                    <CalendarDays size={17} />
                    Filters

                    {hasActiveFilters && (
                        <span className="filter-count">!</span>
                    )}
                </button>
            </section>

            {/* FILTER PANEL */}

            {showFilters && (
                <section className="schedule-filter-panel">
                    <div className="schedule-filter-group">
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

            {/* MAIN SCHEDULE CONTENT */}

            <div className="schedule-layout">
                {/* DAY SCHEDULE */}

                <section className="schedule-day-section">
                    <div className="schedule-section-header">
                        <div>
                            <span className="panel-eyebrow">
                                Daily schedule
                            </span>

                            <h2>
                                {filteredSchedule.length}{" "}
                                {filteredSchedule.length === 1
                                    ? "event"
                                    : "events"}
                            </h2>
                        </div>

                        <span className="schedule-header-date">
                            {formatShortDate(selectedDate)}
                        </span>
                    </div>

                    {filteredSchedule.length === 0 ? (
                        <div className="schedule-empty-state">
                            <div className="schedule-empty-icon">
                                <CalendarDays size={30} />
                            </div>

                            <h3>No events scheduled</h3>

                            <p>
                                {schedule.length === 0
                                    ? "Your schedule is empty. Add your first event."
                                    : "There are no matching events for this date."}
                            </p>

                            {schedule.length === 0 ? (
                                <button
                                    type="button"
                                    className="primary-button"
                                    onClick={openAddModal}
                                >
                                    <Plus size={17} />
                                    Add your first event
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
                        <div className="schedule-timeline">
                            {filteredSchedule.map((item) => {
                                const expanded =
                                    expandedItem === item.id;

                                const itemColor = getColor(item.color);

                                return (
                                    <article
                                        className={`schedule-management-card ${expanded ? "expanded" : ""
                                            }`}
                                        key={item.id}
                                    >
                                        <div
                                            className="schedule-time-column"
                                        >
                                            <span>
                                                {item.startTime
                                                    ? formatTime(item.startTime)
                                                    : "--:--"}
                                            </span>

                                            {item.endTime && (
                                                <small>
                                                    {formatTime(item.endTime)}
                                                </small>
                                            )}
                                        </div>

                                        <div
                                            className="schedule-timeline-line"
                                            style={{
                                                background: itemColor,
                                            }}
                                        />

                                        <div
                                            className="schedule-management-card-body"
                                        >
                                            <div
                                                className="schedule-event-color"
                                                style={{
                                                    background: itemColor,
                                                }}
                                            />

                                            <div className="schedule-event-content">
                                                <div className="schedule-event-title-row">
                                                    <div>
                                                        <h3>{item.title}</h3>

                                                        <span className="schedule-category">
                                                            {item.category}
                                                        </span>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        className="schedule-more-button"
                                                        onClick={() =>
                                                            setExpandedItem(
                                                                expanded
                                                                    ? null
                                                                    : item.id
                                                            )
                                                        }
                                                        aria-label="Event options"
                                                    >
                                                        <MoreHorizontal size={19} />
                                                    </button>
                                                </div>

                                                {item.description && (
                                                    <p className="schedule-event-description">
                                                        {item.description}
                                                    </p>
                                                )}

                                                <div className="schedule-event-meta">
                                                    <span>
                                                        <Clock3 size={14} />
                                                        {getTimeRange(item)}
                                                    </span>

                                                    <span>
                                                        <CalendarDays size={14} />
                                                        {getRelativeDateLabel(
                                                            item.date
                                                        )}
                                                    </span>
                                                </div>

                                                {expanded && (
                                                    <div className="schedule-expanded-actions">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openEditModal(item)
                                                            }
                                                        >
                                                            <Edit3 size={16} />
                                                            Edit event
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="danger-action"
                                                            onClick={() =>
                                                                setDeleteTarget(item)
                                                            }
                                                        >
                                                            <Trash2 size={16} />
                                                            Delete event
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* UPCOMING EVENTS */}

                <aside className="upcoming-schedule-panel">
                    <div className="upcoming-panel-header">
                        <div>
                            <span className="panel-eyebrow">
                                Coming up
                            </span>

                            <h2>Upcoming</h2>
                        </div>

                        <Clock3 size={19} />
                    </div>

                    {upcomingSchedule.length === 0 ? (
                        <div className="upcoming-empty">
                            <CalendarDays size={25} />

                            <p>No upcoming events yet.</p>
                        </div>
                    ) : (
                        <div className="upcoming-list">
                            {upcomingSchedule.map((item) => (
                                <button
                                    type="button"
                                    className="upcoming-item"
                                    key={item.id}
                                    onClick={() =>
                                        setSelectedDate(
                                            new Date(`${item.date}T00:00:00`)
                                        )
                                    }
                                >
                                    <span
                                        className="upcoming-dot"
                                        style={{
                                            background: getColor(item.color),
                                        }}
                                    />

                                    <div className="upcoming-item-content">
                                        <strong>{item.title}</strong>

                                        <span>
                                            {getRelativeDateLabel(item.date)}
                                            {item.startTime
                                                ? ` • ${formatTime(
                                                    item.startTime
                                                )}`
                                                : ""}
                                        </span>
                                    </div>

                                    <ChevronRight size={16} />
                                </button>
                            ))}
                        </div>
                    )}

                    <button
                        type="button"
                        className="upcoming-add-button"
                        onClick={openAddModal}
                    >
                        <Plus size={16} />
                        Add event
                    </button>
                </aside>
            </div>

            {/* ADD / EDIT MODAL */}

            {showScheduleModal && (
                <div
                    className="modal-overlay"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closeModal();
                        }
                    }}
                >
                    <div className="modal schedule-modal">
                        <div className="modal-header">
                            <div>
                                <p className="modal-eyebrow">
                                    {editingItem
                                        ? "Update event"
                                        : "New event"}
                                </p>

                                <h2>
                                    {editingItem
                                        ? "Edit your event"
                                        : "Add to your schedule"}
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
                            className="schedule-form"
                            onSubmit={handleSubmit}
                        >
                            <div className="form-group">
                                <label htmlFor="schedule-title">
                                    Event title
                                </label>

                                <input
                                    id="schedule-title"
                                    name="title"
                                    type="text"
                                    placeholder="e.g. Database lecture"
                                    value={form.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="schedule-description">
                                    Description
                                </label>

                                <textarea
                                    id="schedule-description"
                                    name="description"
                                    rows="3"
                                    placeholder="Add some details about this event..."
                                    value={form.description}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="schedule-date">
                                        Date
                                    </label>

                                    <input
                                        id="schedule-date"
                                        name="date"
                                        type="date"
                                        value={form.date}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="schedule-category">
                                        Category
                                    </label>

                                    <select
                                        id="schedule-category"
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
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="schedule-start">
                                        Start time
                                    </label>

                                    <input
                                        id="schedule-start"
                                        name="startTime"
                                        type="time"
                                        value={form.startTime}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="schedule-end">
                                        End time
                                    </label>

                                    <input
                                        id="schedule-end"
                                        name="endTime"
                                        type="time"
                                        value={form.endTime}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Event color</label>

                                <div className="schedule-color-picker">
                                    {colors.map((color) => (
                                        <button
                                            type="button"
                                            key={color.name}
                                            className={`schedule-color-option ${form.color === color.name
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

                                    {editingItem
                                        ? "Save changes"
                                        : "Add event"}
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

                        <h2>Delete this event?</h2>

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
                                Delete event
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Schedule;