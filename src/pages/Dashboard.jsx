import {
    CheckCircle2,
    Circle,
    Clock3,
    Target,
    Flame,
    ArrowRight,
    Plus,
    CalendarDays,
    MoreHorizontal,
    Sparkles,
    TrendingUp,
    ListTodo,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useLife } from "../context/LifeContext";


// ======================================================
// HELPER FUNCTIONS
// ======================================================

const formatDate = (dateString) => {
    if (!dateString) {
        return "No date";
    }

    const date = new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
    });
};


const getToday = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};


// ======================================================
// DASHBOARD COMPONENT
// ======================================================

function Dashboard() {

    const navigate = useNavigate();

    const {
        tasks,
        goals,
        habits,
        schedule,
        statistics,
        toggleTask,
        toggleHabit,
    } = useLife();


    // ====================================================
    // TODAY
    // ====================================================

    const today = getToday();


    // ====================================================
    // TASK DATA
    // ====================================================

    const upcomingTasks = [...tasks]
        .filter((task) => !task.completed)
        .sort((a, b) => {
            const dateA = a.dueDate || "9999-12-31";
            const dateB = b.dueDate || "9999-12-31";
            const dateOrder = dateA.localeCompare(dateB);

            if (dateOrder !== 0) {
                return dateOrder;
            }

            const priorityOrder = {
                high: 0,
                medium: 1,
                low: 2,
            };

            return (
                (priorityOrder[String(a.priority).toLowerCase()] ?? 3) -
                (priorityOrder[String(b.priority).toLowerCase()] ?? 3)
            );
        })
        .slice(0, 4);


    // ====================================================
    // TODAY'S SCHEDULE
    // ====================================================

    const todaySchedule = schedule
        .filter((item) => item.date === today)
        .sort((a, b) =>
            (a.startTime || "").localeCompare(b.startTime || "")
        )
        .slice(0, 4);

    const upcomingSchedule = schedule
        .filter((item) => item.date >= today)
        .sort((a, b) => {
            const dateOrder = a.date.localeCompare(b.date);

            if (dateOrder !== 0) {
                return dateOrder;
            }

            return (a.startTime || "").localeCompare(b.startTime || "");
        })
        .slice(0, 4);

    const displaySchedule =
        todaySchedule.length > 0 ? todaySchedule : upcomingSchedule;
    const scheduleTitle =
        todaySchedule.length > 0 ? "Today's schedule" : "Upcoming schedule";


    // ====================================================
    // TOP GOALS
    // ====================================================

    const topGoals = [...goals]
        .sort(
            (a, b) =>
                Number(b.progress) -
                Number(a.progress)
        )
        .slice(0, 3);


    // ====================================================
    // COMPLETION PERCENTAGE
    // ====================================================

    const taskCompletionPercentage =
        statistics.totalTasks > 0
            ? Math.round(
                (statistics.completedTasks /
                    statistics.totalTasks) *
                100
            )
            : 0;


    // ====================================================
    // GREETING
    // ====================================================

    const currentHour = new Date().getHours();

    let greeting = "Good morning";

    if (currentHour >= 12 && currentHour < 17) {
        greeting = "Good afternoon";
    } else if (currentHour >= 17) {
        greeting = "Good evening";
    }

    const overdueTasks = tasks.filter(
        (task) =>
            !task.completed &&
            task.dueDate &&
            task.dueDate < today
    );

    const insightTitle = overdueTasks.length > 0
        ? "Start with an overdue task"
        : statistics.pendingTasks === 0
            ? "Your task list is clear"
            : "Make your next step count";

    const insightDescription = overdueTasks.length > 0
        ? `You have ${overdueTasks.length} overdue task${overdueTasks.length === 1 ? "" : "s"}. Review the deadline and choose a realistic next action.`
        : `${statistics.pendingTasks} task${statistics.pendingTasks === 1 ? "" : "s"} still open. You've completed ${statistics.habitCompletionRate}% of today's habits.`;


    // ====================================================
    // RENDER
    // ====================================================

    return (
        <div className="dashboard-page">

            {/* =================================================
          WELCOME BANNER
      ================================================= */}

            <section className="welcome-banner">

                <div className="welcome-content">

                    <div className="welcome-label">
                        <Sparkles size={15} />
                        YOUR PERSONAL PRODUCTIVITY SPACE
                    </div>

                    <h2>
                        {greeting}, Manasveni
                    </h2>

                    <p>
                        Organize your day, track your progress,
                        and make time for what matters.
                    </p>

                    <button
                        className="welcome-button"
                        onClick={() => navigate("/tasks")}
                    >
                        <Plus size={17} />
                        Add a task
                    </button>

                </div>


                {/* Decorative illustration */}

                <div className="welcome-decoration">

                    <div className="welcome-orbit orbit-one" />
                    <div className="welcome-orbit orbit-two" />
                    <div className="welcome-orbit orbit-three" />

                    <div className="welcome-spark spark-one">
                        ✦
                    </div>

                    <div className="welcome-spark spark-two">
                        ✧
                    </div>

                    <div className="welcome-center">
                        <Target size={42} />
                    </div>

                </div>

            </section>


            {/* =================================================
          STATISTICS
      ================================================= */}

            <section className="dashboard-stats">

                {/* Tasks */}

                <div className="stat-card">

                    <div className="stat-card-top">

                        <div className="stat-icon stat-icon-purple">
                            <ListTodo size={20} />
                        </div>

                        <span className="stat-card-label">
                            TASKS
                        </span>

                    </div>


                    <div className="stat-card-value">
                        {statistics.completedTasks}
                        <span>
                            / {statistics.totalTasks}
                        </span>
                    </div>


                    <div className="stat-card-bottom">

                        <span>
                            {taskCompletionPercentage}% completed
                        </span>

                        <div className="stat-mini-progress">
                            <div
                                style={{
                                    width: `${taskCompletionPercentage}%`,
                                }}
                            />
                        </div>

                    </div>

                </div>


                {/* Goals */}

                <div className="stat-card">

                    <div className="stat-card-top">

                        <div className="stat-icon stat-icon-blue">
                            <Target size={20} />
                        </div>

                        <span className="stat-card-label">
                            GOALS
                        </span>

                    </div>


                    <div className="stat-card-value">
                        {statistics.averageGoalProgress}
                        <span>%</span>
                    </div>


                    <div className="stat-card-bottom">
                        Average goal progress
                    </div>

                </div>


                {/* Habits */}

                <div className="stat-card">

                    <div className="stat-card-top">

                        <div className="stat-icon stat-icon-green">
                            <Flame size={20} />
                        </div>

                        <span className="stat-card-label">
                            HABITS
                        </span>

                    </div>


                    <div className="stat-card-value">
                        {statistics.completedHabitsToday}
                        <span>
                            / {statistics.totalHabits}
                        </span>
                    </div>


                    <div className="stat-card-bottom">
                        {statistics.habitCompletionRate}%
                        completed today
                    </div>

                </div>


                {/* Schedule */}

                <div className="stat-card">

                    <div className="stat-card-top">

                        <div className="stat-icon stat-icon-rose">
                            <CalendarDays size={20} />
                        </div>

                        <span className="stat-card-label">
                            SCHEDULE
                        </span>

                    </div>


                    <div className="stat-card-value">
                        {statistics.totalScheduleItems}
                    </div>


                    <div className="stat-card-bottom">
                        Planned events
                    </div>

                </div>

            </section>


            {/* =================================================
          MAIN DASHBOARD GRID
      ================================================= */}

            <section className="dashboard-grid">

                {/* =================================================
            TODAY'S TASKS
        ================================================= */}

                <div className="panel tasks-panel">

                    <div className="panel-header">

                        <div>
                            <span className="panel-eyebrow">
                                TASKS
                            </span>

                            <h3>
                                Priority tasks
                            </h3>
                        </div>


                        <button
                            className="panel-link"
                            onClick={() => navigate("/tasks")}
                        >
                            View all
                            <ArrowRight size={15} />
                        </button>

                    </div>


                    <div className="task-list">

                        {upcomingTasks.length === 0 ? (

                            <div className="empty-state">

                                <CheckCircle2 size={32} />

                                <h4>
                                    All caught up!
                                </h4>

                                <p>
                                    You don't have any pending tasks.
                                </p>

                                <button
                                    onClick={() =>
                                        navigate("/tasks")
                                    }
                                >
                                    Add a task
                                </button>

                            </div>

                        ) : (

                            upcomingTasks.map((task) => (

                                <div
                                    className={`task-card ${task.completed
                                            ? "completed"
                                            : ""
                                        }`}
                                    key={task.id}
                                >

                                    <button
                                        className="task-checkbox"
                                        onClick={() =>
                                            toggleTask(task.id)
                                        }
                                        aria-label={
                                            task.completed
                                                ? "Mark task incomplete"
                                                : "Mark task complete"
                                        }
                                    >
                                        {task.completed ? (
                                            <CheckCircle2 size={21} />
                                        ) : (
                                            <Circle size={21} />
                                        )}
                                    </button>


                                    <div className="task-card-content">

                                        <h4>
                                            {task.title}
                                        </h4>

                                        {task.description && (
                                            <p>
                                                {task.description}
                                            </p>
                                        )}


                                        <div className="task-card-meta">

                                            <span
                                                className={`priority-badge priority-${String(
                                                    task.priority
                                                ).toLowerCase()}`}
                                            >
                                                {task.priority}
                                            </span>


                                            {task.dueDate && (
                                                <span className="task-date">
                                                    <Clock3 size={13} />
                                                    {formatDate(
                                                        task.dueDate
                                                    )}
                                                </span>
                                            )}

                                        </div>

                                    </div>


                                    <button
                                        className="task-more-button"
                                        aria-label="More options"
                                    >
                                        <MoreHorizontal size={18} />
                                    </button>

                                </div>

                            ))

                        )}

                    </div>

                </div>


                {/* =================================================
            GOALS
        ================================================= */}

                <div className="panel goals-panel">

                    <div className="panel-header">

                        <div>
                            <span className="panel-eyebrow">
                                GOALS
                            </span>

                            <h3>
                                Goal progress
                            </h3>
                        </div>


                        <button
                            className="panel-link"
                            onClick={() => navigate("/goals")}
                        >
                            View all
                            <ArrowRight size={15} />
                        </button>

                    </div>


                    <div className="goal-list">

                        {topGoals.length === 0 ? (

                            <div className="empty-state">

                                <Target size={32} />

                                <h4>
                                    No goals yet
                                </h4>

                                <p>
                                    Create your first goal.
                                </p>

                                <button
                                    onClick={() =>
                                        navigate("/goals")
                                    }
                                >
                                    Create goal
                                </button>

                            </div>

                        ) : (

                            topGoals.map((goal) => (

                                <div
                                    className="goal-card"
                                    key={goal.id}
                                >

                                    <div className="goal-card-header">

                                        <div className="goal-title-wrapper">

                                            <div
                                                className={`goal-dot goal-dot-${goal.color}`}
                                            />

                                            <h4>
                                                {goal.title}
                                            </h4>

                                        </div>

                                        <span className="goal-percentage">
                                            {goal.progress}%
                                        </span>

                                    </div>


                                    <div className="goal-progress">

                                        <div className="goal-progress-track">

                                            <div
                                                className={`goal-progress-fill goal-progress-${goal.color}`}
                                                style={{
                                                    width: `${goal.progress}%`,
                                                }}
                                            />

                                        </div>

                                    </div>


                                    <div className="goal-card-footer">

                                        <span>
                                            {goal.category}
                                        </span>

                                        {goal.targetDate && (
                                            <span>
                                                Target:{" "}
                                                {formatDate(
                                                    goal.targetDate
                                                )}
                                            </span>
                                        )}

                                    </div>

                                </div>

                            ))

                        )}

                    </div>

                </div>


                {/* =================================================
            HABITS
        ================================================= */}

                <div className="panel habits-panel">

                    <div className="panel-header">

                        <div>
                            <span className="panel-eyebrow">
                                HABITS
                            </span>

                            <h3>
                                Today's habits
                            </h3>
                        </div>


                        <button
                            className="panel-link"
                            onClick={() => navigate("/habits")}
                        >
                            View all
                            <ArrowRight size={15} />
                        </button>

                    </div>


                    <div className="habit-list">

                        {habits.slice(0, 4).map((habit) => (

                            <div
                                className={`habit-card ${habit.completedToday
                                        ? "completed"
                                        : ""
                                    }`}
                                key={habit.id}
                            >

                                <button
                                    className="habit-icon"
                                    onClick={() =>
                                        toggleHabit(habit.id)
                                    }
                                    aria-label="Toggle habit"
                                >
                                    {habit.icon}
                                </button>


                                <div className="habit-card-content">

                                    <h4>
                                        {habit.name}
                                    </h4>

                                    <span>
                                        {habit.streak} day
                                        {habit.streak !== 1
                                            ? "s"
                                            : ""}{" "}
                                        streak
                                    </span>

                                </div>


                                <button
                                    className={`habit-check ${habit.completedToday
                                            ? "checked"
                                            : ""
                                        }`}
                                    onClick={() =>
                                        toggleHabit(habit.id)
                                    }
                                    aria-label="Complete habit"
                                >

                                    {habit.completedToday ? (
                                        <CheckCircle2 size={22} />
                                    ) : (
                                        <Circle size={22} />
                                    )}

                                </button>

                            </div>

                        ))}

                    </div>

                </div>


                {/* =================================================
            SCHEDULE
        ================================================= */}

                <div className="panel schedule-panel">

                    <div className="panel-header">

                        <div>
                            <span className="panel-eyebrow">
                                SCHEDULE
                            </span>

                            <h3>
                                {scheduleTitle}
                            </h3>
                        </div>


                        <button
                            className="panel-link"
                            onClick={() =>
                                navigate("/schedule")
                            }
                        >
                            View calendar
                            <ArrowRight size={15} />
                        </button>

                    </div>


                    <div className="schedule-list">

                        {displaySchedule.length === 0 ? (

                            <div className="empty-state">

                                <CalendarDays size={32} />

                                <h4>
                                    Nothing scheduled
                                </h4>

                                <p>
                                    Your schedule is clear.
                                </p>

                            </div>

                        ) : (

                            displaySchedule.map((item) => (

                                <div
                                    className="schedule-item"
                                    key={item.id}
                                >

                                    <div className="schedule-time">

                                        <strong>
                                            {item.startTime}
                                        </strong>

                                        <span>
                                            {item.endTime}
                                        </span>

                                    </div>


                                    <div
                                        className={`schedule-line schedule-line-${item.color}`}
                                    />


                                    <div className="schedule-content">

                                        <h4>
                                            {item.title}
                                        </h4>

                                        <p>
                                            {item.description}
                                        </p>

                                        {item.date !== today && (
                                            <span className="schedule-date">
                                                {formatDate(item.date)}
                                            </span>
                                        )}

                                        <span className="schedule-category">
                                            {item.category}
                                        </span>

                                    </div>

                                </div>

                            ))

                        )}

                    </div>

                </div>

            </section>


            {/* =================================================
          PRODUCTIVITY INSIGHT
      ================================================= */}

            <section className="productivity-insight">

                <div className="insight-icon">
                    <TrendingUp size={22} />
                </div>


                <div className="insight-content">

                    <span className="insight-label">
                        PRODUCTIVITY INSIGHT
                    </span>

                    <h3>
                        {insightTitle}
                    </h3>

                    <p>
                        {insightDescription}
                    </p>

                </div>


                <button
                    className="insight-button"
                    onClick={() => navigate("/analytics")}
                >
                    See analytics
                    <ArrowRight size={16} />
                </button>

            </section>

        </div>
    );
}


export default Dashboard;