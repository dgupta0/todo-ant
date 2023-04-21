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
  // Tags are unknown in advance so it needs to be extracted from todos
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
      // This is a use of Object destructuring with assigning
      // new names(aliases) for the original property names
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#object_destructuring
      sorter: ({timeStamp: timeStampA}, {timeStamp: timeStampB}) => (
        new Date(timeStampA) - new Date(timeStampB)
      ),
    },
    {
      title: "Task",
      dataIndex: "title",
      key: "title",
      sorter: ({title: titleA}, {title: titleB}) => {
        if (titleA === titleB) return 0;
        return titleA > titleB ? 1 : -1
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      sorter: ({description: descA}, {description: descB}) => {
        if (descA === descB) return 0;
        return descA > descB ? 1 : -1
      },
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      sorter: ({ dueDate: dueDateA}, {dueDate: dueDateB}, order) => {
        // both empty
        if (dueDateA === dueDateB === "") {
          return 0;
        // only first empty
        } else if (dueDateA === "") {
          return order === "ascend" ? 1 : -1;
        // only second empty
        } else if (dueDateB === "") {
          return order === "ascend" ? -1 : 1;
        // both have values
        } else {
          return new Date(dueDateA) - new Date(dueDateB);
        }
      }
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
