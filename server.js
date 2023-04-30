import { createServer, Model } from "miragejs";
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

        return schema.todos.find(id).destroy();
      });
    },
  });
}
