export function goalPercent(
    goal
) {

    if (!goal.target) {
        return 0;
    }

    return Math.min(
        100,
        Math.round(
            (goal.current /
                goal.target) *
            100
        )
    );

}


export function overallGoalProgress(
    goals
) {

    if (!goals.length) {
        return 0;
    }

    return Math.round(

        goals.reduce(
            (sum, goal) =>
                sum + goalPercent(goal),
            0
        ) / goals.length

    );

}