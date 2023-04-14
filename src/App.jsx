import { useState } from 'react'
import React from 'react'


function App() {
  const [data, setData] = useState(null);

  React.useEffect(() => {
    fetch("/api/todos")
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setData(data)
      })
  }, [])

  console.log(data)

  return (
    <h1>Ant Todo</h1>
  )
}

export default App
