import React, { useState } from "react";

function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, task: "Learn React" },
    { id: 2, task: "Practice Coding" }
  ]);

  const [input, setInput] = useState("");

  // Add todo
  const addTodo = () => {
    if (input.trim() === "") return;

    const newTodo = {
      id: Date.now(),
      task: input
    };

    setTodos([newTodo, ...todos]); // add at start
    setInput("");
  };

  // Delete todo
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div style={{ width: "300px", margin: "auto" }}>
      <h2>Todo List</h2>

      {/* Input */}
      <input
        type="text"
        placeholder="Enter task..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ padding: "8px", width: "70%" }}
      />

      <button onClick={addTodo} style={{ padding: "8px" }}>
        Add
      </button>

      {/* List */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10px",
              background: "#f2f2f2",
              padding: "8px"
            }}
          >
            {todo.task}
            <button onClick={() => deleteTodo(todo.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;