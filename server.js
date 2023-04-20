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
                        tags: [],
                        status: "Working"
                    },
                    {
                        id: 2,
                        timeStamp: "2023-04-08",
                        title: "Write",
                        description: "write a blog",
                        tags: ["marketing", "finance"],
                        status: "Open"
                    },
                    {
                        id: 3,
                        timeStamp: "2023-04-10",
                        title: "Exercise",
                        description: "go for a run",
                        tags: [],
                        status: "Open"
                      },
                      {
                        id: 4,
                        timeStamp: "2023-04-12",
                        title: "Grocery Shopping",
                        description: "buy groceries for the week",
                        tags: [],
                        status: "Open"
                      },
                      {
                        id: 5,
                        timeStamp: "2023-04-14",
                        title: "Appointment",
                        description: "go to the dentist",
                        tags: [],
                        status: "Open"
                      },
                      {
                        id: 6,
                        timeStamp: "2023-04-15",
                        title: "Call",
                        description: "call mom",
                        tags: [],
                        status: "Overdue"
                      },
                      {
                        id: 7,
                        timeStamp: "2023-04-17",
                        title: "Research",
                        description: "research vacation destinations",
                        tags: [],
                        status: "Open"
                      },
                      {
                        id: 8,
                        timeStamp: "2023-04-20",
                        title: "Meeting",
                        description: "meet with the team",
                        tags: ["work"],
                        status: "Open"
                      },
                      {
                        id: 9,
                        timeStamp: "2023-04-22",
                        title: "Cooking",
                        description: "make dinner",
                        tags: ["food"],
                        status: "Done"
                      },
                      {
                        id: 10,
                        timeStamp: "2023-04-25",
                        title: "Gardening",
                        description: "plant some flowers",
                        tags: ["home"],
                        status: "Open"
                      },
                      {
                        id: 11,
                        timeStamp: "2023-04-28",
                        title: "Shopping",
                        description: "buy a new dress",
                        tags: ["fashion"],
                        status: "Overdue"
                      },
                      {
                        id: 12,
                        timeStamp: "2023-04-30",
                        title: "Read",
                        description: "start a new book",
                        tags: ["books"],
                        status: "Overdue"
                      }
                ],
                
            }
        })
    },
})