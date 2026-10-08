import {
    Clock,
    Trash2
} from "lucide-react";

import { useLife }
    from "../context/LifeContext";

import {
    formatTime
} from "../utils/dateUtils";


export default function ScheduleItem({
    item
}) {

    const {
        deleteScheduleItem
    } = useLife();


    return (

        <div className="schedule-item">

            <div className="schedule-time">

                <Clock size={15} />

                {formatTime(item.start)}

                {" – "}

                {formatTime(item.end)}

            </div>


            <div>

                <strong>
                    {item.title}
                </strong>

                <span>
                    {item.type}
                </span>

            </div>


            <button
                className="icon-button danger"
                onClick={() =>
                    deleteScheduleItem(
                        item.id
                    )
                }
            >

                <Trash2 size={15} />

            </button>

        </div>

    );

}