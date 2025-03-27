import { useState } from "react";

export default function InputForm({ onAdd }) {
    const [category, setCategory] = useState("");

    function handleChange(event) {
        setCategory(event.target.value);
    }

    function handleKeydown(event) {
        if (event.key === "Enter") {
            event.preventDefault();

            if (!category.trim()) return; 
            console.log(category);
            onAdd(category.trim()); 
            setCategory(""); 
        }
    }

    return (
        <div>
            <h2>Add Category</h2>
            <input 
                value={category} 
                onChange={handleChange} 
                onKeyDown={handleKeydown} 
                placeholder="Add New Category" 
            />
        </div>
    );
}
