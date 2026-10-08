import {
    Check,
    Flame,
    Trash2
} from "lucide-react";

import { useLife }
    from "../context/LifeContext";


export default function HabitCard({
    habit
}) {

    const {
        toggleHabit,
        deleteHabit
    } = useLife();


    return (

        <article className="habit-card">

            <div
                className={
                    `habit-dot ${habit.color}`
                }
            />


            <div className="habit-content">

                <h3>
                    {habit.name}
                </h3>

                <p>
                    {habit.frequency}
                    {" · "}
                    {habit.streak}
                    {" day streak"}
                </p>

            </div>


            <div className="habit-actions">

                <span className="streak">

                    <Flame size={15} />

                    {habit.streak}

                </span>


                <button
                    className={
                        `habit-check ${habit.completedToday
                            ? "done"
                            : ""
                        }`
                    }
                    onClick={() =>
                        toggleHabit(
                            habit.id
                        )
                    }
                >

                    <Check size={18} />

                </button>


                <button
                    className="icon-button danger"
                    onClick={() =>
                        deleteHabit(
                            habit.id
                        )
                    }
                >

                    <Trash2 size={16} />

                </button>

            </div>

        </article>

    );

}