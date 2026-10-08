import {
    CheckCircle2,
    X
} from "lucide-react";

import { useEffect } from "react";

import { useLife }
    from "../context/LifeContext";


export default function Notification() {

    const {
        notice,
        setNotice
    } = useLife();


    useEffect(() => {

        if (!notice) {
            return;
        }


        const timer =
            setTimeout(
                () => setNotice(null),
                2600
            );


        return () =>
            clearTimeout(timer);

    }, [
        notice,
        setNotice
    ]);


    if (!notice) {
        return null;
    }


    return (

        <div
            className={
                `toast ${notice.type}`
            }
        >

            <CheckCircle2 size={18} />

            <span>
                {notice.message}
            </span>


            <button
                onClick={() =>
                    setNotice(null)
                }
            >

                <X size={15} />

            </button>

        </div>

    );

}