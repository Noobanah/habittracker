export default function PastHabit({ filteredHabits, setIsModalOpen, date }) {
    return (
        <div className="past-habit-container">
            <h2>History</h2>
            <button className="open-calendar" onClick={() => setIsModalOpen("calendar")}>{date}</button>
            <div className="box-of-list">
                {Object.keys(filteredHabits).length > 0 ? (
                    Object.entries(filteredHabits).map(([category, habits]) => (
                        <div key={category}>
                            <h3>{category}</h3>
                            <ul className="past-habit-list">
                                {habits.map((completedHabit) => (
                                    <li key={completedHabit.id} >
                                        {completedHabit.name} 
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                ) : (
                    <p>No habits recorded for this date.</p>
                )}
            </div>
        </div>
    );
}