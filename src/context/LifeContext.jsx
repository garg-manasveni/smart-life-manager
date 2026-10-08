import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

/*
========================================================
SMART LIFE MANAGER - GLOBAL LIFE CONTEXT
========================================================

This file stores the main application data:

- Tasks
- Goals
- Habits
- Schedule
- Notes
- Dashboard statistics

It also provides functions to:

- Add tasks
- Complete tasks
- Delete tasks
- Add goals
- Update goals
- Delete goals
- Add habits
- Mark habits complete
- Delete habits
- Add schedule items
- Delete schedule items
- Add notes
- Update notes
- Delete notes

Data is saved in localStorage so refreshing the browser
does NOT remove the user's information.
========================================================
*/


// ======================================================
// CREATE CONTEXT
// ======================================================

const LifeContext = createContext();


// ======================================================
// LOCAL STORAGE HELPER
// ======================================================

const loadFromStorage = (key, fallbackValue) => {
    try {
        const storedData = localStorage.getItem(key);

        if (!storedData) {
            return fallbackValue;
        }

        return JSON.parse(storedData);
    } catch (error) {
        console.error(
            `Unable to load ${key} from localStorage:`,
            error
        );

        return fallbackValue;
    }
};


// ======================================================
// PROVIDER
// ======================================================

