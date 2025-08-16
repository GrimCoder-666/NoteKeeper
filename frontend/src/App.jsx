import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Edit3, Trash2, Save, X, FileText, Clock } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form states
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [editNote, setEditNote] = useState({ title: '', content: '' });

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/notes`);
      setNotes(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch notes. Make sure your backend server is running.');
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const createNote = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      setError('Please fill in both title and content');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/notes`, newNote);
      setNotes([response.data, ...notes]);
      setNewNote({ title: '', content: '' });
      setIsCreating(false);
      setError('');
    } catch (err) {
      setError('Failed to create note');
      console.error('Error creating note:', err);
    }
  };

  const updateNote = async (id) => {
    if (!editNote.title.trim() || !editNote.content.trim()) {
      setError('Please fill in both title and content');
      return;
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/notes/${id}`, editNote);
      setNotes(notes.map(note => note._id === id ? response.data : note));
      setEditingId(null);
      setEditNote({ title: '', content: '' });
      setError('');
    } catch (err) {
      setError('Failed to update note');
      console.error('Error updating note:', err);
    }
  };

  const deleteNote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/notes/${id}`);
      setNotes(notes.filter(note => note._id !== id));
      setError('');
    } catch (err) {
      setError('Failed to delete note');
      console.error('Error deleting note:', err);
    }
  };

  const startEdit = (note) => {
    setEditingId(note._id);
    setEditNote({ title: note.title, content: note.content });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditNote({ title: '', content: '' });
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
      {/* Header */}
      <header className="glass-effect border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Notes App
              </h1>
            </div>
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-4 h-4" />
              <span>New Note</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 glass-effect rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-100 placeholder-slate-400 transition-all duration-200"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center animate-fade-in">
            {error}
          </div>
        )}

        {/* Create Note Modal */}
        {isCreating && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="glass-effect rounded-xl p-6 w-full max-w-md animate-slide-up">
              <h2 className="text-xl font-semibold mb-4 text-slate-100">Create New Note</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Note title..."
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  className="w-full p-3 glass-effect rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-100 placeholder-slate-400"
                />
                <textarea
                  placeholder="Write your note content..."
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  rows={4}
                  className="w-full p-3 glass-effect rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-100 placeholder-slate-400 resize-none"
                />
                <div className="flex space-x-3">
                  <button
                    onClick={createNote}
                    className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setNewNote({ title: '', content: '' });
                      setError('');
                    }}
                    className="flex-1 flex items-center justify-center space-x-2 bg-slate-600 hover:bg-slate-700 text-white py-2 px-4 rounded-lg transition-all duration-200"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notes Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-pulse-soft">
              <FileText className="w-12 h-12 text-slate-400" />
            </div>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-300 mb-2">
              {searchTerm ? 'No notes found' : 'No notes yet'}
            </h3>
            <p className="text-slate-400 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Create your first note to get started'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setIsCreating(true)}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Note</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <div
                key={note._id}
                className="glass-effect rounded-xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group animate-fade-in"
              >
                {editingId === note._id ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editNote.title}
                      onChange={(e) => setEditNote({ ...editNote, title: e.target.value })}
                      className="w-full p-2 glass-effect rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-100 font-semibold"
                    />
                    <textarea
                      value={editNote.content}
                      onChange={(e) => setEditNote({ ...editNote, content: e.target.value })}
                      rows={4}
                      className="w-full p-2 glass-effect rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-300 resize-none"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateNote(note._id)}
                        className="flex-1 flex items-center justify-center space-x-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg transition-all duration-200 text-sm"
                      >
                        <Save className="w-3 h-3" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex-1 flex items-center justify-center space-x-1 bg-slate-600 hover:bg-slate-700 text-white py-2 px-3 rounded-lg transition-all duration-200 text-sm"
                      >
                        <X className="w-3 h-3" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-slate-100 group-hover:text-white transition-colors duration-200 line-clamp-2">
                        {note.title}
                      </h3>
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => startEdit(note)}
                          className="p-1.5 hover:bg-blue-500/20 rounded-lg transition-colors duration-200"
                        >
                          <Edit3 className="w-4 h-4 text-blue-400" />
                        </button>
                        <button
                          onClick={() => deleteNote(note._id)}
                          className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-slate-300 mb-4 line-clamp-4 leading-relaxed">
                      {note.content}
                    </p>
                    
                    <div className="flex items-center text-xs text-slate-400 border-t border-white/10 pt-3">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>
                        {note.updatedAt ? `Updated ${formatDate(note.updatedAt)}` : `Created ${formatDate(note.createdAt)}`}
                      </span>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-400">
            Built with React + Tailwind CSS • {notes.length} {notes.length === 1 ? 'note' : 'notes'} total
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;