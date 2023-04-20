import { useState, useEffect } from "react";
import { Table, Tag } from "antd";

function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetch("/api/todos")
      .then((res) => res.json())
      .then(data => { setTodos(data.todos); });
  }, []);

  // We know there are going to be only these 4 statuses
  // There is no need to get them dynamicaly from todos
  const statusFilters = ["Open", "Working", "Overdue", "Done"];
  /* 
  --------------------------------------------------
  The following code can be separated into 4 parts
  --------------------------------------------------
  1) Create new Set, uniqueTags, to store unique tags - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
  2) Traverse todos array and for each todo add all its tags to uniqueTags
  3) Covert the uniqueTags Set to Array
  4) Map each tag to the final {text, value} object
  --------------------------------------------------
  It could be also implemented like the code below.
  --------------------------------------------------
  let tagFilters = [];
  if (todos) {
    // 1)
    const uniqueTags = new Set();
    // 2)
    todos.forEach((todo) => {
      for (const tag of todo.tags) {
        uniqueTags.add(tag);
      }
    });
    // 3)
    const uniqueTagsArray = Array.from(uniqueTags) // [...uniqueTags] would also work
    // 4)
    tagFilters = uniqueTagsArray.map((tag) => { 
      return {
        text: tag[0].toUpperCase() + tag.slice(1),
        value: tag,
      }
    })
  }
  --------------------------------------------------
  */
  

  const tagsFilters = todos
    ? Array.from(
        todos.reduce((uniqueTags, { tags }) => {
          for (const tag of tags) {
            uniqueTags.add(tag);
          }
          return uniqueTags;
        }, new Set())
      ).map((tag) => ({
        text: tag[0].toUpperCase() + tag.slice(1),
        value: tag,
      }))
    : [];

  const columns = [
    {
      title: "Timestamp created",
      dataIndex: "timeStamp",
      key: "timeStamp",
    },
    {
      title: "Task",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      filters: tagsFilters,
      onFilter: (value, { tags }) => tags.includes(value),
      render: (tags, { id }) => {
        return (
          <>
            {tags.map((tag) => (
              <Tag key={tag + id}>{tag.toUpperCase()}</Tag>
            ))}
          </>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: statusFilters,
      onFilter: (value, { status }) => status === value,
    },
  ];

  return <Table columns={columns} dataSource={todos} />;
}

export default App;
