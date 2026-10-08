import { useMemo } from "react";
import {
    Activity,
    BarChart3,
    BookOpen,
    Brain,
    Check,
    CheckCircle2,
    Clock3,
    Droplets,
    Dumbbell,
    Flame,
    Palette,
    Target,
    TrendingUp,
    Trophy,
    FileText,
    CalendarDays,
} from "lucide-react";

import { useLife } from "../context/LifeContext";

const habitIconComponents = {
    BookOpen,
    Brain,
    Droplets,
    Dumbbell,
    Palette,
};

function Analytics() {
    const {
        tasks,
        goals,
        habits,
        schedule,
        notes,
    } = useLife();

    const analytics = useMemo(() => {
        const totalTasks = tasks.length;

        const completedTasks = tasks.filter(
            (task) => task.completed
        ).length;

        const pendingTasks = totalTasks - completedTasks;

        const taskCompletionRate =
            totalTasks > 0
                ? Math.round((completedTasks / totalTasks) * 100)
                : 0;

        const completedGoals = goals.filter(
            (goal) => Number(goal.progress) >= 100
        ).length;

        const averageGoalProgress =
            goals.length > 0
                ? Math.round(
                    goals.reduce(
                        (sum, goal) =>
                            sum + Number(goal.progress || 0),
                        0
                    ) / goals.length
                )
                : 0;

        const completedHabits = habits.filter(
            (habit) => habit.completedToday
        ).length;

        const habitCompletionRate =
            habits.length > 0
                ? Math.round(
                    (completedHabits / habits.length) * 100
                )
                : 0;

        const longestStreak =
            habits.length > 0
                ? Math.max(
                    ...habits.map(
                        (habit) => Number(habit.streak) || 0
                    )
                )
                : 0;

        const totalWords = notes.reduce((sum, note) => {
            if (!note.content?.trim()) {
                return sum;
            }

            return (
                sum +
                note.content
                    .trim()
                    .split(/\s+/)
                    .filter(Boolean).length
            );
        }, 0);

        const categoryCounts = {};

        tasks.forEach((task) => {
            const category = task.category || "Other";

            categoryCounts[category] =
                (categoryCounts[category] || 0) + 1;
        });

        const topCategories = Object.entries(categoryCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        const productivityScore = Math.round(
            taskCompletionRate * 0.4 +
            averageGoalProgress * 0.3 +
            habitCompletionRate * 0.3
        );

        return {
            totalTasks,
            completedTasks,
            pendingTasks,
            taskCompletionRate,
            completedGoals,
            averageGoalProgress,
            completedHabits,
            habitCompletionRate,
            longestStreak,
            totalWords,
            topCategories,
            productivityScore,
        };
    }, [tasks, goals, habits, notes]);

    const getScoreLabel = (score) => {
        if (score >= 85) {
            return "Excellent";
        }

        if (score >= 70) {
            return "Great";
        }

        if (score >= 50) {
            return "Good";
        }

        if (score >= 30) {
            return "Getting started";
        }

        return "Let's build momentum";
    };

    const getScoreMessage = (score) => {
        if (score >= 85) {
            return "You're maintaining a strong and consistent routine.";
        }

        if (score >= 70) {
            return "You're making great progress. Keep your momentum going.";
        }

        if (score >= 50) {
            return "You're on the right track. A little more consistency can make a big difference.";
        }

        if (score >= 30) {
            return "You've started building your system. Keep showing up every day.";
        }

        return "Start small, complete one task, and build from there.";
    };

    const maxCategoryCount =
        analytics.topCategories.length > 0
            ? Math.max(
                ...analytics.topCategories.map(
                    ([, count]) => count
                )
            )
            : 1;

    return (
        <div className="analytics-page">
            {/* PAGE INTRO */}

            <section className="page-intro">
                <div>
                    <p className="page-eyebrow">
                        <BarChart3 size={14} />
                        Your productivity
                    </p>

                    <h1>Analytics</h1>

                    <p>
                        Understand your progress and see where your time and
                        energy are going.
                    </p>
                </div>
            </section>

            {/* PRODUCTIVITY SCORE */}

            <section className="productivity-score-card">
                <div className="productivity-score-left">
                    <div className="productivity-score-icon">
                        <Trophy size={25} />
                    </div>

                    <div>
                        <span className="panel-eyebrow">
                            Overall productivity
                        </span>

                        <h2>
                            {getScoreLabel(
                                analytics.productivityScore
                            )}
                        </h2>

                        <p>
                            {getScoreMessage(
                                analytics.productivityScore
                            )}
                        </p>
                    </div>
                </div>

                <div className="productivity-score-circle">
                    <div>
                        <strong>
                            {analytics.productivityScore}
                        </strong>

                        <span>/100</span>
                    </div>
                </div>
            </section>

            {/* OVERVIEW */}

            <section className="analytics-stat-grid">
                <div className="analytics-stat-card">
                    <div className="analytics-stat-icon purple">
                        <CheckCircle2 size={21} />
                    </div>

                    <div>
                        <span>Task completion</span>
                        <strong>
                            {analytics.taskCompletionRate}%
                        </strong>

                        <small>
                            {analytics.completedTasks} completed
                        </small>
                    </div>

                    <div className="analytics-trend positive">
                        <TrendingUp size={14} />
                    </div>
                </div>

                <div className="analytics-stat-card">
                    <div className="analytics-stat-icon green">
                        <Target size={21} />
                    </div>

                    <div>
                        <span>Goal progress</span>
                        <strong>
                            {analytics.averageGoalProgress}%
                        </strong>

                        <small>
                            {analytics.completedGoals} completed
                        </small>
                    </div>

                    <div className="analytics-trend positive">
                        <TrendingUp size={14} />
                    </div>
                </div>

                <div className="analytics-stat-card">
                    <div className="analytics-stat-icon rose">
                        <Flame size={21} />
                    </div>

                    <div>
                        <span>Habit consistency</span>
                        <strong>
                            {analytics.habitCompletionRate}%
                        </strong>

                        <small>
                            {analytics.longestStreak} day best streak
                        </small>
                    </div>

                    <div className="analytics-trend positive">
                        <TrendingUp size={14} />
                    </div>
                </div>

                <div className="analytics-stat-card">
                    <div className="analytics-stat-icon blue">
                        <Activity size={21} />
                    </div>

                    <div>
                        <span>Pending tasks</span>
                        <strong>
                            {analytics.pendingTasks}
                        </strong>

                        <small>Tasks still to complete</small>
                    </div>

                    <div className="analytics-trend neutral">
                        <Clock3 size={14} />
                    </div>
                </div>
            </section>

            {/* PROGRESS BREAKDOWN */}

            <section className="analytics-two-column">
                <div className="analytics-panel">
                    <div className="analytics-panel-header">
                        <div>
                            <span className="panel-eyebrow">
                                Performance
                            </span>

                            <h2>Progress breakdown</h2>
                        </div>

                        <BarChart3 size={19} />
                    </div>

                    <div className="progress-breakdown">
                        {/* TASKS */}

                        <div className="breakdown-item">
                            <div className="breakdown-item-header">
                                <div>
                                    <span className="breakdown-icon purple">
                                        <Check size={14} />
                                    </span>

                                    <strong>Tasks</strong>
                                </div>

                                <span>
                                    {analytics.taskCompletionRate}%
                                </span>
                            </div>

                            <div className="analytics-progress-track">
                                <div
                                    className="analytics-progress-fill purple"
                                    style={{
                                        width: `${analytics.taskCompletionRate}%`,
                                    }}
                                />
                            </div>

                            <small>
                                {analytics.completedTasks} of{" "}
                                {analytics.totalTasks} completed
                            </small>
                        </div>

                        {/* GOALS */}

                        <div className="breakdown-item">
                            <div className="breakdown-item-header">
                                <div>
                                    <span className="breakdown-icon green">
                                        <Target size={14} />
                                    </span>

                                    <strong>Goals</strong>
                                </div>

                                <span>
                                    {analytics.averageGoalProgress}%
                                </span>
                            </div>

                            <div className="analytics-progress-track">
                                <div
                                    className="analytics-progress-fill green"
                                    style={{
                                        width: `${analytics.averageGoalProgress}%`,
                                    }}
                                />
                            </div>

                            <small>
                                Average progress across all goals
                            </small>
                        </div>

                        {/* HABITS */}

                        <div className="breakdown-item">
                            <div className="breakdown-item-header">
                                <div>
                                    <span className="breakdown-icon rose">
                                        <Flame size={14} />
                                    </span>

                                    <strong>Habits</strong>
                                </div>

                                <span>
                                    {analytics.habitCompletionRate}%
                                </span>
                            </div>

                            <div className="analytics-progress-track">
                                <div
                                    className="analytics-progress-fill rose"
                                    style={{
                                        width: `${analytics.habitCompletionRate}%`,
                                    }}
                                />
                            </div>

                            <small>
                                {analytics.completedHabits} of{" "}
                                {habits.length} completed today
                            </small>
                        </div>
                    </div>
                </div>

                {/* QUICK SUMMARY */}

                <div className="analytics-panel">
                    <div className="analytics-panel-header">
                        <div>
                            <span className="panel-eyebrow">
                                Activity summary
                            </span>

                            <h2>Your numbers</h2>
                        </div>

                        <Activity size={19} />
                    </div>

                    <div className="analytics-number-list">
                        <div className="analytics-number-item">
                            <div className="analytics-number-icon">
                                <CheckCircle2 size={18} />
                            </div>

                            <div>
                                <span>Completed tasks</span>
                                <strong>
                                    {analytics.completedTasks}
                                </strong>
                            </div>
                        </div>

                        <div className="analytics-number-item">
                            <div className="analytics-number-icon">
                                <Target size={18} />
                            </div>

                            <div>
                                <span>Active goals</span>
                                <strong>{goals.length}</strong>
                            </div>
                        </div>

                        <div className="analytics-number-item">
                            <div className="analytics-number-icon">
                                <Flame size={18} />
                            </div>

                            <div>
                                <span>Longest habit streak</span>
                                <strong>
                                    {analytics.longestStreak} days
                                </strong>
                            </div>
                        </div>

                        <div className="analytics-number-item">
                            <div className="analytics-number-icon">
                                <CalendarDays size={18} />
                            </div>

                            <div>
                                <span>Scheduled events</span>
                                <strong>{schedule.length}</strong>
                            </div>
                        </div>

                        <div className="analytics-number-item">
                            <div className="analytics-number-icon">
                                <FileText size={18} />
                            </div>

                            <div>
                                <span>Notes created</span>
                                <strong>{notes.length}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CATEGORY CHART */}

            <section className="analytics-panel category-analytics-panel">
                <div className="analytics-panel-header">
                    <div>
                        <span className="panel-eyebrow">
                            Task distribution
                        </span>

                        <h2>Where your work goes</h2>
                    </div>

                    <span className="analytics-panel-caption">
                        By category
                    </span>
                </div>

                {analytics.topCategories.length === 0 ? (
                    <div className="analytics-empty">
                        <BarChart3 size={28} />

                        <h3>No task data yet</h3>

                        <p>
                            Add some tasks to see your category
                            distribution.
                        </p>
                    </div>
                ) : (
                    <div className="category-chart">
                        {analytics.topCategories.map(
                            ([category, count], index) => {
                                const width =
                                    (count / maxCategoryCount) * 100;

                                return (
                                    <div
                                        className="category-bar-row"
                                        key={category}
                                    >
                                        <div className="category-bar-label">
                                            <span>
                                                {index + 1}
                                            </span>

                                            <strong>{category}</strong>

                                            <small>{count}</small>
                                        </div>

                                        <div className="category-bar-track">
                                            <div
                                                className="category-bar-fill"
                                                style={{
                                                    width: `${width}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                )}
            </section>

            {/* HABIT STREAK */}

            <section className="analytics-two-column">
                <div className="analytics-panel streak-panel">
                    <div className="analytics-panel-header">
                        <div>
                            <span className="panel-eyebrow">
                                Consistency
                            </span>

                            <h2>Habit streaks</h2>
                        </div>

                        <Flame size={19} />
                    </div>

                    {habits.length === 0 ? (
                        <div className="analytics-empty">
                            <Flame size={28} />

                            <h3>No habits yet</h3>

                            <p>
                                Create habits to start tracking your
                                consistency.
                            </p>
                        </div>
                    ) : (
                        <div className="streak-list">
                            {[...habits]
                                .sort(
                                    (a, b) =>
                                        Number(b.streak || 0) -
                                        Number(a.streak || 0)
                                )
                                .slice(0, 5)
                                .map((habit) => {
                                    const HabitIcon =
                                        habitIconComponents[habit.icon];

                                    return (
                                        <div
                                            className="streak-item"
                                            key={habit.id}
                                        >
                                            <div className="streak-habit-icon">
                                                {HabitIcon ? (
                                                    <HabitIcon size={18} />
                                                ) : (
                                                    habit.icon || "✓"
                                                )}
                                            </div>

                                            <div className="streak-habit-info">
                                                <strong>{habit.name}</strong>

                                                <span>
                                                    {habit.category}
                                                </span>
                                            </div>

                                            <div className="streak-value">
                                                <Flame size={15} />
                                                <strong>
                                                    {habit.streak || 0}
                                                </strong>
                                                <span>days</span>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                </div>

                {/* GOAL PROGRESS */}

                <div className="analytics-panel goal-analytics-panel">
                    <div className="analytics-panel-header">
                        <div>
                            <span className="panel-eyebrow">
                                Milestones
                            </span>

                            <h2>Goal progress</h2>
                        </div>

                        <Target size={19} />
                    </div>

                    {goals.length === 0 ? (
                        <div className="analytics-empty">
                            <Target size={28} />

                            <h3>No goals yet</h3>

                            <p>
                                Add a goal to start tracking your
                                milestones.
                            </p>
                        </div>
                    ) : (
                        <div className="goal-analytics-list">
                            {[...goals]
                                .sort(
                                    (a, b) =>
                                        Number(b.progress || 0) -
                                        Number(a.progress || 0)
                                )
                                .slice(0, 5)
                                .map((goal) => (
                                    <div
                                        className="goal-analytics-item"
                                        key={goal.id}
                                    >
                                        <div className="goal-analytics-heading">
                                            <strong>{goal.title}</strong>

                                            <span>
                                                {Number(goal.progress || 0)}%
                                            </span>
                                        </div>

                                        <div className="analytics-progress-track">
                                            <div
                                                className="analytics-progress-fill"
                                                style={{
                                                    width: `${Math.min(
                                                        100,
                                                        Number(goal.progress || 0)
                                                    )}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </section>

            {/* PRODUCTIVITY INSIGHT */}

            <section className="analytics-insight">
                <div className="analytics-insight-icon">
                    <TrendingUp size={21} />
                </div>

                <div>
                    <span>Productivity insight</span>

                    <h3>
                        {analytics.productivityScore >= 70
                            ? "You're building a strong productivity system."
                            : "Focus on consistency before adding more tasks."}
                    </h3>

                    <p>
                        {analytics.pendingTasks > 0
                            ? `You currently have ${analytics.pendingTasks} pending ${analytics.pendingTasks === 1
                                ? "task"
                                : "tasks"
                            }. Completing a few of them can quickly improve your productivity score.`
                            : "Your task list is clear. This is a great opportunity to focus on your goals and habits."}
                    </p>
                </div>
            </section>
        </div>
    );
}

export default Analytics;