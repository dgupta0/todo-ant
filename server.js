import { createServer, Model, Response } from "miragejs";
import todos from "./todos";

export default function () {
  createServer({
    models: {
      todos: Model,
    },

    seeds(server) {
      todos.forEach((todo) => {
        server.schema.todos.create(todo);
      });
    },

    routes() {
      this.namespace = "api";

      this.get("/todos", (schema) => {
        return {
          todos: schema.todos.all().models,
        };
      });

      this.delete("/todos/:id", (schema, request) => {
        let id = request.params.id;
        try {
          schema.todos.find(id).destroy();
        } catch (error) {
          return new Response(400, {}, { error: `Todo with id #${id} could not be deleted.`});
        }
        return new Response(204);
      });
    },
  });
}
