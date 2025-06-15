import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import ActiveProjectsTable from "../components/dashboard/ActiveProjectsTable";
import ClientDetailModal from "../components/ClientDetailModal";
import PaginationControls from "../components/PaginationControls";
import AddProjectModal from "../components/AddProjectModal";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiEye,
  FiEyeOff,
  FiGrid,
  FiList,
  FiTrendingUp,
  FiUsers,
  FiClock,
  FiCheckCircle
} from "react-icons/fi";

export default function Dashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState({});
  const [statusFilter, setStatusFilter] = useState("");
  const [paidFilter, setPaidFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("active"); // 'active' or 'completed'
  const [editingId, setEditingId] = useState(null);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  // Helper function to check payment status
  const isPaid = (paidStatus) => {
    return paidStatus === true || paidStatus === "lunas";
  };

  // Load data
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (loggedIn !== "true") router.push("/");

    fetch("/api/projects/getAll")
      .then((res) => res.json())
      .then(setProjects);

    fetch("/api/clients/getAll")
      .then((res) => res.json())
      .then((clientList) => {
        const clientMap = {};
        clientList.forEach((client) => {
          clientMap[client._id] = client.name;
        });
        setClients(clientMap);
      });
  }, []);

  // Filter & Sorting
  // Di dalam komponen Dashboard, update filteredProjects:
const filteredProjects = projects
.filter((p) => {
  const matchStatus = statusFilter ? p.status === statusFilter : true;
  const matchPaid = paidFilter ? 
    (paidFilter === "true" ? isPaid(p.paid) : !isPaid(p.paid)) : true;
  const matchSearch =
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    false;
  const matchViewMode = viewMode === "active" 
    ? !(p.status === "done" && isPaid(p.paid))
    : p.status === "done" && isPaid(p.paid);
  
  return matchStatus && matchPaid && matchSearch && matchViewMode;
})
.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));


  // Pagination Logic
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Pagination Navigation
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Update Project Field
  const updateProjectField = async (id, field, value) => {
    const project = projects.find((p) => p._id === id);

    if ((field === "paid" && (value === true || value === "lunas")) || 
        (field === "status" && value === "done")) {
      const totalBill = project.totalBill || 0;
      const paidAmount = project.paidAmount || 0;
      const remaining = totalBill - paidAmount;

      if (remaining > 0) {
        alert("Tidak bisa lunas. Masih ada sisa pembayaran.");
        return;
      }
    }

    const response = await fetch(`/api/projects/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, [field]: value }),
    });

    if (!response.ok) {
      alert("Gagal menyimpan perubahan");
      return;
    }

    // Force refresh when changing status or payment
    if (field === "status" || field === "paid") {
      router.reload();
    } else {
      const updated = projects.map((p) =>
        p._id === id ? { ...p, [field]: value } : p
      );
      setProjects(updated);
    }
  };

  const openClientDetail = (id) => {
    setSelectedClientId(id);
    setIsClientModalOpen(true);
  };

  return (
    <Layout>
      <div className="w-full space-y-8 p-4 md:p-8">

        {/* Search & Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-4">
          <div className="flex flex-wrap items-center gap-4">

            {/* Search Bar */}
            <div className="relative flex-1 min-w-64">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari proyek..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white min-w-32"
            >
              <option value="">Semua Status</option>
              <option value="ongoing">Ongoing</option>
              <option value="done">Selesai</option>
              <option value="canceled">Batal</option>
            </select>

            {/* Payment Filter */}
            <select
              value={paidFilter}
              onChange={(e) => setPaidFilter(e.target.value)}
              className="px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white min-w-32"
            >
              <option value="">Semua Pembayaran</option>
              <option value="true">Lunas</option>
              <option value="false">Belum Lunas</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex rounded-lg border border-slate-200 overflow-hidden">
              <button
                onClick={() => setViewMode("active")}
                className={`px-4 py-2.5 text-sm font-medium transition-colors ${viewMode === "active"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-700 hover:bg-slate-50"
                  }`}
              >
                Proyek Aktif
              </button>
              <button
                onClick={() => setViewMode("completed")}
                className={`px-4 py-2.5 text-sm font-medium transition-colors border-l border-slate-200 ${viewMode === "completed"
                    ? "bg-green-600 text-white"
                    : "bg-white text-slate-700 hover:bg-slate-50"
                  }`}
              >
                Selesai & Lunas
              </button>
            </div>

          </div>
        </div>

        {/* Projects Section */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            {/* Left Side - Title */}
            <h3 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
              {viewMode === "active" ? (
                <FiClock className="w-6 h-6 text-blue-600" />
              ) : (
                <FiCheckCircle className="w-6 h-6 text-green-600" />
              )}
              <span>
                {viewMode === "active" 
                  ? `Proyek Aktif (${filteredProjects.length})` 
                  : `Proyek Selesai & Lunas (${filteredProjects.length})`}
              </span>
            </h3>

            {/* Right Side - Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <FiPlus className="w-5 h-5" />
              <span>Tambah Proyek</span>
            </button>
          </div>
          <div className="p-6">
            <ActiveProjectsTable
              projects={paginatedProjects}
              clients={clients}
              editingId={editingId}
              setEditingId={setEditingId}
              updateProjectField={updateProjectField}
              openClientDetail={openClientDetail}
              isCompletedView={viewMode === "completed"}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6">
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  goToNextPage={goToNextPage}
                  goToPrevPage={goToPrevPage}
                  label="Halaman"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddProjectModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {isClientModalOpen && (
        <ClientDetailModal
          clientId={selectedClientId}
          isOpen={isClientModalOpen}
          onClose={() => setIsClientModalOpen(false)}
        />
      )}
    </Layout>
  );
}