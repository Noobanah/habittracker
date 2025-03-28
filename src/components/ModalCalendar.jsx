import Calendar from 'react-calendar';
import "react-calendar/dist/Calendar.css";

export default function ModalCalendar({setDate, onClose}) {

    const handleDateChange = (selectedDate) => {
        const formattedDate = new Date(selectedDate).toLocaleDateString();
        setDate(formattedDate); 
        onClose()
    }

    return(
        <div className='modal-overlay'>
            <div className='modal-content'>
                <Calendar onChange={handleDateChange}/>
                <button onClick={onClose}>X</button>
            </div>
        </div>
        
    )
}

