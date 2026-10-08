export function taskStats(tasks) {

    const completed =
        tasks.filter(
            (task) => task.completed
        ).length;

    const total = tasks.length;

    return {

        total,

        completed,

        pending:
            total - completed,

        completionRate:
            total
                ? Math.round(
                    (completed / total) * 100
                )
                : 0

    };
}


export function sortTasks(
    tasks,
    filter = "all"
) {

    const filtered =

        filter === "completed"

            ? tasks.filter(
                (task) => task.completed
            )

            : filter === "pending"

                ? tasks.filter(
                    (task) => !task.completed
                )

                : tasks;


    return [...filtered].sort(
        (a, b) =>
            Number(a.completed) -
            Number(b.completed)
    );

}