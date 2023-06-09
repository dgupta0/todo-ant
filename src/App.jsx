import { useState } from 'react'
import React from 'react'
import { Table, Tag, Input } from 'antd';


const { Search } = Input;

function App() {
  let dt = new Date().toISOString().slice(0, 10);
  const [data, setData] = useState(null);
  const [filterVal, setFilterVal] = useState("")
  const [todoClicked, setTodoClicked] = useState(false)
  const [id, setId] = useState(null)
  const [isEditClicked, setIsEditClicked] = useState(false)

  // const [filteredData, setFilteredData] = useState(null);

  React.useEffect(() => {
    fetch("/api/todos", { method: "GET" })
      .then(res => {
        return res.json()
      })
      .then(data => {
        setData(data.todos)
        setId(data.todos.length + 1)
      })
  }, [])

  const [todo, setTodo] = useState(null)

  function deleteTodo(id) {
    fetch(`/api/todos/${id}`, { method: "delete" })
      .then(res => res.json())
      .then(data => {
        setData(data => data.filter(todo => todo.id !== id))
      })
  }


  // below is the code for filtering data by user search.
  let visibleData = data;
  let props = ["title", "timeStamp", "description", "status", "dueDate", "tags"]
  if (filterVal) {
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
          if (data[i][key].toLowerCase().includes(filteredStr)) {
            filterdTodo.push(data[i])
            break;
          }
        }
      }
    }
    visibleData = filterdTodo
  }

  // creating an array of total tag names used by users. 
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


  // coverting the tags array into antd filter format
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
        render: (id) =>
          <div className='action-btn-container'>
            <button
              className='edit-btn'
              key={`edit-${id}`}
              id={`edit-${id}`}
              onClick={() => handleEdit(id)}
            >
              Edit
            </button>
            <button
              className='del-btn'
              key={`del-${id}`}
              onClick={() => deleteTodo(id)}
              id={`del-${id}`}
            >
              Delete
            </button>
          </div>

      }
    ]



  function handleFilterVal(e) {
    setFilterVal(e.target.value)
  }

  function handleForm(e) {
    const { name, value } = e.target
    if (setIsEditClicked) {
      setTodo(todo => {
        return {
          ...todo,
          [name]: [name] === "tags" ? todo.tags.join(",") : value

        }
      })
    }
    else {
      setTodo(todo => {
        return {
          ...todo,
          id: id,
          [name]: value
        }
      })
    }

  }
  function handleAddBtn() {
    setTodoClicked(true)
    setTodo({
      id: id,
      title: "",
      timeStamp: dt,
      description: "",
      dueDate: "",
      tags: "",
      status: ""
    })
  }
  function handleEdit(id) {
    setIsEditClicked(true)
    setTodoClicked(true)
    let editTodo = data.filter(todo => todo.id === id)
    setTodo(...editTodo)
  }

  function handleDone() {
    if (todo.title && todo.description && todo.status) {
      todo.tags = todo.tags.length ? todo.tags.split(",") : []
      setTodo(todo => {
        return {
          ...todo,
          tags: todo.tags
        }
      })
      if (isEditClicked) {
        setData(data => {
          let newArr = [...data]
          for (let i = 0; i < newArr.length; i++) {
            if (newArr[i].id === todo.id) {
              newArr[i] = { ...todo }
            }
          }
          return newArr
        })
      }

      else {
        fetch(`/api/todos`, { method: "POST", body: JSON.stringify(todo) })
          .then(res => res.json())
          .then(data => {
            setData(data => {
              return [
                ...data,
                todo
              ]
            })
          })
        setId(data.length + 1)
      }
      setTodoClicked(false)
      setIsEditClicked(false)
    }
  }

  function handleFormCloseBtn() {
    setTodoClicked(false)
    setIsEditClicked(false)
  }

  return (
    <>
      {todoClicked &&
        <div className='form-container'>
          <form>
            <h2>{isEditClicked ? "Edit" : "Add"} Todo Item </h2>
            <input
              type="text"
              name="title"
              id="title"
              placeholder='Title'
              onChange={handleForm}
              value={todo.title}
            />
            <input
              type="text"
              name="description"
              id="description"
              placeholder="Todo description"
              onChange={handleForm}
              value={todo.description} />
            <input
              type="date"
              name="dueDate"
              id="dueDate"
              value={todo.dueDate}
              onChange={handleForm}
              placeholder='due date' />
            <input
              type="text"
              name="tags"
              id="tags"
              value={todo.tags}
              onChange={handleForm}
              placeholder='Eg: marketing, finance' />
            <div className='status-container'>
              <h3>Status:</h3>
              <input
                type="radio"
                name="status"
                id="open"
                value="Open"
                onChange={handleForm}
                checked={todo.status === "Open"}
              />
              <label for="open">Open</label> <br />
              <input
                type="radio"
                name="status"
                id="close"
                value="Close"
                onChange={handleForm}
                checked={todo.status === "Close"}
              />
              <label for="close">Close</label> <br />
              <input
                type="radio"
                name="status"
                id="working"
                value="Working"
                checked={todo.status === "Working"}
                onChange={handleForm}
              />
              <label for="working">Working</label> <br />
              <input
                type="radio"
                name="status"
                id="overdue"
                value="Overdue"
                onChange={handleForm}
                checked={todo.status === "Overdue"}
              />
              <label for="overdue">Overdue</label> <br />
            </div>
            <div className='form-btns'>
              <button type='button' id="form-done" onClick={handleDone}>Done</button>
              <button type='button' id="form-close" onClick={handleFormCloseBtn}>Close</button>
            </div>


          </form>
        </div>
      }
      <header>
        <button className='add' id='add' onClick={handleAddBtn}>Add Todo + </button>
        <Search
          className='search'
          placeholder="input search text"
          allowClear
          size="large"
          onChange={handleFilterVal}
        />
      </header>
      <Table dataSource={visibleData} columns={columns} rowKey={"id"} />
    </>

  )
}

export default App
