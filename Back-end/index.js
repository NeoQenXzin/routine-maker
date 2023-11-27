import cors from "@fastify/cors";
import Fastify from "fastify";
import { habitsRoute } from "./routes/habits.js";

const fastify = Fastify({
  logger: true,
});

fastify.addHook("onRequest", (request, reply, done) => {
  reply.header("Cache-Control", "no-store"); // Indique au navigateur de ne pas mettre en cache la réponse
  done();
});

await fastify.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
});

fastify.register(habitsRoute, { prefix: "/habits" });

// Run the server!
try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
