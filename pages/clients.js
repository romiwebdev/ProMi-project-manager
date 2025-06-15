import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { 
  FiUsers, 
  FiPlus, 
  FiEdit3, 
  FiTrash2, 
  FiMail, 
  FiPhone, 
  FiUser,
  FiSave,
  FiChevronLeft,
  FiChevronRight,
  FiSearch
} from "react-icons/fi";

export default function ClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn !== "true") router.push("/");

    fetch("/api/clients/getAll")
      .then((res) => res.json())
      .then(setClients);
  }, []);

  const deleteClient = async (id) => {
    if (!confirm("Yakin hapus client ini?")) return;
    const res = await fetch(`/api/clients/delete?id=${id}`, { method: "DELETE" });
    if (res.ok)
      setClients(clients.filter((c) => c._id !== id));
    else
      alert("Gagal menghapus client.");
  };

  const updateClientField = async (id, field, value) => {
    const updated = clients.map(c => (c._id === id ? { ...c, [field]: value } : c));
    setClients(updated);

    const response = await fetch(`/api/clients/update?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, [field]: value }),
    });

    if (!response.ok) {
      alert("Gagal menyimpan perubahan");
    }
  };

  const handleInputChange = (e, id, field) => {
    const value = e.target.value;
    updateClientField(id, field, value);
  };

  // Pagination Logic
  const totalPages = Math.ceil(clients.length / itemsPerPage);
  const paginatedClients = clients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const goToPrevPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg">
                  <FiUsers className="text-2xl text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Manajemen Client
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Kelola data client dengan mudah dan efisien
                  </p>
                </div>
              </div>
              
            </div>
          </div>

          {/* Main Content */}
          {paginatedClients.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 sm:p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-6 bg-blue-50 rounded-full">
                  <FiUsers className="text-4xl text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Belum ada client
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Mulai tambahkan client pertama Anda untuk memulai mengelola data
                  </p>
                  <button
                    onClick={() => router.push("/clients/add")}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 font-medium"
                  >
                    <FiPlus className="text-lg" />
                    Tambah Client Pertama
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                        <th className="py-4 px-6 text-left font-semibold">
                          <div className="flex items-center gap-2">
                            <FiUser className="text-lg" />
                            Nama
                          </div>
                        </th>
                        <th className="py-4 px-6 text-left font-semibold">
                          <div className="flex items-center gap-2">
                            <FiMail className="text-lg" />
                            Email
                          </div>
                        </th>
                        <th className="py-4 px-6 text-left font-semibold">
                          <div className="flex items-center gap-2">
                            <FiPhone className="text-lg" />
                            Telepon
                          </div>
                        </th>
                        <th className="py-4 px-6 text-right font-semibold">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {paginatedClients.map((client, index) => {
                        const isEditing = editingId === client._id;

                        return (
                          <tr
                            key={client._id}
                            className={`hover:bg-blue-50 transition-all duration-200 ${
                              index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                            }`}
                          >
                            <td className="px-6 py-4">
                              {isEditing ? (
                                <input
                                  type="text"
                                  defaultValue={client.name}
                                  onBlur={(e) =>
                                    updateClientField(client._id, "name", e.target.value)
                                  }
                                  className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                  autoFocus
                                />
                              ) : (
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                    {client.name.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="font-medium text-gray-900">{client.name}</span>
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              {isEditing ? (
                                <input
                                  type="email"
                                  defaultValue={client.email || ""}
                                  onBlur={(e) =>
                                    updateClientField(client._id, "email", e.target.value)
                                  }
                                  className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                              ) : (
                                <span className="text-gray-700">{client.email || "-"}</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              {isEditing ? (
                                <input
                                  type="text"
                                  defaultValue={client.phone || ""}
                                  onBlur={(e) =>
                                    updateClientField(client._id, "phone", e.target.value)
                                  }
                                  className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                              ) : (
                                <span className="text-gray-700">{client.phone || "-"}</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {isEditing ? (
                                  <button
                                    onClick={() => setEditingId(null)}
                                    className="inline-flex items-center gap-1 text-green-600 hover:text-green-700 hover:bg-green-50 px-3 py-2 rounded-lg transition-all duration-200"
                                  >
                                    <FiSave className="text-lg" />
                                    Simpan
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => setEditingId(client._id)}
                                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all duration-200"
                                  >
                                    <FiEdit3 className="text-lg" />
                                    Edit
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteClient(client._id)}
                                  className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-all duration-200"
                                >
                                  <FiTrash2 className="text-lg" />
                                  Hapus
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {paginatedClients.map((client) => {
                  const isEditing = editingId === client._id;

                  return (
                    <div
                      key={client._id}
                      className="bg-white rounded-2xl shadow-lg border border-blue-100 p-4 sm:p-6 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {client.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            {isEditing ? (
                              <input
                                type="text"
                                defaultValue={client.name}
                                onBlur={(e) =>
                                  updateClientField(client._id, "name", e.target.value)
                                }
                                className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                autoFocus
                              />
                            ) : (
                              <h3 className="font-semibold text-gray-900 text-lg">{client.name}</h3>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {isEditing ? (
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all duration-200"
                            >
                              <FiSave className="text-xl" />
                            </button>
                          ) : (
                            <button
                              onClick={() => setEditingId(client._id)}
                              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            >
                              <FiEdit3 className="text-xl" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteClient(client._id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                          >
                            <FiTrash2 className="text-xl" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FiMail className="text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Email</p>
                            {isEditing ? (
                              <input
                                type="email"
                                defaultValue={client.email || ""}
                                onBlur={(e) =>
                                  updateClientField(client._id, "email", e.target.value)
                                }
                                className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all mt-1"
                              />
                            ) : (
                              <p className="text-gray-900 font-medium">{client.email || "-"}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <FiPhone className="text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Telepon</p>
                            {isEditing ? (
                              <input
                                type="text"
                                defaultValue={client.phone || ""}
                                onBlur={(e) =>
                                  updateClientField(client._id, "phone", e.target.value)
                                }
                                className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all mt-1"
                              />
                            ) : (
                              <p className="text-gray-900 font-medium">{client.phone || "-"}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl shadow-lg border border-blue-100 p-4 sm:p-6">
                <div className="text-gray-600 text-sm">
                  Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, clients.length)} dari {clients.length} client
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    <FiChevronLeft className="text-lg" />
                    <span className="hidden sm:inline">Sebelumnya</span>
                  </button>
                  
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-semibold">
                    <span>Halaman {currentPage} dari {totalPages}</span>
                  </div>
                  
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    <span className="hidden sm:inline">Selanjutnya</span>
                    <FiChevronRight className="text-lg" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}