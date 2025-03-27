export default function PastHabit({ filteredHabits, setIsModalOpen }) {

    return (
        <div className="past-habit-container">
            <h3>history</h3>
            <button className="open-calendar" onClick={() => setIsModalOpen(true)}>Open Modal</button>
            <ul className="box-of-list">
                {filteredHabits.map((completedHabit) => (
                    <li className="past-habit-list" key={completedHabit.id}>
                        {completedHabit.name} - {completedHabit.category} ({completedHabit.date})
                    </li>
                ))}
            </ul>
        </div>
    );
}