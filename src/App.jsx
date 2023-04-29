import { useState } from 'react'
import React from 'react'
import { Table, Tag, Input } from 'antd';


const { Search } = Input;

function App() {
  const [data, setData] = useState(null);
  const [filterVal, setFilterVal] = useState("")
  const [filteredData, setFilteredData] = useState(null);


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
  function deleteTodo(id) {
    setData(data => data.filter(todo => todo.id !== id))
  }
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
        onFilter: (value, todo) => {
          return todo.status === value
        }
      },
      {
        dataIndex: "id",
        title: "Action",
        render: (id) => [
          <div className='action-btn-container'>
            <button
              className='edit-btn'
              key={id}
              id={`edit-${id}`}
            >
              Edit
            </button>
            <button
              className='del-btn'
              key={id}
              onClick={() => deleteTodo(id)}
              id={`del-${id}`}
            >
              Delete
            </button>
          </div>
        ]
      }
    ]



  function handleFilterVal(e) {
    setFilterVal(e.target.value)
  }
  function handleSearch() {
    let props = ["title", "timeStamp", "description", "status", "dueDate", "tags"]
    if (!filterVal) {
      setFilteredData(data)
    } else {
      let filterdTodo = []
      let filteredStr = filterVal.toLowerCase();

      for (let i = 0; i < data.length; i++) {
        for (const key of props) {
          if (key === "tags") {
            for (const el of data[i][key]) {
              if (el.toLowerCase().includes(filteredStr)) {
                filterdTodo.push(data[i])
                break;
              }
            }
          } else {
            console.log(data[i][key])
            if (data[i][key].toLowerCase().includes(filteredStr)) {
              filterdTodo.push(data[i])
              break;
            }
          }
        }
      }
      setFilteredData(filterdTodo)
    }
  }

  return (
    <>
      <Search
        className='search'
        placeholder="input search text"
        allowClear
        enterButton="Search"
        size="large"
        onChange={handleFilterVal}
        onPressEnter={handleSearch}
        onSearch={handleSearch}
      />
      <Table dataSource={filteredData || data} columns={columns} rowKey={"id"} />
    </>

  )
}

export default App
