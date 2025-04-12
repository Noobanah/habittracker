import { useState, useEffect, useMemo } from "react";
import InputForm from "./components/ImportForm";
import CategoryList from "./components/CategoryList";
import PastHabit from "./components/PastHabit";
import ModalCalendar from "./components/ModalCalendar";
import ModalAlert from "./components/ModalAlert";
import Header from "./components/Header";
import { getUserLocation, getLocationName } from "./Services/fetchWeather";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

function App() {
  const defaultHabits = {
    health: [
      {
        id: uuidv4(),
        name: "meditation",
        amount: 0,
        completed: false,
        edit: false,
      },
      {
        id: uuidv4(),
        name: "workout",
        amount: 0,
        completed: false,
        edit: false,
      },
    ],
    home: [
      {
        id: uuidv4(),
        name: "take out the trash",
        amount: 0,
        completed: false,
        edit: false,
      },
      {
        id: uuidv4(),
        name: "clean bedroom",
        amount: 0,
        completed: false,
        edit: false,
      },
    ],
  };

  const [habitList, setHabitList] = useState(() => {
    const storedHabits = JSON.parse(localStorage.getItem("habitList"));
    return storedHabits !== null ? storedHabits : defaultHabits;
  });

  const [pastHabit, setPastHabit] = useState(() => {
    return JSON.parse(localStorage.getItem("pastHabit")) || [];
  });

  const today = new Date().toLocaleDateString();
  const [isModalOpen, setIsModalOpen] = useState(null);
  const [date, setDate] = useState(today);
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
  }, []);

  useEffect(() => {
    setHabitList((prev) => {
      const updatedList = Object.keys(prev).reduce((acc, category) => {
        acc[category] = prev[category].map((habit) =>
          habit.date !== today
            ? {
                ...habit,
                completed: false,
              }
            : habit
        );
        return acc;
      }, {});
      return updatedList;
    });
  }, [today]);

  function reset() {
    localStorage.removeItem("habitList");
    localStorage.removeItem("pastHabit");
    setHabitList({
      health: [
        {
          id: uuidv4(),
          name: "meditation",
          amount: 0,
          completed: false,
          edit: false,
        },
        {
          id: uuidv4(),
          name: "workout",
          amount: 0,
          completed: false,
          edit: false,
        },
      ],
      home: [
        {
          id: uuidv4(),
          name: "take out the trash",
          amount: 0,
          completed: false,
          edit: false,
        },
        {
          id: uuidv4(),
          name: "clean bedroom",
          amount: 0,
          completed: false,
          edit: false,
        },
      ],
    });
    setPastHabit([]);
  }

  function addCategory(category) {
    if (category in habitList) {
      setIsModalOpen("alert");
    } else {
      setHabitList((prev) => ({
        ...prev,
        [category]: [],
      }));
    }
  }

  function addHabit(habitName, category) {
    setHabitList((prev) => ({
      ...prev,
      [category]: prev[category]
        ? [
            ...prev[category],
            {
              id: uuidv4(),
              name: habitName,
              amount: 0,
              completed: false,
              edit: false,
            },
          ]
        : [
            {
              id: uuidv4(),
              name: habitName,
              amount: 0,
              completed: false,
              edit: false,
            },
          ],
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
        ? prev[category].filter((habit) => habit.id !== habitId)
        : [],
    }));
  }

  function editHabit(newNameHabit, category, habitId) {
    setHabitList((prev) => {
      const updatedList = {
        ...prev,
        [category]: prev[category]
          ? prev[category].map((habit) =>
              habit.id === habitId
                ? {
                    ...habit,
                    name: newNameHabit,
                    edit: false,
                  }
                : habit
            )
          : [],
      };
      return updatedList;
    });
  }

  function completeHabit(habitId, category, amount) {
    setHabitList((prev) => {
      const updatedList = {
        ...prev,
        [category]: prev[category]
          ? prev[category].map((habit) =>
              habit.id === habitId
                ? {
                    ...habit,
                    amount: habit.amount + amount,
                    completed: !habit.completed,
                    date: today,
                  }
                : habit
            )
          : [],
      };

      const foundHabit = updatedList[category]?.find(
        (habit) => habit.id === habitId
      );
      if (!foundHabit) return prev;

      if (foundHabit.completed === true) {
        setPastHabit((prev) => {
          const isAlreadyAdded = prev.some(
            (habit) => habit.id === foundHabit.id && habit.category === category
          );
          return isAlreadyAdded
            ? prev
            : [...prev, { ...foundHabit, category, date: today }];
        });
      } else {
        setPastHabit((prev) =>
          prev.filter(
            (habit) =>
              !(habit.id === foundHabit.id && habit.category === category)
          )
        );
      }
      return updatedList;
    });
  }

  function enableEdit(habitId, category) {
    setHabitList((prev) => {
      const updatedList = {
        ...prev,
        [category]: prev[category]
          ? prev[category].map((habit) =>
              habit.id === habitId
                ? {
                    ...habit,
                    edit: true,
                  }
                : habit
            )
          : [],
      };

      const foundHabit = updatedList[category]?.find(
        (habit) => habit.id === habitId
      );
      if (!foundHabit) return prev;

      if (foundHabit.completed === true) {
        setPastHabit((prev) => {
          const isAlreadyAdded = prev.some(
            (habit) => habit.id === foundHabit.id && habit.category === category
          );
          return isAlreadyAdded
            ? prev
            : [...prev, { ...foundHabit, category, date: today }];
        });
      } else {
        setPastHabit((prev) =>
          prev.filter(
            (habit) =>
              !(habit.id === foundHabit.id && habit.category === category)
          )
        );
      }
      return updatedList;
    });
  }

  const filterByDate = pastHabit.filter((h) => h.date === date);

  const filteredHabits = useMemo(() => {
    return filterByDate.reduce((acc, habit) => {
      acc[habit.category] = acc[habit.category] || [];
      acc[habit.category].push(habit);
      return acc;
    }, {});
  }, [filterByDate]);

  return (
    <div className="main-container">
      {isModalOpen === "calendar" && (
        <ModalCalendar setDate={setDate} onClose={() => setIsModalOpen(null)} />
      )}
      {isModalOpen === "alert" && (
        <ModalAlert onClose={() => setIsModalOpen(null)} />
      )}
      <Header today={today} placeName={placeName} />
      <InputForm onAdd={addCategory} />
      <CategoryList
        habitList={habitList}
        onAddHabit={addHabit}
        onDeleteCategory={deleteCategory}
        onDeleteHabit={deleteHabit}
        onComplete={completeHabit}
        setIsModalOpen={setIsModalOpen}
        onEdit={enableEdit}
        onSubmitEdit={editHabit}
      />
      <PastHabit
        date={date}
        filteredHabits={filteredHabits}
        setIsModalOpen={setIsModalOpen}
      />
      <button onClick={reset}>Reset</button>
    </div>
  );
}

export default App;
