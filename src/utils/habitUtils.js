export function habitStats(
    habits
) {

    const completed =
        habits.filter(
            (habit) =>
                habit.completedToday
        ).length;


    return {

        total: habits.length,

        completed,

        rate:
            habits.length
                ? Math.round(
                    (completed /
                        habits.length) *
                    100
                )
                : 0,

        bestStreak:
            habits.reduce(
                (best, habit) =>
                    Math.max(
                        best,
                        habit.streak || 0
                    ),
                0
            )

    };

}


export function weeklyHabitData(
    habits
) {

    const labels = [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun"
    ];


    return labels.map(
        (day) => ({

            day,

            completed:
                Math.round(
                    (
                        habits.filter(
                            (habit) =>
                                habit.completedToday
                        ).length /
                        Math.max(
                            habits.length,
                            1
                        )
                    ) * 100
                )

        })
    );

}