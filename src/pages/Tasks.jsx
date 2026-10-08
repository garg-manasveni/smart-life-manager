import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
    CheckCircle2,
    Circle,
    Clock3,
    Plus,
    Search,
    SlidersHorizontal,
    Trash2,
    Pencil,
    X,
    CalendarDays,
    Flag,
    ListTodo,
    Check,
    AlertCircle,
} from "lucide-react";

import { useLife } from "../context/LifeContext";


// ======================================================
// HELPER FUNCTIONS
// ======================================================

const emptyTask = {
    title: "",
    description: "",
    category: "Personal",
    priority: "Medium",
    dueDate: "",
};


// ======================================================
// TASKS PAGE
// ======================================================

function Tasks() {

    const [searchParams, setSearchParams] = useSearchParams();
    const searchTerm = searchParams.get("search") || "";

    const {
        tasks,
        addTask,
        updateTask,
        toggleTask,
        deleteTask,
    } = useLife();


    // ====================================================
    // STATE
    // ====================================================

    const [statusFilter, setStatusFilter] =
        useState("all");

    const [priorityFilter, setPriorityFilter] =
        useState("all");

    const [showFilters, setShowFilters] =
        useState(false);

    const [showModal, setShowModal] =
        useState(false);

    const [editingTask, setEditingTask] =
        useState(null);

    const [taskForm, setTaskForm] =
        useState(emptyTask);

    const [deleteId, setDeleteId] =
        useState(null);

    const handleSearchChange = (value) => {
        const nextParams = new URLSearchParams(searchParams);

        if (value) {
            nextParams.set("search", value);
        } else {
            nextParams.delete("search");
        }

        setSearchParams(nextParams, { replace: true });
    };


    // ====================================================
    // FILTER TASKS
    // ====================================================

    const filteredTasks = useMemo(() => {

        return tasks.filter((task) => {

            const search =
                searchTerm.toLowerCase().trim();

            const matchesSearch =
                !search ||
                task.title
                    .toLowerCase()
                    .includes(search) ||
                task.description
                    .toLowerCase()
                    .includes(search) ||
                task.category
                    .toLowerCase()
                    .includes(search);


            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "completed" &&
                    task.completed) ||
                (statusFilter === "pending" &&
                    !task.completed);


            const matchesPriority =
                priorityFilter === "all" ||
                task.priority.toLowerCase() ===
                priorityFilter.toLowerCase();


            return (
                matchesSearch &&
                matchesStatus &&
                matchesPriority
            );
        });

    }, [
        tasks,
        searchTerm,
        statusFilter,
        priorityFilter,
    ]);


    // ====================================================
    // TASK STATISTICS
    // ====================================================

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(
        (task) => task.completed
    ).length;

    const pendingTasks = tasks.filter(
        (task) => !task.completed
    ).length;

    const highPriorityTasks = tasks.filter(
        (task) =>
            !task.completed &&
            task.priority === "High"
    ).length;


    // ====================================================
    // OPEN ADD MODAL
    // ====================================================

    const openAddModal = () => {

        setEditingTask(null);

        setTaskForm({
            ...emptyTask,
        });

        setShowModal(true);
    };


    // ====================================================
    // OPEN EDIT MODAL
    // ====================================================

    const openEditModal = (task) => {

        setEditingTask(task);

        setTaskForm({
            title: task.title || "",
            description: task.description || "",
            category: task.category || "Personal",
            priority: task.priority || "Medium",
            dueDate: task.dueDate || "",
        });

        setShowModal(true);
    };


    // ====================================================
    // CLOSE MODAL
    // ====================================================

    const closeModal = () => {

        setShowModal(false);

        setEditingTask(null);

        setTaskForm({
            ...emptyTask,
        });
    };


    // ====================================================
    // FORM CHANGE
    // ====================================================

    const handleFormChange = (event) => {

        const {
            name,
            value,
        } = event.target;

        setTaskForm((currentForm) => ({
            ...currentForm,
            [name]: value,
        }));
    };


    // ====================================================
    // SUBMIT TASK
    // ====================================================

    const handleSubmit = (event) => {

        event.preventDefault();


        if (!taskForm.title.trim()) {
            return;
        }


        if (editingTask) {

            updateTask(
                editingTask.id,
                taskForm
            );

        } else {

            addTask(taskForm);

        }


        closeModal();
    };


    // ====================================================
    // DELETE TASK
    // ====================================================

    const handleDelete = () => {

        if (!deleteId) {
            return;
        }

        deleteTask(deleteId);

        setDeleteId(null);
    };


    // ====================================================
    // FORMAT DATE
    // ====================================================

    const formatDate = (dateString) => {

        if (!dateString) {
            return "No due date";
        }

        const date = new Date(
            `${dateString}T00:00:00`
        );

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
            }
        );
    };


    // ====================================================
    // CHECK IF OVERDUE
    // ====================================================

    const isOverdue = (task) => {

        if (
            task.completed ||
            !task.dueDate
        ) {
            return false;
        }

        const today =
            new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );

        const dueDate =
            new Date(
                `${task.dueDate}T00:00:00`
            );

        return dueDate < today;
    };


    // ====================================================
    // RENDER
    // ====================================================

    return (
        <div className="tasks-page">


            {/* =================================================
          PAGE INTRO
      ================================================= */}

            <section className="page-intro">

                <div>

                    <span className="page-eyebrow">
                        ORGANIZE YOUR WORK
                    </span>

                    <h2>
                        All Tasks
                    </h2>

                    <p>
                        Keep track of everything you need
                        to accomplish.
                    </p>

                </div>


                <button
                    className="primary-button"
                    onClick={openAddModal}
                >
                    <Plus size={18} />
                    Add Task
                </button>

            </section>


            {/* =================================================
          STAT CARDS
      ================================================= */}

            <section className="task-stat-grid">


                {/* Total */}

                <div className="task-stat-card">

                    <div className="task-stat-icon purple">
                        <ListTodo size={20} />
                    </div>

                    <div>

                        <span>
                            Total Tasks
                        </span>

                        <strong>
                            {totalTasks}
                        </strong>

                    </div>

                </div>


                {/* Pending */}

                <div className="task-stat-card">

                    <div className="task-stat-icon blue">
                        <Clock3 size={20} />
                    </div>

                    <div>

                        <span>
                            Pending
                        </span>

                        <strong>
                            {pendingTasks}
                        </strong>

                    </div>

                </div>


                {/* Completed */}

                <div className="task-stat-card">

                    <div className="task-stat-icon green">
                        <CheckCircle2 size={20} />
                    </div>

                    <div>

                        <span>
                            Completed
                        </span>

                        <strong>
                            {completedTasks}
                        </strong>

                    </div>

                </div>


                {/* High Priority */}

                <div className="task-stat-card">

                    <div className="task-stat-icon rose">
                        <Flag size={20} />
                    </div>

                    <div>

                        <span>
                            High Priority
                        </span>

                        <strong>
                            {highPriorityTasks}
                        </strong>

                    </div>

                </div>

            </section>


            {/* =================================================
          TASK CONTROLS
      ================================================= */}

            <section className="task-controls">


                {/* Search */}

                <div className="task-search">

                    <Search size={18} />

                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(event) =>
                            handleSearchChange(event.target.value)
                        }
                    />

                    {searchTerm && (
                        <button
                            onClick={() =>
                                handleSearchChange("")
                            }
                            aria-label="Clear search"
                        >
                            <X size={15} />
                        </button>
                    )}

                </div>


                {/* Filter button */}

                <button
                    className={`filter-button ${showFilters
                            ? "active"
                            : ""
                        }`}
                    onClick={() =>
                        setShowFilters(
                            (current) => !current
                        )
                    }
                >
                    <SlidersHorizontal size={17} />
                    Filters
                </button>

            </section>


            {/* =================================================
          FILTER PANEL
      ================================================= */}

            {showFilters && (

                <section className="filter-panel">

                    <div className="filter-group">

                        <label>
                            Status
                        </label>

                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(
                                    event.target.value
                                )
                            }
                        >

                            <option value="all">
                                All Tasks
                            </option>

                            <option value="pending">
                                Pending
                            </option>

                            <option value="completed">
                                Completed
                            </option>

                        </select>

                    </div>


                    <div className="filter-group">

                        <label>
                            Priority
                        </label>

                        <select
                            value={priorityFilter}
                            onChange={(event) =>
                                setPriorityFilter(
                                    event.target.value
                                )
                            }
                        >

                            <option value="all">
                                All Priorities
                            </option>

                            <option value="high">
                                High
                            </option>

                            <option value="medium">
                                Medium
                            </option>

                            <option value="low">
                                Low
                            </option>

                        </select>

                    </div>


                    <button
                        className="clear-filters"
                        onClick={() => {
                            setStatusFilter("all");
                            setPriorityFilter("all");
                        }}
                    >
                        Clear filters
                    </button>

                </section>

            )}


            {/* =================================================
          TASK LIST
      ================================================= */}

            <section className="tasks-container">

                <div className="tasks-container-header">

                    <div>

                        <h3>
                            {statusFilter === "all"
                                ? "All Tasks"
                                : statusFilter === "pending"
                                    ? "Pending Tasks"
                                    : "Completed Tasks"}
                        </h3>

                        <span>
                            {filteredTasks.length} task
                            {filteredTasks.length !== 1
                                ? "s"
                                : ""}
                        </span>

                    </div>

                </div>


                {filteredTasks.length === 0 ? (

                    /* =============================================
                       EMPTY STATE
                    ============================================= */

                    <div className="tasks-empty-state">

                        <div className="empty-icon">
                            <CheckCircle2 size={30} />
                        </div>

                        <h3>
                            No tasks found
                        </h3>

                        <p>
                            {searchTerm
                                ? "Try changing your search or filters."
                                : "You're all caught up. Add a new task to get started."}
                        </p>

                        {!searchTerm && (
                            <button
                                className="primary-button"
                                onClick={openAddModal}
                            >
                                <Plus size={17} />
                                Create Task
                            </button>
                        )}

                    </div>

                ) : (

                    <div className="full-task-list">

                        {filteredTasks.map((task) => (

                            <article
                                className={`full-task-card ${task.completed
                                        ? "completed"
                                        : ""
                                    }`}
                                key={task.id}
                            >

                                {/* Checkbox */}

                                <button
                                    className="full-task-checkbox"
                                    onClick={() =>
                                        toggleTask(task.id)
                                    }
                                    aria-label={
                                        task.completed
                                            ? "Mark incomplete"
                                            : "Mark complete"
                                    }
                                >

                                    {task.completed ? (
                                        <CheckCircle2
                                            size={23}
                                        />
                                    ) : (
                                        <Circle
                                            size={23}
                                        />
                                    )}

                                </button>


                                {/* Main information */}

                                <div className="full-task-main">

                                    <div className="full-task-title-row">

                                        <h4>
                                            {task.title}
                                        </h4>

                                        <span
                                            className={`priority-badge priority-${task.priority.toLowerCase()}`}
                                        >
                                            {task.priority}
                                        </span>

                                    </div>


                                    {task.description && (

                                        <p className="full-task-description">
                                            {task.description}
                                        </p>

                                    )}


                                    <div className="full-task-meta">

                                        <span className="task-category">
                                            {task.category}
                                        </span>


                                        {task.dueDate && (

                                            <span
                                                className={`full-task-date ${isOverdue(task)
                                                        ? "overdue"
                                                        : ""
                                                    }`}
                                            >

                                                <CalendarDays
                                                    size={14}
                                                />

                                                {isOverdue(task)
                                                    ? "Overdue · "
                                                    : ""}

                                                {formatDate(
                                                    task.dueDate
                                                )}

                                            </span>

                                        )}

                                    </div>

                                </div>


                                {/* Actions */}

                                <div className="full-task-actions">

                                    <button
                                        className="task-action-button"
                                        onClick={() =>
                                            openEditModal(task)
                                        }
                                        title="Edit task"
                                        aria-label="Edit task"
                                    >
                                        <Pencil size={17} />
                                    </button>


                                    <button
                                        className="task-action-button danger"
                                        onClick={() =>
                                            setDeleteId(task.id)
                                        }
                                        title="Delete task"
                                        aria-label="Delete task"
                                    >
                                        <Trash2 size={17} />
                                    </button>

                                </div>

                            </article>

                        ))}

                    </div>

                )}

            </section>


            {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

            {showModal && (

                <div
                    className="modal-overlay"
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            closeModal();
                        }

                    }}
                >

                    <div className="modal">

                        {/* Modal header */}

                        <div className="modal-header">

                            <div>

                                <span className="modal-eyebrow">
                                    TASK MANAGER
                                </span>

                                <h3>
                                    {editingTask
                                        ? "Edit Task"
                                        : "Create New Task"}
                                </h3>

                            </div>


                            <button
                                className="modal-close"
                                onClick={closeModal}
                                aria-label="Close"
                            >
                                <X size={20} />
                            </button>

                        </div>


                        {/* Form */}

                        <form
                            className="task-form"
                            onSubmit={handleSubmit}
                        >

                            {/* Title */}

                            <div className="form-group">

                                <label htmlFor="task-title">
                                    Task title
                                </label>

                                <input
                                    id="task-title"
                                    name="title"
                                    type="text"
                                    placeholder="e.g. Complete DSA practice"
                                    value={taskForm.title}
                                    onChange={handleFormChange}
                                    autoFocus
                                    required
                                />

                            </div>


                            {/* Description */}

                            <div className="form-group">

                                <label htmlFor="task-description">
                                    Description
                                </label>

                                <textarea
                                    id="task-description"
                                    name="description"
                                    placeholder="Add some details about this task..."
                                    value={taskForm.description}
                                    onChange={handleFormChange}
                                    rows="4"
                                />

                            </div>


                            {/* Category + Priority */}

                            <div className="form-row">

                                <div className="form-group">

                                    <label htmlFor="task-category">
                                        Category
                                    </label>

                                    <select
                                        id="task-category"
                                        name="category"
                                        value={taskForm.category}
                                        onChange={handleFormChange}
                                    >

                                        <option value="Personal">
                                            Personal
                                        </option>

                                        <option value="Study">
                                            Study
                                        </option>

                                        <option value="Work">
                                            Work
                                        </option>

                                        <option value="Health">
                                            Health
                                        </option>

                                        <option value="Projects">
                                            Projects
                                        </option>

                                        <option value="Other">
                                            Other
                                        </option>

                                    </select>

                                </div>


                                <div className="form-group">

                                    <label htmlFor="task-priority">
                                        Priority
                                    </label>

                                    <select
                                        id="task-priority"
                                        name="priority"
                                        value={taskForm.priority}
                                        onChange={handleFormChange}
                                    >

                                        <option value="High">
                                            High
                                        </option>

                                        <option value="Medium">
                                            Medium
                                        </option>

                                        <option value="Low">
                                            Low
                                        </option>

                                    </select>

                                </div>

                            </div>


                            {/* Due date */}

                            <div className="form-group">

                                <label htmlFor="task-dueDate">
                                    Due date
                                </label>

                                <input
                                    id="task-dueDate"
                                    name="dueDate"
                                    type="date"
                                    value={taskForm.dueDate}
                                    onChange={handleFormChange}
                                />

                            </div>


                            {/* Form actions */}

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

                                    {editingTask ? (
                                        <>
                                            <Check size={17} />
                                            Save Changes
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={17} />
                                            Create Task
                                        </>
                                    )}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* =================================================
          DELETE CONFIRMATION
      ================================================= */}

            {deleteId && (

                <div
                    className="modal-overlay"
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            setDeleteId(null);
                        }

                    }}
                >

                    <div className="confirmation-modal">

                        <div className="confirmation-icon">
                            <AlertCircle size={28} />
                        </div>

                        <h3>
                            Delete this task?
                        </h3>

                        <p>
                            This action cannot be undone.
                            The task will be permanently
                            removed from your list.
                        </p>

                        <div className="confirmation-actions">

                            <button
                                className="secondary-button"
                                onClick={() =>
                                    setDeleteId(null)
                                }
                            >
                                Cancel
                            </button>

                            <button
                                className="delete-button"
                                onClick={handleDelete}
                            >
                                <Trash2 size={16} />
                                Delete Task
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}


export default Tasks;