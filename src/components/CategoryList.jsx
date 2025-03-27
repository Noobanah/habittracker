import { useState } from "react";

export default function CategoryList({ habitList, onAddHabit, onComplete, onDeleteCategory, onDeleteHabit }) {
    const categoryList = Object.entries(habitList);
    const [habitInputs, setHabitInputs] = useState({}); 

    function handleChange(event, categoryName) {
        setHabitInputs((prev) => ({
            ...prev,
            [categoryName]: event.target.value,
        }));
    }

    function handleKeydown(event, categoryName) {
        if (event.key === "Enter") {
            event.preventDefault();
    
            const newHabit = habitInputs[categoryName]?.trim();
            if (!newHabit) return;
    
            onAddHabit(newHabit, categoryName);
            setHabitInputs((prev) => ({
                ...prev,
                [categoryName]: "",
            }));
        }
    }

    return (
        <ul>
            {categoryList.map(([categoryName, habits]) => (
                <li key={categoryName} className="category-item">
                    <div className="category-header">
                        <strong>{categoryName}</strong>
                        <button onClick={() => onDeleteCategory(categoryName)}>Delete Category</button>
                    </div>
                    <div className="add-habit">
                        <input
                            value={habitInputs[categoryName] || ""}
                            onChange={(event) => handleChange(event, categoryName)}
                            onKeyDown={(event) => handleKeydown(event, categoryName)}
                            placeholder="Add New Habit"
                        />
                    </div>
                    <ul>
                        {habits.map((habit) => (
                            <li key={habit.id} className="habit-item">
                                <span className="habit-name"> {habit.name} {habit.amount} </span>
                                <div className="habit-actions">
                                    {habit.completed ? <button className="minus-btn" onClick={() => onComplete(habit.id, categoryName, - 1)}>-</button> :
                                    <button className="plus-btn" onClick={() => onComplete(habit.id, categoryName, 1)}>+</button>}
                                    <button className="delete-btn" onClick={() => onDeleteHabit(habit.id, categoryName)}>Delete Habit</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </li>
            ))}
        </ul>
    );
}