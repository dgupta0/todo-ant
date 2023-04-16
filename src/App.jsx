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

  const columns =
    [
      {
        title: "Time Stamp",
        dataIndex: "timeStamp",
        key: "timeStamp"
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
        key: "dueDate"
      },
      {
        title: "Tags",
        dataIndex: "tags",
        key: "tags",
        render: (data) =>
          data.map(tag => <Tag key={tag}>{tag.toUpperCase()}</Tag>)
      },

      {
        title: "Status",
        dataIndex: "status",
        key: "status"
      }
    ]
  console.log(columns)



  return (
    <>
      <Table dataSource={data} columns={columns} rowKey={"id"} />
    </>
  )
}

export default App
