import { useState, useEffect } from 'react';
import InputForm from './components/ImportForm';
import CategoryList from './components/CategoryList';
import PastHabit from './components/PastHabit';
import ModalCalendar from "./components/ModalCalendar"
import Header from './components/Header';
import {getUserLocation, getLocationName} from "./Services/fetchWeather"
import "./App.css"

function App() {

  const defaultHabits = {
    health: [
      { id: "meditation", name: "meditation", amount: 0, completed: false, edit: false },
      { id: "workout", name: "workout", amount: 0, completed: false, edit: false }
    ],
    home: [
      { id: "take out the trash", name: "take out the trash", amount: 0, completed: false, edit: false },
      { id: "clean bedroom", name: "clean bedroom", amount: 0, completed: false, edit: false }
    ]
  }

    const [habitList, setHabitList] = useState(() => {
      const storedHabits = JSON.parse(localStorage.getItem("habitList"));
      return storedHabits !== null ? storedHabits : defaultHabits; 
    });
  
    const [pastHabit, setPastHabit] = useState(() => {
      return JSON.parse(localStorage.getItem("pastHabit")) || [];
    });

  const today = new Date().toLocaleDateString();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState(today)
  const [placeName, setPlaceName] = useState("");


  useEffect(() => {
    localStorage.setItem("habitList", JSON.stringify(habitList));
    localStorage.setItem("pastHabit", JSON.stringify(pastHabit));
  }, [habitList, pastHabit]);

  useEffect(() => {
    getUserLocation()
    .then(({ lat, lon }) => {
          getLocationName(lat, lon).then((name) => setPlaceName(name));
    })
    .catch((error) => {
      console.error("Error getting location:", error);
    });
  },[])

  useEffect(() => {
    setHabitList((prev) => {
      const updatedList = Object.keys(prev).reduce((acc, category) => {
        acc[category] = prev[category].map((habit) => 
          habit.date !== today ? ({
          ...habit,
          completed: false,
        }): habit
      );
        return acc;
      }, {});
      return updatedList;
    });
  }, [today])

    function reset(){
      localStorage.removeItem("habitList");
      localStorage.removeItem("pastHabit");
      setHabitList({
        health:[
          {id: "meditation", 
            name: "meditation",
          amount: 0,
          completed: false, 
          edit: false
          },
          {id: "workout", 
            name: "workout", 
            amount: 0,
            completed: false, 
            edit: false
          }
          ],
        home: [
          {id: "take out the trash",
            name: "take out the trash",
            amount: 0,
            completed: false, 
            edit: false
          }, 
          {id: "clean bedroom",
            name: "clean bedroom",
            amount: 0,
            completed: false, 
            edit: false
          }
        ]
      })
      setPastHabit([])
    }


  function addCategory(category) {
    if (category in habitList) {
      alert("You already have this category");
    } else {
      setHabitList((prev) => ({
        ...prev,
        [category]: []
      }));
    }
  }

  function addHabit(habitName, category) {
    setHabitList((prev) => ({
      ...prev,
      [category]: prev[category]
        ? [...prev[category], { id: habitName, name: habitName, amount: 0, completed: false }]
        : [{ id: habitName, name: habitName, amount: 0, completed: false }]
    }));
  }

  function deleteCategory(category) {
    setHabitList((prev) => {
      const newHabitList = { ...prev };
      delete newHabitList[category];
      return newHabitList;
    });
  }

  function deleteHabit(habitId, category) {
    setHabitList((prev) => ({
      ...prev,
      [category]: prev[category]
        ? prev[category].filter(habit => habit.id !== habitId)
        : []
    }));
  }

  function completeHabit(habitId, category, amount) {
    setHabitList(prev => {
      const updatedList = {
        ...prev,
        [category]: prev[category]
          ? prev[category].map(habit =>
              habit.id === habitId
                ? {
                    ...habit,
                    amount: habit.amount + amount,
                    completed: !habit.completed,
                    date: today
                  }
                : habit
            )
          : []
      };

      const foundHabit = updatedList[category]?.find(habit => habit.id === habitId);
      if (!foundHabit) return prev;

      if (foundHabit.completed === true) {
        setPastHabit(prev => {
          const isAlreadyAdded = prev.some(habit => habit.id === foundHabit.id && habit.category === category);
          return isAlreadyAdded ? prev : [...prev, { ...foundHabit, category, date: today }];
        });
      } else {
        setPastHabit(prev => prev.filter(habit => !(habit.id === foundHabit.id && habit.category === category)));
      }
      return updatedList;
    });
  }

  function enableEdit(habitId, category, edit) {
    setHabitList(prev => {
      const updatedList = {
        ...prev,
        [category]: prev[category]
          ? prev[category].map(habit =>
              habit.id === habitId
                ? {
                    ...habit,
                    edit: true
                  }
                : habit
            )
          : []
      };

      const foundHabit = updatedList[category]?.find(habit => habit.id === habitId);
      if (!foundHabit) return prev;

      if (foundHabit.completed === true) {
        setPastHabit(prev => {
          const isAlreadyAdded = prev.some(habit => habit.id === foundHabit.id && habit.category === category);
          return isAlreadyAdded ? prev : [...prev, { ...foundHabit, category, date: today }];
        });
      } else {
        setPastHabit(prev => prev.filter(habit => !(habit.id === foundHabit.id && habit.category === category)));
      }
      return updatedList;
    });
  }

  const filteredHabits = pastHabit.filter(
    (h) => h.date === date
  );

 
  return (
    <div classname="main-container">
      {isModalOpen && <ModalCalendar setDate={setDate} onClose={() => setIsModalOpen(false)} />}
      <Header today={today} placeName={placeName}/>
      <InputForm onAdd={addCategory} />
      <CategoryList
        habitList={habitList}
        onAddHabit={addHabit}
        onDeleteCategory={deleteCategory}
        onDeleteHabit={deleteHabit}
        onComplete={completeHabit}
        setIsModalOpen={setIsModalOpen}
        onEdit={enableEdit}
      />
      <PastHabit filteredHabits={filteredHabits} setIsModalOpen={setIsModalOpen} />
      <button onClick={reset}>
          Reset
        </button>
    </div>
    
  );
}

export default App;