export function LifeProvider({ children }) {

    // ====================================================
    // TASKS
    // ====================================================

    const [tasks, setTasks] = useState(() =>
        loadFromStorage("smart-life-tasks", [
            {
                id: 1,
                title: "Complete React project",
                description: "Finish the Smart Life Manager dashboard",
                category: "Study",
                priority: "High",
                dueDate: "2026-10-06",
                completed: false,
            },
            {
                id: 2,
                title: "Review DSA concepts",
                description: "Revise arrays, strings and recursion",
                category: "Study",
                priority: "Medium",
                dueDate: "2026-10-07",
                completed: false,
            },
            {
                id: 3,
                title: "Organize portfolio",
                description: "Update projects and portfolio sections",
                category: "Personal",
                priority: "Low",
                dueDate: "2026-10-08",
                completed: true,
            },
        ])
    );


    // ====================================================
    // GOALS
    // ====================================================

    const [goals, setGoals] = useState(() =>
        loadFromStorage("smart-life-goals", [
            {
                id: 1,
                title: "Build a strong portfolio",
                description:
                    "Create and polish impressive projects for my portfolio.",
                category: "Career",
                progress: 65,
                targetDate: "2026-12-31",
                color: "purple",
            },
            {
                id: 2,
                title: "Improve programming skills",
                description:
                    "Practice DSA and improve problem-solving skills.",
                category: "Education",
                progress: 45,
                targetDate: "2026-12-15",
                color: "blue",
            },
            {
                id: 3,
                title: "Maintain a consistent routine",
                description:
                    "Build productive daily habits and manage time better.",
                category: "Personal",
                progress: 72,
                targetDate: "2026-11-30",
                color: "green",
            },
        ])
    );


    // ====================================================
    // HABITS
    // ====================================================

    const [habits, setHabits] = useState(() =>
        loadFromStorage("smart-life-habits", [
            {
                id: 1,
                name: "Study for 1 hour",
                icon: "📚",
                category: "Study",
                streak: 5,
                completedToday: true,
                history: [],
            },
            {
                id: 2,
                name: "Drink enough water",
                icon: "💧",
                category: "Health",
                streak: 8,
                completedToday: false,
                history: [],
            },
            {
                id: 3,
                name: "Read for 20 minutes",
                icon: "📖",
                category: "Personal",
                streak: 3,
                completedToday: false,
                history: [],
            },
            {
                id: 4,
                name: "Plan tomorrow",
                icon: "📝",
                category: "Productivity",
                streak: 6,
                completedToday: true,
                history: [],
            },
        ])
    );


    // ====================================================
    // SCHEDULE
    // ====================================================

    const [schedule, setSchedule] = useState(() =>
        loadFromStorage("smart-life-schedule", [
            {
                id: 1,
                title: "College Classes",
                description: "Computer Science & AI",
                date: "2026-10-06",
                startTime: "11:00",
                endTime: "18:00",
                category: "College",
                color: "purple",
            },
            {
                id: 2,
                title: "DSA Practice",
                description: "Practice coding problems",
                date: "2026-10-06",
                startTime: "19:30",
                endTime: "20:30",
                category: "Study",
                color: "blue",
            },
            {
                id: 3,
                title: "Portfolio Work",
                description: "Work on Smart Life Manager",
                date: "2026-10-06",
                startTime: "21:00",
                endTime: "22:30",
                category: "Projects",
                color: "green",
            },
        ])
    );


    // ====================================================
    // NOTES
    // ====================================================

    const [notes, setNotes] = useState(() =>
        loadFromStorage("smart-life-notes", [
            {
                id: 1,
                title: "Project Ideas",
                content:
                    "Add more useful productivity features to Smart Life Manager.",
                category: "Ideas",
                color: "purple",
                createdAt: "2026-10-01",
                updatedAt: "2026-10-01",
            },
            {
                id: 2,
                title: "Things to learn",
                content:
                    "React, Node.js, MongoDB, system design and DSA.",
                category: "Learning",
                color: "blue",
                createdAt: "2026-10-02",
                updatedAt: "2026-10-02",
            },
        ])
    );


    // ====================================================
    // SAVE TASKS
    // ====================================================

    useEffect(() => {
        localStorage.setItem(
            "smart-life-tasks",
            JSON.stringify(tasks)
        );
    }, [tasks]);


    // ====================================================
    // SAVE GOALS
    // ====================================================

    useEffect(() => {
        localStorage.setItem(
            "smart-life-goals",
            JSON.stringify(goals)
        );
    }, [goals]);


    // ====================================================
    // SAVE HABITS
    // ====================================================

    useEffect(() => {
        localStorage.setItem(
            "smart-life-habits",
            JSON.stringify(habits)
        );
    }, [habits]);


    // ====================================================
    // SAVE SCHEDULE
    // ====================================================

    useEffect(() => {
        localStorage.setItem(
            "smart-life-schedule",
            JSON.stringify(schedule)
        );
    }, [schedule]);


    // ====================================================
    // SAVE NOTES
    // ====================================================

    useEffect(() => {
        localStorage.setItem(
            "smart-life-notes",
            JSON.stringify(notes)
        );
    }, [notes]);


    // ====================================================
    // TASK FUNCTIONS
    // ====================================================

    const addTask = (taskData) => {
        const newTask = {
            id: Date.now(),
            title: taskData.title || "Untitled task",
            description: taskData.description || "",
            category: taskData.category || "Personal",
            priority: taskData.priority || "Medium",
            dueDate: taskData.dueDate || "",
            completed: false,
        };

        setTasks((currentTasks) => [
            newTask,
            ...currentTasks,
        ]);

        return newTask;
    };


    const updateTask = (taskId, updatedData) => {
        setTasks((currentTasks) =>
            currentTasks.map((task) =>
                task.id === taskId
                    ? {
                        ...task,
                        ...updatedData,
                    }
                    : task
            )
        );
    };


    const toggleTask = (taskId) => {
        setTasks((currentTasks) =>
            currentTasks.map((task) =>
                task.id === taskId
                    ? {
                        ...task,
                        completed: !task.completed,
                    }
                    : task
            )
        );
    };


    const deleteTask = (taskId) => {
        setTasks((currentTasks) =>
            currentTasks.filter(
                (task) => task.id !== taskId
            )
        );
    };


    // ====================================================
    // GOAL FUNCTIONS
    // ====================================================

    const addGoal = (goalData) => {
        const newGoal = {
            id: Date.now(),
            title: goalData.title || "Untitled goal",
            description: goalData.description || "",
            category: goalData.category || "Personal",
            progress: Number(goalData.progress) || 0,
            targetDate: goalData.targetDate || "",
            color: goalData.color || "purple",
        };

        setGoals((currentGoals) => [
            newGoal,
            ...currentGoals,
        ]);

        return newGoal;
    };


    const updateGoal = (goalId, updatedData) => {
        setGoals((currentGoals) =>
            currentGoals.map((goal) =>
                goal.id === goalId
                    ? {
                        ...goal,
                        ...updatedData,
                        progress:
                            updatedData.progress !== undefined
                                ? Math.min(
                                    100,
                                    Math.max(
                                        0,
                                        Number(updatedData.progress)
                                    )
                                )
                                : goal.progress,
                    }
                    : goal
            )
        );
    };


    const updateGoalProgress = (goalId, progress) => {
        const safeProgress = Math.min(
            100,
            Math.max(0, Number(progress))
        );

        setGoals((currentGoals) =>
            currentGoals.map((goal) =>
                goal.id === goalId
                    ? {
                        ...goal,
                        progress: safeProgress,
                    }
                    : goal
            )
        );
    };


    const deleteGoal = (goalId) => {
        setGoals((currentGoals) =>
            currentGoals.filter(
                (goal) => goal.id !== goalId
            )
        );
    };


    // ====================================================
    // HABIT FUNCTIONS
    // ====================================================

    const addHabit = (habitData) => {
        const newHabit = {
            id: Date.now(),
            name: habitData.name || "New habit",
            icon: habitData.icon || "✨",
            category: habitData.category || "Personal",
            streak: 0,
            completedToday: false,
            history: [],
        };

        setHabits((currentHabits) => [
            newHabit,
            ...currentHabits,
        ]);

        return newHabit;
    };


    const toggleHabit = (habitId) => {
        const today = new Date()
            .toISOString()
            .split("T")[0];

        setHabits((currentHabits) =>
            currentHabits.map((habit) => {
                if (habit.id !== habitId) {
                    return habit;
                }

                const isCompleting =
                    !habit.completedToday;

                let updatedHistory = Array.isArray(
                    habit.history
                )
                    ? [...habit.history]
                    : [];

                if (isCompleting) {
                    if (!updatedHistory.includes(today)) {
                        updatedHistory.push(today);
                    }
                } else {
                    updatedHistory = updatedHistory.filter(
                        (date) => date !== today
                    );
                }

                return {
                    ...habit,
                    completedToday: isCompleting,
                    streak: isCompleting
                        ? habit.streak + 1
                        : Math.max(0, habit.streak - 1),
                    history: updatedHistory,
                };
            })
        );
    };


    const updateHabit = (habitId, updatedData) => {
        setHabits((currentHabits) =>
            currentHabits.map((habit) =>
                habit.id === habitId
                    ? {
                        ...habit,
                        ...updatedData,
                    }
                    : habit
            )
        );
    };


    const deleteHabit = (habitId) => {
        setHabits((currentHabits) =>
            currentHabits.filter(
                (habit) => habit.id !== habitId
            )
        );
    };


    // ====================================================
    // SCHEDULE FUNCTIONS
    // ====================================================

    const addScheduleItem = (scheduleData) => {
        const newScheduleItem = {
            id: Date.now(),
            title:
                scheduleData.title || "New event",
            description:
                scheduleData.description || "",
            date: scheduleData.date || "",
            startTime:
                scheduleData.startTime || "09:00",
            endTime:
                scheduleData.endTime || "10:00",
            category:
                scheduleData.category || "Personal",
            color:
                scheduleData.color || "purple",
        };

        setSchedule((currentSchedule) => [
            ...currentSchedule,
            newScheduleItem,
        ]);

        return newScheduleItem;
    };


    const updateScheduleItem = (
        scheduleId,
        updatedData
    ) => {
        setSchedule((currentSchedule) =>
            currentSchedule.map((item) =>
                item.id === scheduleId
                    ? {
                        ...item,
                        ...updatedData,
                    }
                    : item
            )
        );
    };


    const deleteScheduleItem = (scheduleId) => {
        setSchedule((currentSchedule) =>
            currentSchedule.filter(
                (item) => item.id !== scheduleId
            )
        );
    };


    // ====================================================
    // NOTE FUNCTIONS
    // ====================================================

    const addNote = (noteData) => {
        const today = new Date()
            .toISOString()
            .split("T")[0];

        const newNote = {
            id: Date.now(),
            title: noteData.title || "Untitled note",
            content: noteData.content || "",
            category: noteData.category || "General",
            color: noteData.color || "purple",
            createdAt: today,
            updatedAt: today,
        };

        setNotes((currentNotes) => [
            newNote,
            ...currentNotes,
        ]);

        return newNote;
    };


    const updateNote = (noteId, updatedData) => {
        const today = new Date()
            .toISOString()
            .split("T")[0];

        setNotes((currentNotes) =>
            currentNotes.map((note) =>
                note.id === noteId
                    ? {
                        ...note,
                        ...updatedData,
                        updatedAt: today,
                    }
                    : note
            )
        );
    };


    const deleteNote = (noteId) => {
        setNotes((currentNotes) =>
            currentNotes.filter(
                (note) => note.id !== noteId
            )
        );
    };


    // ====================================================
    // DASHBOARD STATISTICS
    // ====================================================

    const statistics = useMemo(() => {

        const totalTasks = tasks.length;

        const completedTasks = tasks.filter(
            (task) => task.completed
        ).length;

        const pendingTasks =
            totalTasks - completedTasks;

        const totalGoals = goals.length;

        const completedGoals = goals.filter(
            (goal) => goal.progress >= 100
        ).length;

        const averageGoalProgress =
            totalGoals > 0
                ? Math.round(
                    goals.reduce(
                        (total, goal) =>
                            total + Number(goal.progress || 0),
                        0
                    ) / totalGoals
                )
                : 0;

        const completedHabitsToday =
            habits.filter(
                (habit) => habit.completedToday
            ).length;

        const totalHabits = habits.length;

        const habitCompletionRate =
            totalHabits > 0
                ? Math.round(
                    (completedHabitsToday /
                        totalHabits) *
                    100
                )
                : 0;

        const totalNotes = notes.length;

        return {
            totalTasks,
            completedTasks,
            pendingTasks,
            totalGoals,
            completedGoals,
            averageGoalProgress,
            completedHabitsToday,
            totalHabits,
            habitCompletionRate,
            totalNotes,
            totalScheduleItems:
                schedule.length,
        };

    }, [
        tasks,
        goals,
        habits,
        notes,
        schedule,
    ]);


    // ====================================================
    // RESET ALL DATA
    // ====================================================

    const resetAllData = () => {

        setTasks([]);
        setGoals([]);
        setHabits([]);
        setSchedule([]);
        setNotes([]);

        localStorage.removeItem(
            "smart-life-tasks"
        );

        localStorage.removeItem(
            "smart-life-goals"
        );

        localStorage.removeItem(
            "smart-life-habits"
        );

        localStorage.removeItem(
            "smart-life-schedule"
        );

        localStorage.removeItem(
            "smart-life-notes"
        );
    };


    // ====================================================
    // CONTEXT VALUE
    // ====================================================

    const value = {

        // Data
        tasks,
        goals,
        habits,
        schedule,
        notes,

        // Statistics
        statistics,

        // Task functions
        addTask,
        updateTask,
        toggleTask,
        deleteTask,

        // Goal functions
        addGoal,
        updateGoal,
        updateGoalProgress,
        deleteGoal,

        // Habit functions
        addHabit,
        updateHabit,
        toggleHabit,
        deleteHabit,

        // Schedule functions
        addScheduleItem,
        updateScheduleItem,
        deleteScheduleItem,

        // Note functions
        addNote,
        updateNote,
        deleteNote,

        // Utility
        resetAllData,
    };


    // ====================================================
    // RETURN PROVIDER
    // ====================================================

    return (
        <LifeContext.Provider value={value}>
            {children}
        </LifeContext.Provider>
    );
}


// ======================================================
// CUSTOM HOOK
// ======================================================

export function useLife() {

    const context = useContext(LifeContext);

    if (!context) {
        throw new Error(
            "useLife must be used inside a LifeProvider"
        );
    }

    return context;
}


// ======================================================
// DEFAULT EXPORT
// ======================================================

export default LifeContext;