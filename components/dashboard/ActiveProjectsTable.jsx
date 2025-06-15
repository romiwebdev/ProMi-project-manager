import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ClientDetailModal from "../ClientDetailModal";
import {
  FiUser,
  FiCalendar,
  FiCreditCard,
  FiDollarSign,
  FiEdit2,
  FiTrash2,
  FiSave,
  FiEye,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiFileText,
  FiTrendingUp,
  FiRefreshCw,
} from "react-icons/fi";
import { MdPayments } from "react-icons/md";

export default function ActiveProjectsTable({
  projects,
  clients,
  editingId,
  setEditingId,
  updateProjectField,
  openClientDetail,
  isCompletedView = false,
}) {
  const router = useRouter();
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [tempChanges, setTempChanges] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Helper function to check payment status
  const isPaid = (paidStatus) => {
    return paidStatus === true || paidStatus === "lunas";
  };

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      router.replace(router.asPath);
    } catch (error) {
      console.error("Refresh error:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle field changes
  const handleChange = (id, field, value) => {
    setTempChanges((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        [field]: value,
      },
    }));
  };

  // Save changes to API
  // Di dalam handleSave function:
  const handleSave = async (id) => {
    const changes = tempChanges[id];
    if (!changes) return;

    try {
      const project = projects.find(p => p._id === id);
      const current = tempChanges[id] || project;

      // Check if remaining payment exists when marking as paid
      if (changes.paid === true || changes.paid === "lunas") {
        const totalBill = current.totalBill || 0;
        const paidAmount = current.paidAmount || 0;
        const remaining = totalBill - paidAmount;

        if (remaining > 0) {
          alert("Tidak bisa lunas. Masih ada sisa pembayaran.");
          return;
        }
      }

      const projectData = {
        id,
        title: changes.title || project.title,
        status: changes.status || project.status,
        deadline: changes.deadline || project.deadline,
        paid: changes.paid !== undefined
          ? (changes.paid ? "lunas" : "belum lunas")
          : project.paid,
        paymentMethod: changes.paymentMethod || project.paymentMethod,
        totalBill: changes.totalBill !== undefined
          ? Number(changes.totalBill)
          : project.totalBill,
        paidAmount: changes.paidAmount !== undefined
          ? Number(changes.paidAmount)
          : project.paidAmount,
      };

      const response = await fetch("/api/projects/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        throw new Error("Gagal memperbarui proyek");
      }

      // Clear temp changes
      setTempChanges((prev) => {
        const newChanges = { ...prev };
        delete newChanges[id];
        return newChanges;
      });
      setEditingId(null);

      // Force refresh if status or payment changed
      router.reload();
    } catch (error) {
      console.error("Error saving project:", error);
      alert(error.message);
    }
  };

  // Handle input changes
  const handleInputChange = (e, id, field) => {
    const value = e.target.value;
    const finalValue =
      field === "totalBill" || field === "paidAmount"
        ? Number(value)
        : value;
    handleChange(id, field, finalValue);
  };

  // Status icon helper
  const getStatusIcon = (status) => {
    switch (status) {
      case 'done': return <FiCheckCircle className="w-4 h-4" />;
      case 'ongoing': return <FiClock className="w-4 h-4" />;
      case 'canceled': return <FiXCircle className="w-4 h-4" />;
      default: return <FiAlertCircle className="w-4 h-4" />;
    }
  };

  // Status color helper
  const getStatusColor = (status) => {
    switch (status) {
      case 'done': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'ongoing': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'canceled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Currency formatter
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "-"
      : date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
  };

  return (
    <>
      {/* Mobile View */}
      {isMobile && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
              {isCompletedView ? (
                <FiCheckCircle className="w-6 h-6 text-white" />
              ) : (
                <FiTrendingUp className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {isCompletedView ? "Proyek Selesai" : "Proyek Aktif"}
              </h3>
              <p className="text-sm text-gray-600">
                {isCompletedView ? "Proyek yang sudah selesai dan lunas" : "Deadline Terdekat"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {projects.map((project) => {
              const isEditing = editingId === project._id;
              const current = tempChanges[project._id] || project;
              const remaining = (current.totalBill || 0) - (current.paidAmount || 0);
              const paidStatus = isPaid(current.paid);

              return (
                <div key={project._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200">
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {isEditing ? (
                          <input
                            type="text"
                            defaultValue={current.title}
                            onChange={(e) => handleChange(project._id, "title", e.target.value)}
                            className="w-full text-lg font-semibold bg-white border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <FiFileText className="w-5 h-5 text-blue-600" />
                            {current.title}
                          </h4>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {getStatusIcon(current.status)}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(current.status)}`}>
                          {current.status.charAt(0).toUpperCase() + current.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Client Info */}
                    <div className="flex items-center gap-3">
                      <FiUser className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Client</p>
                        <button
                          onClick={() => openClientDetail(project.clientId)}
                          className="text-blue-600 font-medium hover:text-blue-800 transition-colors"
                        >
                          {clients[project.clientId] || "Tidak ditemukan"}
                        </button>
                      </div>
                    </div>

                    {/* Deadline */}
                    <div className="flex items-center gap-3">
                      <FiCalendar className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Deadline</p>
                        {isEditing ? (
                          <input
                            type="date"
                            defaultValue={current.deadline ? new Date(current.deadline).toISOString().split("T")[0] : ""}
                            onChange={(e) => handleChange(project._id, "deadline", e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="font-medium text-gray-800">
                            {formatDate(current.deadline)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                      {/* Payment Status */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MdPayments className="w-5 h-5 text-blue-600" />
                          <span className="text-sm text-gray-600">Status Bayar</span>
                        </div>
                        {isEditing ? (
                          <select
                            defaultValue={String(paidStatus)}
                            onChange={(e) => handleChange(project._id, "paid", e.target.value === "true")}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="true">Lunas</option>
                            <option value="false">Belum Lunas</option>
                          </select>
                        ) : (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${paidStatus
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                            }`}>
                            {paidStatus ? "Lunas" : "Belum Lunas"}
                          </span>
                        )}
                      </div>

                      {/* Financial Info */}
                      <div className="grid grid-cols-3 gap-4 pt-2 border-t border-gray-200">
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Tagihan</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {formatCurrency(current.totalBill)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Dibayar</p>
                          <p className="text-sm font-semibold text-emerald-600">
                            {formatCurrency(current.paidAmount)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Sisa</p>
                          <p className={`text-sm font-semibold ${remaining > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                            {formatCurrency(remaining)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status Update - Always show in edit mode */}
                    {isEditing && (
                      <div className="flex items-center gap-3">
                        <FiAlertCircle className="w-5 h-5 text-blue-600" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">Status Proyek</p>
                          <select
                            defaultValue={current.status}
                            onChange={(e) => handleChange(project._id, "status", e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="ongoing">Ongoing</option>
                            <option value="done">Selesai</option>
                            <option value="canceled">Batal</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      {isEditing ? (
                        <button
                          onClick={() => handleSave(project._id)}
                          className="inline-flex items-center gap-1 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-xs font-medium"
                        >
                          <FiSave className="w-4 h-4" />
                          <span>Simpan</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setEditingId(project._id)}
                          className="inline-flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
                        >
                          <FiEdit2 className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (confirm("Yakin ingin hapus proyek ini?")) {
                            fetch(`/api/projects/delete?id=${project._id}`, {
                              method: "DELETE",
                            }).then(() => {
                              router.reload();
                            });
                          }
                        }}
                        className="inline-flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs font-medium"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </td>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Desktop View */}
      {!isMobile && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                {isCompletedView ? (
                  <FiCheckCircle className="w-7 h-7 text-white" />
                ) : (
                  <FiTrendingUp className="w-7 h-7 text-white" />
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {isCompletedView ? "Proyek Selesai & Lunas" : "Proyek Aktif"}
                </h3>
                <p className="text-gray-600">
                  {isCompletedView ? "Proyek yang sudah selesai dan lunas" : "Deadline Terdekat"}
                </p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              className={`flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors ${isRefreshing ? 'animate-spin' : ''}`}
              disabled={isRefreshing}
              aria-label="Refresh data"
            >
              <FiRefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-auto">
              <table className="w-full min-w-max">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <FiFileText className="w-4 h-4" />
                        <span>Judul</span>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <FiUser className="w-4 h-4" />
                        <span>Client</span>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <FiAlertCircle className="w-4 h-4" />
                        <span>Status</span>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="w-4 h-4" />
                        <span>Deadline</span>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <FiCreditCard className="w-4 h-4" />
                        <span>Metode</span>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <MdPayments className="w-4 h-4" />
                        <span>Pembayaran</span>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <FiDollarSign className="w-4 h-4" />
                        <span>Tagihan</span>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <FiDollarSign className="w-4 h-4" />
                        <span>Dibayar</span>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <FiDollarSign className="w-4 h-4" />
                        <span>Sisa</span>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {projects.map((project, index) => {
                    const isEditing = editingId === project._id;
                    const current = tempChanges[project._id] || project;
                    const remaining = (current.totalBill || 0) - (current.paidAmount || 0);
                    const paidStatus = isPaid(current.paid);

                    return (
                      <tr key={project._id} className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        {/* Title */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          {isEditing ? (
                            <input
                              type="text"
                              defaultValue={current.title}
                              onChange={(e) => handleChange(project._id, "title", e.target.value)}
                              className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                          ) : (
                            <div className="font-medium text-gray-900 text-sm">{current.title}</div>
                          )}
                        </td>

                        {/* Client */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            onClick={() => openClientDetail(project.clientId)}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors text-sm"
                          >
                            <FiEye className="w-4 h-4" />
                            <span className="truncate max-w-[120px]">{clients[project.clientId] || "Tidak ditemukan"}</span>
                          </button>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          {isEditing ? (
                            <select
                              defaultValue={current.status}
                              onChange={(e) => handleChange(project._id, "status", e.target.value)}
                              className="border border-blue-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            >
                              <option value="ongoing">Ongoing</option>
                              <option value="done">Selesai</option>
                              <option value="canceled">Batal</option>
                            </select>
                          ) : (
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(current.status)}`}>
                              {getStatusIcon(current.status)}
                              <span className="whitespace-nowrap">
                                {current.status.charAt(0).toUpperCase() + current.status.slice(1)}
                              </span>
                            </div>
                          )}
                        </td>

                        {/* Deadline */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          {isEditing ? (
                            <input
                              type="date"
                              defaultValue={current.deadline ? new Date(current.deadline).toISOString().split("T")[0] : ""}
                              onChange={(e) => handleChange(project._id, "deadline", e.target.value)}
                              className="border border-blue-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                          ) : (
                            <p className="text-sm">{formatDate(current.deadline)}</p>
                          )}
                        </td>

                        {/* Payment Method */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          {isEditing ? (
                            <select
                              defaultValue={current.paymentMethod || ""}
                              onChange={(e) => handleChange(project._id, "paymentMethod", e.target.value)}
                              className="border border-blue-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            >
                              <option value="">-- Pilih --</option>
                              <option value="cash">Cash</option>
                              <option value="transfer">Transfer</option>
                              <option value="qris">QRIS</option>
                            </select>
                          ) : (
                            <div className="capitalize text-gray-800 font-medium text-sm">
                              {current.paymentMethod || "-"}
                            </div>
                          )}
                        </td>

                        {/* Payment Status */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          {isEditing ? (
                            <select
                              defaultValue={String(paidStatus)}
                              onChange={(e) => handleChange(project._id, "paid", e.target.value === "true")}
                              className="border border-blue-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            >
                              <option value="true">Lunas</option>
                              <option value="false">Belum Lunas</option>
                            </select>
                          ) : (
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${paidStatus
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                              }`}>
                              {paidStatus ? <FiCheckCircle className="w-3 h-3" /> : <FiXCircle className="w-3 h-3" />}
                              <span className="whitespace-nowrap">
                                {paidStatus ? "Lunas" : "Belum Lunas"}
                              </span>
                            </span>
                          )}
                        </td>

                        {/* Total Bill */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          {isEditing ? (
                            <input
                              type="number"
                              defaultValue={current.totalBill || 0}
                              onChange={(e) => handleInputChange(e, project._id, "totalBill")}
                              className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                          ) : (
                            <div className="font-medium text-gray-900 text-sm">
                              {formatCurrency(current.totalBill)}
                            </div>
                          )}
                        </td>

                        {/* Paid Amount */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          {isEditing ? (
                            <input
                              type="number"
                              defaultValue={current.paidAmount || 0}
                              onChange={(e) => handleInputChange(e, project._id, "paidAmount")}
                              className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                          ) : (
                            <div className="font-medium text-emerald-600 text-sm">
                              {formatCurrency(current.paidAmount)}
                            </div>
                          )}
                        </td>

                        {/* Remaining */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className={`font-medium text-sm ${remaining > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                            {formatCurrency(remaining)}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            {isEditing ? (
                              <button
                                onClick={() => handleSave(project._id)}
                                className="inline-flex items-center gap-1 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-xs font-medium"
                              >
                                <FiSave className="w-4 h-4" />
                                <span>Simpan</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => setEditingId(project._id)}
                                className="inline-flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
                              >
                                <FiEdit2 className="w-4 h-4" />
                                <span>Edit</span>
                              </button>
                            )}
                            <button
                              onClick={() => {
                                if (confirm("Yakin ingin hapus proyek ini?")) {
                                  fetch(`/api/projects/delete?id=${project._id}`, {
                                    method: "DELETE",
                                  }).then(() => {
                                    router.reload();
                                  });
                                }
                              }}
                              className="inline-flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs font-medium"
                            >
                              <FiTrash2 className="w-4 h-4" />
                              <span>Hapus</span>
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
        </div>
      )}

      {/* Client Detail Modal */}
      {isClientModalOpen && (
        <ClientDetailModal
          clientId={selectedClientId}
          isOpen={isClientModalOpen}
          onClose={() => setIsClientModalOpen(false)}
        />
      )}
    </>
  );
}