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
            onAdd(category.trim()); 
            setCategory(""); 
        }
    }

    return (
        <div className="main-input-container">
            <input 
                className="main-input-box"
                value={category} 
                onChange={handleChange} 
                onKeyDown={handleKeydown} 
                placeholder="Add New Category" 
            />
        </div>
    );
}
