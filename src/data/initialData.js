export const initialTasks = [
    {
        id: "t1",
        title: "Finish portfolio case study",
        category: "College",
        priority: "High",
        dueDate: "2026-10-06",
        completed: false,
        createdAt: "2026-10-05"
    },

    {
        id: "t2",
        title: "Practice React components",
        category: "Coding",
        priority: "Medium",
        dueDate: "2026-10-06",
        completed: true,
        createdAt: "2026-10-04"
    },

    {
        id: "t3",
        title: "Read 20 pages",
        category: "Personal",
        priority: "Low",
        dueDate: "2026-10-07",
        completed: false,
        createdAt: "2026-10-05"
    },

    {
        id: "t4",
        title: "Prepare viva notes",
        category: "College",
        priority: "High",
        dueDate: "2026-10-08",
        completed: false,
        createdAt: "2026-10-05"
    }
];


export const initialHabits = [
    {
        id: "h1",
        name: "Study for 60 minutes",
        icon: "BookOpen",
        color: "purple",
        frequency: "Daily",
        streak: 5,
        completedToday: false,
        history: []
    },

    {
        id: "h2",
        name: "Drink enough water",
        icon: "Droplets",
        color: "blue",
        frequency: "Daily",
        streak: 8,
        completedToday: true,
        history: []
    },

    {
        id: "h3",
        name: "Plan tomorrow",
        icon: "CalendarCheck",
        color: "green",
        frequency: "Daily",
        streak: 3,
        completedToday: false,
        history: []
    },

    {
        id: "h4",
        name: "Creative practice",
        icon: "Palette",
        color: "rose",
        frequency: "Daily",
        streak: 4,
        completedToday: true,
        history: []
    }
];


export const initialGoals = [
    {
        id: "g1",
        title: "Build a strong portfolio",
        description:
            "Create polished projects that demonstrate frontend and AI skills.",
        category: "Career",
        target: 10,
        current: 6,
        deadline: "2026-12-31"
    },

    {
        id: "g2",
        title: "Complete DSA practice",
        description:
            "Solve consistent problems and improve problem-solving confidence.",
        category: "Learning",
        target: 100,
        current: 42,
        deadline: "2026-12-15"
    },

    {
        id: "g3",
        title: "Grow creative work",
        description:
            "Maintain a consistent creative design and art practice.",
        category: "Creative",
        target: 30,
        current: 12,
        deadline: "2026-12-31"
    }
];


export const initialNotes = [
    {
        id: "n1",
        title: "MERN revision",
        content:
            "Review Express routing, middleware, MongoDB CRUD and authentication.",
        tag: "Study",
        pinned: true,
        updatedAt: "2026-10-05"
    },

    {
        id: "n2",
        title: "Portfolio ideas",
        content:
            "Keep projects visually polished and explain the problem, process and technical decisions.",
        tag: "Career",
        pinned: false,
        updatedAt: "2026-10-04"
    },

    {
        id: "n3",
        title: "Creative ideas",
        content:
            "Poster series, room decor designs, sketch-to-paint transitions and digital illustrations.",
        tag: "Creative",
        pinned: false,
        updatedAt: "2026-10-03"
    }
];


export const initialSchedule = [
    {
        id: "s1",
        title: "College classes",
        day: "Monday",
        start: "11:00",
        end: "18:00",
        type: "College"
    },

    {
        id: "s2",
        title: "College classes",
        day: "Tuesday",
        start: "11:00",
        end: "14:00",
        type: "College"
    },

    {
        id: "s3",
        title: "College classes",
        day: "Wednesday",
        start: "11:00",
        end: "14:00",
        type: "College"
    },

    {
        id: "s4",
        title: "College classes",
        day: "Thursday",
        start: "11:00",
        end: "14:00",
        type: "College"
    },

    {
        id: "s5",
        title: "College classes",
        day: "Friday",
        start: "11:00",
        end: "18:00",
        type: "College"
    },

    {
        id: "s6",
        title: "Project / personal time",
        day: "Saturday",
        start: "16:00",
        end: "18:00",
        type: "Personal"
    },

    {
        id: "s7",
        title: "Weekly planning",
        day: "Sunday",
        start: "18:00",
        end: "18:30",
        type: "Personal"
    }
];


export const initialExpenses = [
    {
        id: "e1",
        title: "Hostel supplies",
        amount: 350,
        category: "Personal",
        date: "2026-10-03"
    },

    {
        id: "e2",
        title: "Stationery",
        amount: 180,
        category: "Study",
        date: "2026-10-04"
    }
];


export const initialSettings = {
    name: "Manasveni",
    focusMinutes: 25,
    notifications: true,
    compactMode: false
};