import { useState, useEffect } from 'react'
import { Plus, Search, Edit3, Trash2, Save, X } from 'lucide-react'
import axios from 'axios'
import './App.css'

const API_BASE_URL = 'http://localhost:5000/api'

function App() {
  const [notes, setNotes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
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
      setError('Failed to fetch notes. Make sure the backend server is running.')
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
      setEditingNote(null)
      setError('')
    } catch (err) {
      setError('Failed to update note')
      console.error('Error updating note:', err)
    }
  }

  const deleteNote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return

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
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            Note<span className="text-accent-400">Keeper</span>
          </h1>
          <p className="text-dark-300 text-lg">
            Organize your thoughts, capture your ideas
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200 animate-slide-up">
            {error}
          </div>
        )}

        {/* Search and Create Section */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 w-full"
            />
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="btn-primary flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            New Note
          </button>
        </div>

        {/* Create Note Form */}
        {isCreating && (
          <div className="mb-8 card animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Create New Note</h3>
              <button
                onClick={() => {
                  setIsCreating(false)
                  setNewNote({ title: '', content: '' })
                  setError('')
                }}
                className="text-dark-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Note title..."
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                className="input-field w-full text-lg font-medium"
              />
              <textarea
                placeholder="Write your note content here..."
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                rows={6}
                className="input-field w-full resize-none"
              />
              <div className="flex gap-3">
                <button onClick={createNote} className="btn-primary flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Note
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false)
                    setNewNote({ title: '', content: '' })
                    setError('')
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500"></div>
            <p className="text-dark-300 mt-4">Loading notes...</p>
          </div>
        ) : (
          <>
            {/* Notes Grid */}
            {filteredNotes.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-dark-300 mb-2">
                  {searchTerm ? 'No notes found' : 'No notes yet'}
                </h3>
                <p className="text-dark-400">
                  {searchTerm 
                    ? 'Try adjusting your search terms' 
                    : 'Create your first note to get started'
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNotes.map((note) => (
                  <div key={note._id} className="note-card animate-fade-in">
                    {editingNote === note._id ? (
                      <EditNoteForm
                        note={note}
                        onSave={(updatedNote) => updateNote(note._id, updatedNote)}
                        onCancel={() => setEditingNote(null)}
                      />
                    ) : (
                      <NoteCard
                        note={note}
                        onEdit={() => setEditingNote(note._id)}
                        onDelete={() => deleteNote(note._id)}
                        formatDate={formatDate}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function NoteCard({ note, onEdit, onDelete, formatDate }) {
  return (
    <>
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">
          {note.title}
        </h3>
        <p className="text-dark-300 text-sm mb-3">
          {formatDate(note.updatedAt)}
        </p>
      </div>
      
      <div className="mb-6 flex-1">
        <p className="text-dark-200 leading-relaxed line-clamp-4">
          {note.content}
        </p>
      </div>
      
      <div className="flex gap-2 pt-4 border-t border-dark-800">
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-dark-800 hover:bg-dark-700 text-dark-200 rounded-lg transition-all duration-200 hover:text-white"
        >
          <Edit3 className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-red-900/50 hover:bg-red-800/70 text-red-200 rounded-lg transition-all duration-200 hover:text-white"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </>
  )
}

function EditNoteForm({ note, onSave, onCancel }) {
  const [editedNote, setEditedNote] = useState({
    title: note.title,
    content: note.content
  })

  const handleSave = () => {
    if (!editedNote.title.trim() || !editedNote.content.trim()) return
    onSave(editedNote)
  }

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={editedNote.title}
        onChange={(e) => setEditedNote({ ...editedNote, title: e.target.value })}
        className="input-field w-full text-lg font-medium"
        placeholder="Note title..."
      />
      <textarea
        value={editedNote.content}
        onChange={(e) => setEditedNote({ ...editedNote, content: e.target.value })}
        rows={6}
        className="input-field w-full resize-none"
        placeholder="Note content..."
      />
      <div className="flex gap-2">
        <button onClick={handleSave} className="btn-primary flex items-center gap-2 flex-1">
          <Save className="w-4 h-4" />
          Save
        </button>
        <button onClick={onCancel} className="btn-secondary flex-1">
          Cancel
        </button>
      </div>
    </div>
  )
}

export default App