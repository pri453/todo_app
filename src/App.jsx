import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [task, setTask] = useState('')
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('tasks')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [filter, setFilter] = useState('all')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const handleAdd = () => {
    if (task.trim() === '') return
    setTasks([...tasks, { id: Date.now(), text: task.trim(), done: false }])
    setTask('')
  }

  const handleToggle = (id) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    )
  }

  const handleDelete = (id) => {
    setTasks(tasks.filter((t) => t.id !== id))
    if (editingId === id) setEditingId(null)
  }

  const handleEditStart = (t) => {
    setEditingId(t.id)
    setEditText(t.text)
  }

  const handleEditSave = (id) => {
    if (editText.trim() === '') return
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, text: editText.trim() } : t))
    )
    setEditingId(null)
  }

  const handleEditCancel = () => {
    setEditingId(null)
    setEditText('')
  }

  const visibleTasks = tasks.filter((t) => {
    if (filter === 'active') return !t.done
    if (filter === 'completed') return t.done
    return true
  })

  const remaining = tasks.filter((t) => !t.done).length

  return (
    <div className="app">
      <h1>To-Do App</h1>

      <div className="add-row">
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Add a new task"
        />
        <button onClick={handleAdd}>Add</button>
      </div>

      <div className="filters">
        {['all', 'active', 'completed'].map((f) => (
          <button
            key={f}
            className={filter === f ? 'active' : ''}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {tasks.length === 0 && <p className="empty">No tasks yet</p>}
      {tasks.length > 0 && visibleTasks.length === 0 && (
        <p className="empty">No {filter} tasks</p>
      )}

      <ul>
        {visibleTasks.map((t) => (
          <li key={t.id}>
            {editingId === t.id ? (
              <>
                <input
                  className="edit-input"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleEditSave(t.id)
                    if (e.key === 'Escape') handleEditCancel()
                  }}
                  autoFocus
                />
                <button className="save" onClick={() => handleEditSave(t.id)}>
                  Save
                </button>
                <button onClick={handleEditCancel}>Cancel</button>
              </>
            ) : (
              <>
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => handleToggle(t.id)}
                />
                <span className={t.done ? 'done' : ''}>{t.text}</span>
                <button onClick={() => handleEditStart(t)}>Edit</button>
                <button className="delete" onClick={() => handleDelete(t.id)}>
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      <p className="count">{remaining} task(s) left</p>
    </div>
  )
}

export default App