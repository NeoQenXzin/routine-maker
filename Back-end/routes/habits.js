// routes/habits.js
import {
  getHabits,
  getTodayHabits,
  addHabit,
  updateHabit,
  deleteHabit,
} from "../habits.helper.js";

export async function habitsRoute(fastify) {
  fastify.get("/", async () => {
    const habits = await getHabits();
    return habits;
  });

  fastify.get("/today", async () => {
    const todayHabits = await getTodayHabits();
    return todayHabits;
  });

  fastify.post("/", async (request, reply) => {
    const { title } = request.body;

    if (typeof request.body.title !== "string") {
      reply.code(400).send({
        error: "Title must be a string",
      });
      throw new Error("Title must be a string");
    }

    if (request.body.title === undefined) {
      reply.code(400).send({
        error: "Title is required in the body",
      });
      throw new Error("Vous devez définir title");
    }

    try {
      return addHabit(title);
    } catch (error) {
      reply.code(400).send({
        error: "Title is required in the body",
      });
    }
  });

  fastify.patch("/:id", async (request, reply) => {
    const { id } = request.params;
    const { done } = request.body;

    if (typeof request.body.done !== "boolean") {
      reply.code(400).send({
        error: "Done must be a boolean",
      });
      throw new Error("Done must be a boolean");
    }

    if (request.body.done === undefined) {
      reply.code(400).send({
        error: "Done is required in the body",
      });
    }

    return updateHabit(parseInt(id), done);
  });

  fastify.delete("/:id", async (request, reply) => {
    const { id } = request.params;

    try {
      await deleteHabit(parseInt(id));
      reply.send({ success: true, id: parseInt(id) });
    } catch (error) {
      reply.code(404).send({
        error: "Habit not found",
      });
    }
  });
}
