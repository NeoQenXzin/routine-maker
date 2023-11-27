// habits.helper.js
import fs from "fs/promises";

const DATABASE_PATH = "./database.json";

async function getHabits() {
  const data = await fs.readFile(DATABASE_PATH, "utf-8");
  return JSON.parse(data).habits;
}

async function getTodayHabits() {
  const today = new Date().toISOString().slice(0, 10);
  const habits = await getHabits();

  return habits.map((habit) => {
    return {
      id: habit.id,
      title: habit.title,
      done: habit.daysDone[today] || false,
    };
  });
  // return habits.filter((habit) => habit.daysDone && habit.daysDone[today]);
}

async function addHabit(title) {
  try {
    const habits = await getHabits();
    const newHabit = {
      id: habits.length + 1,
      title,
      daysDone: {},
    };
    const updatedHabits = [...habits, newHabit];
    await fs.writeFile(
      DATABASE_PATH,
      JSON.stringify({ habits: updatedHabits }, null, 2)
    );
    console.log("Habit added successfully:", newHabit);

    return newHabit;
  } catch (error) {
    console.error("Error adding habit:", error);
    throw error;
  }
}

async function updateHabit(id, done) {
  const habits = await getHabits();
  const habitIndex = habits.findIndex((habit) => habit.id === id);

  if (habitIndex === -1) {
    throw new Error("Habit not found");
  }

  const today = new Date().toISOString().slice(0, 10);
  habits[habitIndex].daysDone[today] = done;

  await fs.writeFile(DATABASE_PATH, JSON.stringify({ habits }, null, 2));

  return habits[habitIndex];
}

async function deleteHabit(id) {
  const habits = await getHabits();
  const habitIndex = habits.findIndex((habit) => habit.id === id);

  if (habitIndex === -1) {
    throw new Error("Habit not found");
  }
  habits.splice(habitIndex, 1); // Supprimer l'élément du tableau

  await fs.writeFile(DATABASE_PATH, JSON.stringify({ habits }, null, 2));

  return console.log("habit supprimé");
}

export { getHabits, getTodayHabits, addHabit, updateHabit, deleteHabit };
