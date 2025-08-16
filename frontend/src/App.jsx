import { useState, useEffect } from 'react'
import { Plus, Search, Edit3, Trash2, Save, X } from 'lucide-react'
import axios from 'axios'
import './App.css'

const API_BASE_URL = 'http://localhost:5000/api'

function App() {
  const [notes, setNotes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [newNote, setNewNote] = useState({ title: '', content: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/notes`)
      setNotes(response.data)
      setError('')
    } catch (err) {
      setError('Failed to fetch notes. Make sure the server is running.')
      console.error('Error fetching notes:', err)
    } finally {
      setLoading(false)
    }
  }

  const createNote = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      setError('Please fill in both title and content')
      return
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/notes`, newNote)
      setNotes([response.data, ...notes])
      setNewNote({ title: '', content: '' })
      setIsCreating(false)
      setError('')
    } catch (err) {
      setError('Failed to create note')
      console.error('Error creating note:', err)
    }
  }

  const updateNote = async (id, updatedNote) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/notes/${id}`, updatedNote)
      setNotes(notes.map(note => note._id === id ? response.data : note))
      setEditingId(null)
      setError('')
    } catch (err) {
      setError('Failed to update note')
      console.error('Error updating note:', err)
    }
  }

  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/notes/${id}`)
      setNotes(notes.filter(note => note._id !== id))
      setError('')
    } catch (err) {
      setError('Failed to delete note')
      console.error('Error deleting note:', err)
    }
  }

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1 className="title">
            <span className="title-icon">📝</span>
            Notes
          </h1>
          <p className="subtitle">Organize your thoughts beautifully</p>
        </header>

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        <div className="controls">
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="create-btn"
            disabled={isCreating}
          >
            <Plus size={20} />
            New Note
          </button>
        </div>

        {isCreating && (
          <div className="note-card creating">
            <div className="note-header">
              <input
                type="text"
                placeholder="Note title..."
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                className="note-title-input"
                autoFocus
              />
              <div className="note-actions">
                <button onClick={createNote} className="save-btn">
                  <Save size={16} />
                </button>
                <button 
                  onClick={() => {
                    setIsCreating(false)
                    setNewNote({ title: '', content: '' })
                    setError('')
                  }} 
                  className="cancel-btn"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            <textarea
              placeholder="Write your note content here..."
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              className="note-content-input"
              rows={4}
            />
          </div>
        )}

        <div className="notes-grid">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading notes...</p>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>No notes found</h3>
              <p>
                {searchTerm 
                  ? 'Try adjusting your search terms' 
                  : 'Create your first note to get started'
                }
              </p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                isEditing={editingId === note._id}
                onEdit={() => setEditingId(note._id)}
                onSave={(updatedNote) => updateNote(note._id, updatedNote)}
                onCancel={() => setEditingId(null)}
                onDelete={() => deleteNote(note._id)}
                formatDate={formatDate}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function NoteCard({ note, isEditing, onEdit, onSave, onCancel, onDelete, formatDate }) {
  const [editData, setEditData] = useState({ title: note.title, content: note.content })

  const handleSave = () => {
    if (!editData.title.trim() || !editData.content.trim()) return
    onSave(editData)
  }

  const handleCancel = () => {
    setEditData({ title: note.title, content: note.content })
    onCancel()
  }

  if (isEditing) {
    return (
      <div className="note-card editing">
        <div className="note-header">
          <input
            type="text"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            className="note-title-input"
          />
          <div className="note-actions">
            <button onClick={handleSave} className="save-btn">
              <Save size={16} />
            </button>
            <button onClick={handleCancel} className="cancel-btn">
              <X size={16} />
            </button>
          </div>
        </div>
        <textarea
          value={editData.content}
          onChange={(e) => setEditData({ ...editData, content: e.target.value })}
          className="note-content-input"
          rows={4}
        />
      </div>
    )
  }

  return (
    <div className="note-card">
      <div className="note-header">
        <h3 className="note-title">{note.title}</h3>
        <div className="note-actions">
          <button onClick={onEdit} className="edit-btn">
            <Edit3 size={16} />
          </button>
          <button onClick={onDelete} className="delete-btn">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <p className="note-content">{note.content}</p>
      <div className="note-meta">
        <span className="note-date">
          {formatDate(note.updatedAt || note.createdAt)}
        </span>
      </div>
    </div>
  )
}

export default App