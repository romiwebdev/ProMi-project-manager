import { useState, useEffect } from 'react';
import Layout from '../components/Layout.js';
import { FiPlus, FiSearch, FiTrash2, FiEdit, FiFileText, FiTag, FiClock, FiFolder } from 'react-icons/fi';
import { BiNotepad } from 'react-icons/bi';
import { HiSparkles } from 'react-icons/hi';
import NoteModal from '@/components/NoteModal';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/notes/getAll');
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotes = notes.filter(note => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      note.title.toLowerCase().includes(searchLower) ||
      note.content.toLowerCase().includes(searchLower) ||
      (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchLower)))
    );
  });

  const handleAddNote = () => {
    setCurrentNote(null);
    setIsModalOpen(true);
  };

  const handleEditNote = (note) => {
    setCurrentNote(note);
    setIsModalOpen(true);
  };

  const handleDeleteNote = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus catatan ini?')) return;
    
    try {
      const response = await fetch(`/api/notes/delete?id=${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchNotes();
      } else {
        console.error('Failed to delete note');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <Layout>
      {/* Modern gradient background */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50">
        <div className="p-6">
          {/* Header with modern styling */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <BiNotepad className="h-8 w-8 text-blue-600" />
                <HiSparkles className="absolute -top-1 -right-1 h-4 w-4 text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Catatan Proyek
                </h1>
                <p className="text-blue-500/70 text-sm mt-1">Kelola semua catatan proyek Anda</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              {/* Modern search input */}
              <div className="relative w-full md:w-80">
                <input
                  type="text"
                  placeholder="Cari catatan, tag, atau konten..."
                  className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute left-4 top-3.5 text-blue-400">
                  <FiSearch className="h-5 w-5" />
                </div>
              </div>
              
              {/* Modern add button */}
              <button
                onClick={handleAddNote}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group"
              >
                <FiPlus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-200" />
                <span className="font-medium">Tambah Catatan</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 absolute top-0 left-0"></div>
                <BiNotepad className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-blue-600" />
              </div>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-blue-100/50 p-12 text-center">
              <div className="relative inline-block mb-6">
                <FiFileText className="mx-auto h-16 w-16 text-blue-300" />
                <HiSparkles className="absolute -top-2 -right-2 h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Tidak ada catatan</h3>
              <p className="text-blue-600/70 text-lg mb-8">
                {searchTerm ? 'Tidak ada catatan yang cocok dengan pencarian' : 'Mulai dengan menambahkan catatan baru untuk proyek Anda'}
              </p>
              <button
                onClick={handleAddNote}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 group"
              >
                <FiPlus className="mr-3 h-5 w-5 group-hover:rotate-90 transition-transform duration-200" />
                <span className="font-medium">Buat Catatan Pertama</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <div key={note._id} className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100/50 overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
                  <div className="p-6">
                    {/* Note header with actions */}
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-200 line-clamp-2">
                        {note.title}
                      </h3>
                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => handleEditNote(note)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-all duration-200"
                          title="Edit"
                        >
                          <FiEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note._id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200"
                          title="Hapus"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Note content */}
                    <div className="prose prose-sm max-w-none text-gray-600 mb-4">
                      <p className="whitespace-pre-line line-clamp-4 leading-relaxed">
                        {note.content}
                      </p>
                    </div>
                    
                    {/* Tags */}
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {note.tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200/50">
                            <FiTag className="mr-1 h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Note footer */}
                  <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 px-6 py-4 border-t border-blue-100/50">
                    <div className="flex items-center justify-between text-xs text-blue-600/70">
                      <div className="flex items-center gap-2">
                        <FiClock className="h-3 w-3" />
                        <span>{format(new Date(note.updatedAt), 'dd MMM yyyy HH:mm', { locale: id })}</span>
                      </div>
                      {note.projectId && (
                        <div className="flex items-center gap-2">
                          <FiFolder className="h-3 w-3" />
                          <span className="font-medium">{note.projectId}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <NoteModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            note={currentNote}
            onSave={fetchNotes}
          />
        </div>
      </div>
    </Layout>
  );
}