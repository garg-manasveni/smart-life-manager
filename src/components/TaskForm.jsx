import { useState } from "react";
import { Plus } from "lucide-react";

import { useLife }
    from "../context/LifeContext";


export default function TaskForm() {

    const { addTask } =
        useLife();


    const [form, setForm] =
        useState({

            title: "",

            category: "Personal",

            priority: "Medium",

            dueDate: ""

        });


    const submit = (event) => {

        event.preventDefault();


        if (!form.title.trim()) {
            return;
        }


        addTask({

            ...form,

            title:
                form.title.trim(),

            completed: false

        });


        setForm({

            title: "",

            category: "Personal",

            priority: "Medium",

            dueDate: ""

        });

    };


    return (

        <form
            className="inline-form"
            onSubmit={submit}
        >

            <input
                value={form.title}
                onChange={(event) =>
                    setForm({
                        ...form,
                        title:
                            event.target.value
                    })
                }
                placeholder="What needs to be done?"
            />


            <select
                value={form.category}
                onChange={(event) =>
                    setForm({
                        ...form,
                        category:
                            event.target.value
                    })
                }
            >

                <option>
                    Personal
                </option>

                <option>
                    College
                </option>

                <option>
                    Coding
                </option>

                <option>
                    Creative
                </option>

            </select>


            <select
                value={form.priority}
                onChange={(event) =>
                    setForm({
                        ...form,
                        priority:
                            event.target.value
                    })
                }
            >

                <option>
                    Low
                </option>

                <option>
                    Medium
                </option>

                <option>
                    High
                </option>

            </select>


            <input
                type="date"
                value={form.dueDate}
                onChange={(event) =>
                    setForm({
                        ...form,
                        dueDate:
                            event.target.value
                    })
                }
            />


            <button
                className="primary-button"
                type="submit"
            >

                <Plus size={17} />

                Add task

            </button>

        </form>

    );

}