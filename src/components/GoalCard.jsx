import {
    Target,
    Trash2
} from "lucide-react";

import { useLife }
    from "../context/LifeContext";

import {
    goalPercent
} from "../utils/goalUtils";

import ProgressBar
    from "./ProgressBar";


export default function GoalCard({
    goal
}) {

    const {
        updateGoal,
        deleteGoal
    } = useLife();


    const percent =
        goalPercent(goal);


    const increment = () => {

        updateGoal(
            goal.id,
            {
                current:
                    Math.min(
                        goal.target,
                        goal.current + 1
                    )
            }
        );

    };


    return (

        <article className="goal-card">

            <div className="goal-heading">

                <div className="goal-icon">

                    <Target size={20} />

                </div>


                <div>

                    <h3>
                        {goal.title}
                    </h3>

                    <span>
                        {goal.category}
                    </span>

                </div>


                <button
                    className="icon-button danger"
                    onClick={() =>
                        deleteGoal(
                            goal.id
                        )
                    }
                >

                    <Trash2 size={16} />

                </button>

            </div>


            <p>
                {goal.description}
            </p>


            <ProgressBar
                value={percent}
            />


            <div className="goal-footer">

                <span>
                    {goal.current}
                    {" / "}
                    {goal.target}
                    {" completed"}
                </span>


                <button
                    className="secondary-button small"
                    onClick={increment}
                    disabled={
                        percent >= 100
                    }
                >
                    +1 progress
                </button>

            </div>

        </article>

    );

}