import { Inbox } from "lucide-react";

export default function EmptyState({
    title = "Nothing here yet",
    text = "Add your first item to get started.",
    action
}) {

    return (

        <div className="empty-state">

            <div className="empty-icon">
                <Inbox size={24} />
            </div>

            <h3>
                {title}
            </h3>

            <p>
                {text}
            </p>

            {action}

        </div>

    );

}