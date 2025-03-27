export default function PastHabit({ filteredHabits, setIsModalOpen }) {

    return (
        <div>
            <h3>history</h3>
            <button onClick={() => setIsModalOpen(true)}>Open Modal</button>
            <ul>
                {filteredHabits.map((completedHabit) => (
                    <li key={completedHabit.id}>
                        {completedHabit.name} - {completedHabit.category} ({completedHabit.date})
                    </li>
                ))}
            </ul>
        </div>
    );
}