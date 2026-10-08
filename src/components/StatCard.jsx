export default function StatCard({
    icon: Icon,
    label,
    value,
    detail,
    tone = "purple"
}) {

    return (

        <div
            className={
                `stat-card tone-${tone}`
            }
        >

            <div className="stat-icon">

                <Icon size={21} />

            </div>


            <div>

                <span>
                    {label}
                </span>

                <strong>
                    {value}
                </strong>

                {detail && (

                    <small>
                        {detail}
                    </small>

                )}

            </div>

        </div>

    );

}