import { useState } from 'react'
import React from 'react'
import { Table, Tag } from 'antd';


function App() {
  const [data, setData] = useState(null);

  React.useEffect(() => {
    fetch("/api/todos")
      .then(res => res.json())
      .then(data => {
        setData(data.todos)
      })
  }, [])

  let onlyTags = []
  if (data) {
    data.forEach(todo => {
      todo.tags.forEach(tag => {
        if (!onlyTags.includes(tag)) {
          onlyTags.push(tag)
        }
      })
    })
  }


  const tagsFilter = onlyTags.map(tag => {
    return {
      text: tag,
      value: tag
    }
  })

  const columns =
    [
      {
        title: "Time Stamp",
        dataIndex: "timeStamp",
        key: "timeStamp",
        sorter: (a, b) => {
          return new Date(a.timeStamp) - new Date(b.timeStamp)
        },
      },
      {
        title: "Task",
        dataIndex: "title",
        key: "title",
        sorter: (a, b) => {
          console.log(a, b)
          return a.title.localeCompare(b.title)

        }
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description"
      },
      {
        title: "Due Date",
        dataIndex: "dueDate",
        key: "dueDate",
        sorter: function (a, b, order) {
          if (a.dueDate === "") {
            return order === "ascend" ? 1 : -1
          }
          if (b.dueDate === "") {
            return order === "ascend" ? -1 : 1
          }
          return new Date(a.dueDate) - new Date(b.dueDate);
        }
      },

      {
        title: "Tags",
        dataIndex: "tags",
        key: "tags",
        filters: tagsFilter,
        onFilter: (value, todo) => {
          for (let i = 0; i < todo.tags.length; i++) {
            if (value === todo.tags[i]) {
              return todo
            }
          }
        },
        render: (data) =>
          data.map(tag => <Tag key={tag}>{tag.toUpperCase()}</Tag>),

      },

      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        filters: [
          {
            text: "Open",
            value: "Open"
          },
          {
            text: "Working",
            value: "Working"
          },
          {
            text: "Done",
            value: "Done"
          },
          {
            text: "Overdue",
            value: "Overdue"
          }
        ],
        onFilter: (value, todo) => todo.status === value
      },
      {
        title: "Action",
        render: (data) =>
          data.map(todo =>
            <div className='action-btn-container'>
              <button id={`edit-${todo.id}`}
                key={todo.id}>
                Edit
              </button>
              <button id={`delete-${todo.id}`}
                key={todo.id}>
                Delete
              </button>
            </div>

          )
      }
    ]

  return (
    <Table dataSource={data} columns={columns} rowKey={"id"} />
  )
}

export default App
