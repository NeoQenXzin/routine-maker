export default class App {
  constructor() {
    this.habits = [];
    this.historyHabits = [];
    this.BASE_URL = "http://localhost:3000";
  }

  async getHabits() {
    try {
      const response = await fetch(`${this.BASE_URL}/habits`);
      const data = await response.json();
      this.habits = data;
      return data;
    } catch (error) {
      console.error("Error fetching habits:", error);
      throw error;
    }
  }

  async displayHabits() {
    const divHabit = document.getElementById("habits");
    try {
      const habits = await this.getHabits();

      habits.map((habit) => {
        const li = document.createElement("li");
        li.classList.add("item");
        li.classList.add(`item${habit.id}`);
        li.innerText = habit.title + " ";

        divHabit.appendChild(li);
        li.addEventListener("click", () => {
          li.classList.toggle("doneTask");
          li.classList.contains("doneTask")
            ? this.makeHabitDone(habit.id)
            : this.makeHabitNotDone(habit.id);
        });

        console.log(habit);
      });
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  }

  async displayHabit() {
    const divHabit = document.getElementById("habits");
    try {
      const habits = await this.getHabits();
      // Récupération de l'ID de la dernière habitude ajoutée
      const lastHabitId = habits[habits.length - 1].id;
      // Vérification si la dernière habitude n'est déjà pas affichée
      if (!divHabit.querySelector(`#habit-${lastHabitId}`)) {
        const li = document.createElement("li");
        li.classList.add("item");
        li.id = `habit-${lastHabitId}`;
        li.innerText = habits[habits.length - 1].title + " ";

        divHabit.appendChild(li);
        li.addEventListener("click", () => {
          li.classList.toggle("doneTask");
          li.classList.contains("doneTask")
            ? this.makeHabitDone(lastHabitId)
            : this.makeHabitNotDone(lastHabitId);
        });
      }
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  }

  async createHabit() {
    console.log(" fonction createHabit");
    const submitButton = document.getElementById("submitNewHabit");
    const myDialog = document.querySelector(".dialog2");
    myDialog.setAttribute("open", "true");
    const submitNewHabit = async () => {
      console.log("submit bouton");
      const input = document.getElementById("myNewHabit");
      const titleHabit = String(input.value);
      if (titleHabit === "" || typeof titleHabit !== "string") {
        return;
      }
      if (typeof titleHabit === "string" && titleHabit !== undefined) {
        try {
          const response = await fetch(`${this.BASE_URL}/habits`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ title: titleHabit }),
          });
          if (!response.ok) {
            throw new Error("Bad request");
          }
          // Mise à jour de la liste d'habitudes
          myDialog.removeAttribute("open");
          await this.displayHabit();
          submitButton.removeEventListener("click", submitNewHabit);
        } catch (error) {
          console.error("Error fetching habits:", error);
          throw error;
        }
      } else {
        throw new Error("Vous devez entrer une string");
      }
    };
    submitButton.addEventListener("click", submitNewHabit);
  }

  async deleteHabit(id) {
    const confirmation = window.confirm(
      `Voulez-vous vraiment supprimer cette habitude ${id} ?`
    );

    if (confirmation) {
      try {
        const response = await fetch(`${this.BASE_URL}/habits/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Bad request");
        }

        // Mettez à jour l'affichage des habitudes après la suppression
        const divHabit = document.getElementById("habits");
        divHabit.innerHTML = " ";
        const myDialog = document.querySelector(".dialog");
        myDialog.removeAttribute("open");
        setTimeout(async () => {
          await this.displayHabits();
        }, 1000);
      } catch (error) {
        console.error("Error deleting habit:", error);
        throw error;
      }
    }
  }

  async makeHabitDone(id) {
    try {
      const response = await fetch(`${this.BASE_URL}/habits/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ done: true }),
      });
      if (!response.ok) {
        throw new Error("Bad request");
      }
    } catch (error) {
      console.error("Error fetching habits:", error);
      throw error;
    }
  }

  async makeHabitNotDone(id) {
    try {
      const response = await fetch(`${this.BASE_URL}/habits/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ done: false }),
      });
      if (!response.ok) {
        throw new Error("Bad request");
      }
    } catch (error) {
      console.error("Error fetching habits:", error);
      throw error;
    }
  }

  async displayHistoryHabits() {
    try {
      const myDialog = document.querySelector(".dialog");
      myDialog.setAttribute("open", "true");
      const habits = await this.getHabits();
      const lowestDate = this.getLowestDate(habits);
      const dates = this.getDatesRange(lowestDate);
      const table = document.createElement("table");
      table.appendChild(this.createTableHeader(dates));
      this.createTableRow(habits, dates).forEach((row) => {
        table.appendChild(row);
      });
      const tableWrapper = document.getElementById("table-wrapper");
      tableWrapper.innerHTML = "";
      tableWrapper.appendChild(table);
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  }

  createTableRow(habits, dates) {
    return habits.map((habit) => {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.textContent = `🐱‍👓${habit.title}✌`;

      // Ajoutez le bouton de suppression à côté de l'habitude
      const deleteCell = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.innerText = " 💥Kill";
      deleteButton.addEventListener("click", async () => {
        await this.deleteHabit(habit.id);
      });
      deleteCell.appendChild(deleteButton);
      row.appendChild(deleteCell);

      row.appendChild(cell);
      dates.forEach((date) => {
        const dateCell = document.createElement("td");
        const doneDay = habit.daysDone[date];
        dateCell.textContent = doneDay ? "✅" : "❌";
        row.appendChild(dateCell);
      });
      return row;
    });
  }
  createTableHeader(dates) {
    const headerRow = document.createElement("tr");
    const headerCeil = document.createElement("th");
    const deleteAction = document.createElement("th");
    headerCeil.textContent = "Habit";
    deleteAction.textContent = "Delete Habit";
    headerRow.appendChild(deleteAction);
    headerRow.appendChild(headerCeil);

    dates.forEach((date) => {
      const dateCell = document.createElement("th");
      dateCell.textContent = date;
      headerRow.appendChild(dateCell);
    });

    return headerRow;
  }

  getLowestDate(habits) {
    return habits
      .reduce((acc, habit) => {
        if (habit.daysDone) {
          return [...acc, ...Object.keys(habit.daysDone)];
        } else {
          return acc; // Ignore habits without daysDone property
        }
      }, [])
      .map((date) => new Date(date))
      .sort((a, b) => a - b)[0];
  }
  getDatesRange(lowestDate) {
    const diff = Math.ceil((new Date() - lowestDate) / (1000 * 60 * 60 * 24));
    return Array.from({ length: diff }).map((_, index) => {
      const date = new Date(lowestDate);
      date.setDate(date.getDate() + index);
      return date.toISOString().split("T")[0];
    });
  }
}
