import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import "./design-system.css";

// Simple unique ID generator for TODOs
function newUid() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

// PUBLIC_INTERFACE
function App() {
  // State
  const [todos, setTodos] = useState(() => {
    // Load from localStorage
    try {
      const stored = localStorage.getItem("todos_v1");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [filter, setFilter] = useState("all"); // all | completed | active
  const [input, setInput] = useState("");
  const [subInput, setSubInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingInput, setEditingInput] = useState("");
  const [editingSubInput, setEditingSubInput] = useState("");

  // Persist todos to localStorage
  useEffect(() => {
    localStorage.setItem("todos_v1", JSON.stringify(todos));
  }, [todos]);

  // For focusing new todo input
  const inputRef = useRef(null);
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const filteredTodos = todos.filter((todo) => {
    if (filter === "all") return true;
    if (filter === "completed") return !!todo.completed;
    if (filter === "active") return !todo.completed;
    return true;
  });

  // PUBLIC_INTERFACE
  function handleAddTodo(e) {
    e.preventDefault();
    const title = input.trim();
    const sub = subInput.trim();
    if (!title) return;
    setTodos([
      ...todos,
      { id: newUid(), title, sub, completed: false, created: Date.now() },
    ]);
    setInput("");
    setSubInput("");
  }

  // PUBLIC_INTERFACE
  function handleToggleComplete(id) {
    setTodos((ts) =>
      ts.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  // PUBLIC_INTERFACE
  function handleDelete(id) {
    setTodos((ts) => ts.filter((t) => t.id !== id));
    if (editingId === id) setEditingId(null);
  }

  // PUBLIC_INTERFACE
  function handleEditStart(id) {
    const todo = todos.find((t) => t.id === id);
    setEditingId(id);
    setEditingInput(todo.title);
    setEditingSubInput(todo.sub || "");
  }

  // PUBLIC_INTERFACE
  function handleEditSave(id) {
    setTodos((ts) =>
      ts.map((t) =>
        t.id === id
          ? { ...t, title: editingInput.trim(), sub: editingSubInput.trim() }
          : t
      )
    );
    setEditingId(null);
  }

  // PUBLIC_INTERFACE
  function handleEditCancel() {
    setEditingId(null);
  }

  // PUBLIC_INTERFACE
  function handleFilter(type) {
    setFilter(type);
  }

  // SVG ICONS (inline, for minimalism)
  const IconPlus = (
    <svg width="21" height="23" viewBox="0 0 21 23" fill="none">
      <rect x="9" y="3" width="3" height="17" rx="1.5" fill="#ffffff"/>
      <rect x="3" y="10" width="15" height="3" rx="1.5" fill="#ffffff"/>
    </svg>
  );
  const IconEdit = (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M14.85 3.232a2.3 2.3 0 013.25 3.252l-9.414 9.418-4.014.762.764-4.015 9.414-9.417zM4.48 14.488l2.373-.451-1.922-1.92-.451 2.372zm11.74-10.36a.9.9 0 00-1.272 0l-1.125 1.123 2.43 2.428 1.123-1.122a.899.899 0 000-1.27l-1.156-1.16z" fill="#9395d3"/>
    </svg>
  );
  const IconDelete = (
    <svg width="16" height="18" viewBox="0 0 20 20" fill="none">
      <rect x="5" y="8" width="2" height="8" rx="1" fill="#9395d3"/>
      <rect x="9" y="8" width="2" height="8" rx="1" fill="#9395d3"/>
      <rect x="13" y="8" width="2" height="8" rx="1" fill="#9395d3"/>
      <rect x="4" y="4" width="12" height="2" rx="1" fill="#9395d3"/>
      <rect x="8" y="2" width="4" height="2" rx="1" fill="#9395d3"/>
    </svg>
  );
  const IconCheck = (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" stroke="#34c759" strokeWidth="2" fill="none"/>
      <path d="M7 10.5l2 2 4-4" stroke="#34c759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );

  // Top status/navigation bar (minimal, per Figma)
  function TopBar() {
    return (
      <div
        style={{
          height: 68,
          width: "100vw",
          background: "var(--color-ffffff)",
          boxShadow: "0 2px 4px 0 #0000000d",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 var(--space-20)",
          borderBottom: "1px solid var(--color-ebebf5)",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 99,
        }}
      >
        <span className="typo-9" style={{ color: "var(--color-9395d3)" }}>All</span>
        <span className="typo-7" style={{ color: "var(--color-8b8787)" }}>Completed</span>
      </div>
    );
  }

  // App "header"
  function AppHeader() {
    return (
      <div
        style={{
          background: "var(--color-d6d7ef)",
          height: 118,
          width: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "var(--space-20)",
          marginTop: 68,
          boxSizing: "border-box"
        }}
      >
        <span className="typo-8" style={{ letterSpacing: 2 }}>
          TODO APP
        </span>
        <span style={{
          width: 60, height: 60, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          {/* Could use a calendar SVG, for now, round colored placeholder */}
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "var(--color-9395d3)", opacity: 0.18
          }}/>
        </span>
      </div>
    );
  }

  // Add Todo Button (Figma: bottom-right circular "plus" button)
  function AddTodoButton({ onClick }) {
    return (
      <button
        type="button"
        aria-label="Add new todo"
        onClick={onClick}
        style={{
          position: "fixed",
          bottom: 38,
          right: 35,
          width: 70,
          height: 70,
          borderRadius: "50%",
          background: "var(--color-9395d3)",
          boxShadow: "0 4px 8px 0 #00000022",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999,
          cursor: "pointer",
        }}
      >
        {IconPlus}
      </button>
    );
  }

  // Input Modal for new todo (minimal)
  function NewTodoModal({ show, onClose, onSubmit, input, setInput, subInput, setSubInput }) {
    if (!show) return null;
    return (
      <div
        style={{
          position: "fixed",
          zIndex: 9999,
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.18)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}
        onClick={onClose}
      >
        <form
          autoComplete="off"
          tabIndex={-1}
          style={{
            minWidth: 320,
            background: "var(--color-ffffff)",
            borderRadius: "var(--radius-15)",
            boxShadow: "0 4px 12px #0001",
            padding: 24,
            display: "flex", flexDirection: "column",
            gap: 12,
            zIndex: 99
          }}
          onClick={e => e.stopPropagation()}
          onSubmit={onSubmit}
        >
          <label className="typo-9" style={{ textAlign: "left" }}>
            Title
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              style={{
                width: "100%",
                borderRadius: 8,
                border: "1px solid var(--color-9395d3)",
                padding: "10px 12px",
                marginTop: 5,
                outline: "none",
                fontSize: 16,
              }}
              placeholder="Enter todo title"
              required
            />
          </label>
          <label className="typo-10" style={{ color: "#888", textAlign: "left" }}>
            Subtitle
            <input
              type="text"
              value={subInput}
              onChange={e => setSubInput(e.target.value)}
              style={{
                width: "100%",
                borderRadius: 8,
                border: "1px solid #eee",
                padding: "10px 12px",
                marginTop: 5,
                outline: "none",
                fontSize: 14,
              }}
              placeholder="Additional notes (optional)"
            />
          </label>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 12 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "none", border: "none", color: "var(--color-9395d3)", fontWeight: 600, cursor: "pointer",
              }}>Cancel</button>
            <button
              type="submit"
              style={{
                background: "var(--color-9395d3)", color: "#fff",
                border: "none", borderRadius: 8,
                padding: "8px 18px", fontWeight: 600, cursor: "pointer"
              }}>
              Add
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Edit Todo Modal (minimal, same as new, values filled)
  function EditTodoModal({ show, onCancel, onSave,
    editingInput, setEditingInput, editingSubInput, setEditingSubInput }) {
    if (!show) return null;
    return (
      <div
        style={{
          position: "fixed",
          zIndex: 9999,
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.18)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}
        onClick={onCancel}
      >
        <form
          autoComplete="off"
          tabIndex={-1}
          style={{
            minWidth: 320,
            background: "var(--color-ffffff)",
            borderRadius: "var(--radius-15)",
            boxShadow: "0 4px 12px #0001",
            padding: 24,
            display: "flex", flexDirection: "column",
            gap: 12,
            zIndex: 2
          }}
          onClick={e => e.stopPropagation()}
          onSubmit={e => { e.preventDefault(); onSave(); }}
        >
          <label className="typo-9">
            Title
            <input
              type="text"
              value={editingInput}
              onChange={e => setEditingInput(e.target.value)}
              style={{
                width: "100%",
                borderRadius: 8,
                border: "1px solid var(--color-9395d3)",
                padding: "10px 12px",
                marginTop: 5,
                outline: "none",
                fontSize: 16,
              }}
              required
            />
          </label>
          <label className="typo-10" style={{ color: "#888", textAlign: "left" }}>
            Subtitle
            <input
              type="text"
              value={editingSubInput}
              onChange={e => setEditingSubInput(e.target.value)}
              style={{
                width: "100%",
                borderRadius: 8,
                border: "1px solid #eee",
                padding: "10px 12px",
                marginTop: 5,
                outline: "none",
                fontSize: 14,
              }}
            />
          </label>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 12 }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                background: "none", border: "none", color: "var(--color-9395d3)", fontWeight: 600, cursor: "pointer"
              }}>Cancel</button>
            <button
              type="submit"
              style={{
                background: "var(--color-9395d3)", color: "#fff",
                border: "none", borderRadius: 8,
                padding: "8px 18px", fontWeight: 600, cursor: "pointer"
              }}>
              Save
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Todo Item
  function TodoItem({ todo, onToggle, onEdit, onDelete }) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "var(--color-ebebf5)",
          borderRadius: "var(--radius-15)",
          margin: "0 0 18px 0",
          boxShadow: "0 2px 4px #00000006",
          padding: "18px 20px",
          minHeight: 82,
        }}
      >
        <button
          aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
          onClick={() => onToggle(todo.id)}
          style={{
            width: 28,
            height: 28,
            minWidth: 28,
            minHeight: 28,
            borderRadius: "50%",
            border: "2px solid var(--color-34c759)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#fff",
            marginRight: 16,
            cursor: "pointer",
            transition: "background 0.2s"
          }}
        >
          {todo.completed ? IconCheck : ""}
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="typo-9" style={{
            color: "var(--color-9395d3)",
            textDecoration: todo.completed ? "line-through" : "none",
            fontWeight: 600,
            overflowWrap: "anywhere",
            marginBottom: 4,
          }}>
            {todo.title}
          </div>
          {todo.sub ? (
            <div className="typo-10" style={{
              color: "var(--color-000000)",
              textDecoration: todo.completed ? "line-through" : "none",
              opacity: 0.6,
              fontSize: 12,
              overflowWrap: "anywhere"
            }}>{todo.sub}</div>
          ) : null}
        </div>
        <div style={{ display: "flex", gap: 3 }}>
          <button
            aria-label="Edit"
            onClick={() => onEdit(todo.id)}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              marginRight: 2,
              padding: 5
            }}
            tabIndex="0"
          >{IconEdit}</button>
          <button
            aria-label="Delete"
            onClick={() => onDelete(todo.id)}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              marginLeft: 2,
              padding: 5
            }}
            tabIndex="0"
          >{IconDelete}</button>
        </div>
      </div>
    );
  }

  // Todo list
  function TodoList({ todos, onToggle, onEdit, onDelete }) {
    if (todos.length === 0) {
      return (
        <div className="typo-7" style={{
          color: "var(--color-8b8787)",
          textAlign: "center",
          padding: "30px 0"
        }}>
          No todos yet. Add your first task!
        </div>
      );
    }
    return (
      <div>
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }

  // Filter controls ("All", "Completed", "Active")
  function FilterBar() {
    return (
      <div
        style={{
          display: "flex",
          gap: "14px",
          margin: "24px 0 16px 0",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <button className="typo-6"
          style={{
            background: "none",
            border: "none",
            color: filter === "all" ? "var(--color-9395d3)" : "var(--color-8b8787)",
            fontWeight: filter === "all" ? "bold" : "",
            borderBottom: filter === "all" ? "2px solid var(--color-9395d3)" : "none",
            fontSize: 13,
            cursor: "pointer"
          }}
          onClick={() => handleFilter("all")}
        >All</button>
        <button className="typo-6"
          style={{
            background: "none",
            border: "none",
            color: filter === "active" ? "var(--color-9395d3)" : "var(--color-8b8787)",
            fontWeight: filter === "active" ? "bold" : "",
            borderBottom: filter === "active" ? "2px solid var(--color-9395d3)" : "none",
            fontSize: 13,
            cursor: "pointer"
          }}
          onClick={() => handleFilter("active")}
        >Active</button>
        <button className="typo-6"
          style={{
            background: "none",
            border: "none",
            color: filter === "completed" ? "var(--color-9395d3)" : "var(--color-8b8787)",
            fontWeight: filter === "completed" ? "bold" : "",
            borderBottom: filter === "completed" ? "2px solid var(--color-9395d3)" : "none",
            fontSize: 13,
            cursor: "pointer"
          }}
          onClick={() => handleFilter("completed")}
        >Completed</button>
      </div>
    );
  }

  // Modal state
  const [showAdd, setShowAdd] = useState(false);

  // Keyboard shortcuts: "N" for add new
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "n" && !showAdd && !editingId) {
        setShowAdd(true);
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showAdd, editingId]);

  // Main layout matches minimal design, light theme, mobile first
  return (
    <div
      className="App"
      style={{
        minHeight: "100vh",
        background: "var(--color-ffffff)"
      }}
    >
      <link href="https://fonts.googleapis.com/css?family=Jost:400,600&display=swap" rel="stylesheet" />
      <TopBar />
      <AppHeader />
      <main
        style={{
          maxWidth: 414,
          margin: "0 auto",
          padding: "64px 10px 0 10px",
          marginTop: 0
        }}
      >
        <FilterBar />
        <TodoList
          todos={filteredTodos}
          onToggle={handleToggleComplete}
          onEdit={handleEditStart}
          onDelete={handleDelete}
        />
        <div style={{ height: 60 }}></div>
      </main>
      <AddTodoButton onClick={() => setShowAdd(true)} />
      <NewTodoModal
        show={showAdd}
        onClose={() => setShowAdd(false)}
        onSubmit={e => { handleAddTodo(e); setShowAdd(false); }}
        input={input}
        setInput={setInput}
        subInput={subInput}
        setSubInput={setSubInput}
      />
      <EditTodoModal
        show={!!editingId}
        onCancel={handleEditCancel}
        onSave={() => handleEditSave(editingId)}
        editingInput={editingInput}
        setEditingInput={setEditingInput}
        editingSubInput={editingSubInput}
        setEditingSubInput={setEditingSubInput}
      />
    </div>
  );
}

export default App;
