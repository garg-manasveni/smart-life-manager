export function formatDate(value) {

    if (!value) {
        return "No date";
    }

    return new Intl.DateTimeFormat(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    ).format(new Date(value));

}


export function isToday(value) {

    if (!value) {
        return false;
    }

    const date = new Date(value);
    const today = new Date();

    return (
        date.toDateString() ===
        today.toDateString()
    );

}


export function daysUntil(value) {

    const target = new Date(value);
    const today = new Date();

    target.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return Math.ceil(
        (target - today) /
        86400000
    );

}


export function formatTime(time) {

    if (!time) {
        return "";
    }

    const [hours, minutes] =
        time.split(":");

    const hour = Number(hours);

    const suffix =
        hour >= 12 ? "PM" : "AM";

    return `${hour % 12 || 12
        }:${minutes} ${suffix}`;

}