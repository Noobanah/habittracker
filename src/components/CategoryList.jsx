import { useState } from "react";

export default function CategoryList({ habitList, onAddHabit, onComplete, onDeleteCategory, onDeleteHabit, onEdit, onSubmitEdit }) {
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

    function handleEditKeyDown(event, categoryName, habitId) {
        if (event.key === "Enter") {
            event.preventDefault();
    
            const editedHabit = habitInputs[categoryName]?.trim() || ""; // Ensure it has a valid string
    
            if (editedHabit) {
                onSubmitEdit(editedHabit, categoryName, habitId);
                setHabitInputs((prev) => ({
                    ...prev,
                    [categoryName]: "",
                }));
            }
        }
    }

    return (
        <div className="container">
            <ul className="category-card">
            {categoryList.map(([categoryName, habits]) => (
                <li key={categoryName} className="category-item">
                    <div className="category-header">
                        <strong>{categoryName}</strong>
                        <button onClick={() => onDeleteCategory(categoryName)}>Delete</button>
                    </div>
                    <div className="add-habit">
                        <input
                            className="add-habit"
                            value={habitInputs[categoryName] || ""}
                            onChange={(event) => handleChange(event, categoryName)}
                            onKeyDown={(event) => handleKeydown(event, categoryName)}
                            placeholder="Add New Habit"
                        />
                    </div>
                    <ul>
                    {habits.map((habit) => (
                        habit.edit === true ? (
                            <input 
                                key={habit.id} 
                                placeholder={habit.name} 
                                onChange={(event) => handleChange(event, categoryName)}
                                onKeyDown={(event) => handleEditKeyDown(event, categoryName, habit.id)}
                            />
                        ) : (
                            <li key={habit.id} className="habit-item">
                                <span onClick={() => onEdit(habit.id, categoryName)} className="habit-name"> {habit.name} {habit.amount} </span>
                                <div className="habit-actions">
                                    {habit.completed ? (
                                        <button className="minus-btn" onClick={() => onComplete(habit.id, categoryName, -1)}>-</button>
                                    ) : (
                                        <button className="plus-btn" onClick={() => onComplete(habit.id, categoryName, 1)}>+</button>
                                    )}
                                    <button className="delete-btn" onClick={() => onDeleteHabit(habit.id, categoryName)}>Delete</button>
                                </div>
                            </li>
                        )
                    ))}
                    </ul>
                </li>
            ))}
            </ul>
        </div>
    );
}