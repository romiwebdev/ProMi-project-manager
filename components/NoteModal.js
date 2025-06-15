import { useState, useEffect } from 'react';
import { FiX, FiTag, FiLink, FiEdit3, FiSave, FiFileText } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { BiNotepad } from 'react-icons/bi';

export default function NoteModal({ isOpen, onClose, note, onSave }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [projectId, setProjectId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags ? note.tags.join(', ') : '');
      setProjectId(note.projectId || '');
    } else {
      resetForm();
    }
  }, [note]);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setTags('');
    setProjectId('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const noteData = {
        title,
        content,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        projectId: projectId || null
      };

      const url = note 
        ? `/api/notes/update?id=${note._id}`
        : '/api/notes/add';
      
      const method = note ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });

      if (response.ok) {
        onSave();
        onClose();
      } else {
        console.error('Failed to save note');
      }
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Modern backdrop with blur effect */}
        <div className="fixed inset-0 transition-opacity duration-300" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-indigo-900/40 to-sky-900/40 backdrop-blur-sm" onClick={onClose}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        {/* Modern modal container */}
        <div className="inline-block align-bottom bg-white/95 backdrop-blur-xl rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all duration-300 sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-blue-100/50">
          {/* Modern header with gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <BiNotepad className="h-7 w-7 text-white" />
                  <HiSparkles className="absolute -top-1 -right-1 h-4 w-4 text-blue-200" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {note ? 'Edit Catatan' : 'Tambah Catatan Baru'}
                  </h3>
                  <p className="text-blue-100 text-sm">
                    {note ? 'Perbarui informasi catatan Anda' : 'Buat catatan baru untuk proyek'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-blue-100 hover:text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-200 group"
              >
                <FiX className="h-6 w-6 group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>
          </div>

          {/* Form content */}
          <div className="bg-white/80 backdrop-blur-sm px-6 py-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title field */}
              <div className="space-y-2">
                <label htmlFor="title" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FiEdit3 className="h-4 w-4 text-blue-600" />
                  Judul Catatan
                </label>
                <input
                  type="text"
                  id="title"
                  className="w-full border-2 border-blue-100 rounded-2xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-200 bg-white/80 backdrop-blur-sm hover:border-blue-200"
                  placeholder="Masukkan judul catatan..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Content field */}
              <div className="space-y-2">
                <label htmlFor="content" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FiFileText className="h-4 w-4 text-blue-600" />
                  Isi Catatan
                </label>
                <textarea
                  id="content"
                  rows={8}
                  className="w-full border-2 border-blue-100 rounded-2xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-200 bg-white/80 backdrop-blur-sm hover:border-blue-200 resize-none"
                  placeholder="Tulis isi catatan Anda di sini..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>

              {/* Tags field */}
              <div className="space-y-2">
                <label htmlFor="tags" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FiTag className="h-4 w-4 text-blue-600" />
                  Tag Catatan
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiTag className="h-5 w-5 text-blue-400" />
                  </div>
                  <input
                    type="text"
                    id="tags"
                    className="w-full border-2 border-blue-100 rounded-2xl shadow-sm py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-200 bg-white/80 backdrop-blur-sm hover:border-blue-200"
                    placeholder="desain, logo, revisi, urgent"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>
                <p className="text-xs text-blue-600/70 ml-1">Pisahkan tag dengan koma untuk kategorisasi yang lebih baik</p>
              </div>

              {/* Project ID field */}
              <div className="space-y-2">
                <label htmlFor="projectId" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FiLink className="h-4 w-4 text-blue-600" />
                  ID Proyek Terkait
                  <span className="text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded-full">Opsional</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiLink className="h-5 w-5 text-blue-400" />
                  </div>
                  <input
                    type="text"
                    id="projectId"
                    className="w-full border-2 border-blue-100 rounded-2xl shadow-sm py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-200 bg-white/80 backdrop-blur-sm hover:border-blue-200"
                    placeholder="Masukkan ID proyek untuk menghubungkan catatan"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Modern footer with gradient */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5 border-t border-blue-100/50">
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-2 py-3 px-6 border-2 border-blue-200 shadow-sm text-sm font-medium rounded-2xl text-blue-700 bg-white/80 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 backdrop-blur-sm"
                disabled={isSubmitting}
              >
                <FiX className="h-4 w-4" />
                Batal
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 py-3 px-6 border border-transparent shadow-lg text-sm font-medium rounded-2xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <FiSave className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                    {note ? 'Perbarui Catatan' : 'Simpan Catatan'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}