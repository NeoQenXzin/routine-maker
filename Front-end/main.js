// main.js
import "./style.css";
import App from "./Classes/App";

const app = new App();
app.displayHabits();

// Créer une habit
const buttonCreate = document.getElementById("addHabit");
buttonCreate.addEventListener("click", () => {
  app.createHabit();
});

// Afficher Historique
const buttonHistory = document.getElementById("history");
buttonHistory.addEventListener("click", () => {
  app.displayHistoryHabits();
});
