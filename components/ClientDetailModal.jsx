// components/ClientDetailModal.jsx
import { useEffect, useState } from "react";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaCalendarAlt, 
  FaEdit, 
  FaSave, 
  FaTimes,
  FaSpinner,
  FaUserCircle,
  FaUserTie
} from "react-icons/fa";

export default function ClientDetailModal({ clientId, isOpen, onClose }) {
  const [client, setClient] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen || !clientId) return;

    const fetchClient = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/clients/getOne?id=${clientId}`);
        const data = await res.json();
        setClient(data);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
        });
      } catch (err) {
        console.error("Gagal memuat client:", err);
        setClient(null);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [isOpen, clientId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/clients/update?id=${clientId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Data client berhasil diperbarui");
        setClient({ ...client, ...formData });
        setEditing(false);
        window.dispatchEvent(new Event("clientUpdated")); // Opsional: refresh dashboard
      } else {
        const error = await res.json();
        alert("Gagal menyimpan perubahan: " + (error.message || "Server error"));
      }
    } catch (err) {
      console.error("Error saat update client:", err);
      alert("Terjadi kesalahan saat mengirim data.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 relative overflow-hidden transform transition-all duration-300 scale-100">
        {/* Header dengan Gradient */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 p-6 pb-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
          >
            <FaTimes size={24} />
          </button>
          
          <div className="flex items-center gap-3 text-white">
            <div className="bg-white/20 p-3 rounded-full">
              <FaUserTie size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Detail Client</h2>
              <p className="text-blue-100 text-sm">Informasi lengkap client</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 -mt-4 bg-white rounded-t-3xl relative z-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FaSpinner className="animate-spin text-blue-500 text-3xl mb-4" />
              <p className="text-gray-500 font-medium">Memuat detail client...</p>
            </div>
          ) : client ? (
            <>
              {/* Avatar Section */}
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-full">
                  <FaUserCircle className="text-blue-600 text-4xl" />
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-5">
                {/* Nama */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaUser className="text-blue-500" />
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!editing}
                      className={`w-full border-2 rounded-xl px-4 py-3 pr-10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        editing 
                          ? "bg-white border-gray-300 hover:border-blue-400" 
                          : "bg-gray-50 border-gray-200 cursor-not-allowed"
                      }`}
                      placeholder="Masukkan nama lengkap"
                    />
                    {editing && (
                      <FaEdit className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaEnvelope className="text-blue-500" />
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!editing}
                      className={`w-full border-2 rounded-xl px-4 py-3 pr-10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        editing 
                          ? "bg-white border-gray-300 hover:border-blue-400" 
                          : "bg-gray-50 border-gray-200 cursor-not-allowed"
                      }`}
                      placeholder="contoh@email.com"
                    />
                    {editing && (
                      <FaEdit className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaPhone className="text-blue-500" />
                    Nomor Telepon
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!editing}
                      className={`w-full border-2 rounded-xl px-4 py-3 pr-10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        editing 
                          ? "bg-white border-gray-300 hover:border-blue-400" 
                          : "bg-gray-50 border-gray-200 cursor-not-allowed"
                      }`}
                      placeholder="+62 8xx-xxxx-xxxx"
                    />
                    {editing && (
                      <FaEdit className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Created Date */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaCalendarAlt className="text-blue-500" />
                    Tanggal Terdaftar
                  </label>
                  <input
                    type="text"
                    value={new Date(client.createdAt).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                    disabled
                    className="w-full border-2 border-gray-200 bg-gray-50 rounded-xl px-4 py-3 cursor-not-allowed text-gray-600"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-end">
                {!editing ? (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <FaEdit />
                    Edit Data
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={saving}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {saving ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <FaSave />
                        Simpan Perubahan
                      </>
                    )}
                  </button>
                )}
                
                <button
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-all duration-200 border-2 border-gray-200 hover:border-gray-300"
                >
                  <FaTimes />
                  Tutup
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="bg-red-100 p-4 rounded-full mb-4">
                <FaTimes className="text-red-500 text-3xl" />
              </div>
              <p className="text-red-600 font-semibold text-lg">Client tidak ditemukan</p>
              <p className="text-gray-500 text-sm mt-2">Data client mungkin telah dihapus atau tidak tersedia</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}