import { useState } from 'react'
import React from 'react'
import { Table } from 'antd';


function App() {
  const [data, setData] = useState(null);
  const [columns, setColumns] = useState(
    [
      {
        title: "Time Stamp",
        dataIndex: "timeStamp",
        key: "timeStamp"
      },
      {
        title: "Task",
        dataIndex: "title",
        key: "title"
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description"
      },
      {
        title: "Tags",
        dataIndex: "tags",
        key: "tags"
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status"
      }
    ]
  )

  React.useEffect(() => {
    fetch("/api/todos")
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setData(data.todos)
      })
  }, [columns])



  return (
    <>
      <Table dataSource={data} columns={columns} />
    </>
  )
}

export default App
