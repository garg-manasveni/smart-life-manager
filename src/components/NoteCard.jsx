import {
    Pin,
    Trash2
} from "lucide-react";

import { useLife }
    from "../context/LifeContext";


export default function NoteCard({
    note
}) {

    const {
        updateNote,
        deleteNote
    } = useLife();


    return (

        <article className="note-card">

            <div className="note-top">

                <span className="tag">
                    {note.tag}
                </span>


                <div className="row-actions">

                    <button
                        className={
                            `icon-button ${note.pinned
                                ? "active"
                                : ""
                            }`
                        }
                        onClick={() =>
                            updateNote(
                                note.id,
                                {
                                    pinned:
                                        !note.pinned
                                }
                            )
                        }
                    >

                        <Pin size={16} />

                    </button>


                    <button
                        className="icon-button danger"
                        onClick={() =>
                            deleteNote(
                                note.id
                            )
                        }
                    >

                        <Trash2 size={16} />

                    </button>

                </div>

            </div>


            <h3>
                {note.title}
            </h3>


            <p>
                {note.content}
            </p>


            <small>
                Updated {note.updatedAt}
            </small>

        </article>

    );

}