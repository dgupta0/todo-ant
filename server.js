import { createServer } from "miragejs"

createServer({
    routes() {
        this.namespace = "api"

        this.get("/todos", () => {
            return {
                todos: [
                    {
                        id: 1,
                        timeStamp: "2023-04-05",
                        title: "Read",
                        description: "read a book",
                        status: "Open"
                    },
                    {
                        id: 2,
                        timeStamp: "2023-04-08",
                        title: "Write",
                        description: "write a blog",
                        tags: ["marketing", "finance"],
                        status: "Open"
                    }
                ],
            }
        })
    },
})