import {
    Check,
    Circle,
    Trash2
} from "lucide-react";

import { useLife }
    from "../context/LifeContext";

import {
    formatDate
} from "../utils/dateUtils";


export default function TaskCard({
    task
}) {

    const {
        updateTask,
        deleteTask
    } = useLife();


    return (

        <article
            className={
                `task-card ${task.completed
                    ? "is-complete"
                    : ""
                }`
            }
        >

            <button
                className="check-button"
                onClick={() =>
                    updateTask(
                        task.id,
                        {
                            completed:
                                !task.completed
                        }
                    )
                }
                aria-label="Toggle task"
            >

                {task.completed ? (
                    <Check size={18} />
                ) : (
                    <Circle size={18} />
                )}

            </button>


            <div className="task-main">

                <h3>
                    {task.title}
                </h3>


                <div className="item-meta">

                    <span>
                        {task.category}
                    </span>

                    <span
                        className={
                            `priority priority-${task.priority.toLowerCase()}`
                        }
                    >
                        {task.priority}
                    </span>

                    <span>
                        {formatDate(
                            task.dueDate
                        )}
                    </span>

                </div>

            </div>


            <button
                className="icon-button danger"
                onClick={() =>
                    deleteTask(task.id)
                }
                aria-label="Delete task"
            >

                <Trash2 size={17} />

            </button>

        </article>

    );

}