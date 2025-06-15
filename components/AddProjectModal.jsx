import { useEffect, useState } from "react";
import {
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiFileText,
  FiCalendar,
  FiDollarSign,
  FiCreditCard,
  FiCheck,
  FiPlus,
  FiBriefcase,
  FiTag,
} from "react-icons/fi";

export default function AddProjectModal({ isOpen = true, onClose = () => {} }) {
  const [formData, setFormData] = useState({
    title: "",
    status: "ongoing",
    deadline: "",
    paid: "belum lunas", // diganti jadi string
    paymentMethod: "",
    totalBill: 0,
    paidAmount: 0,
    client: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    if (name in formData.client) {
      setFormData((prev) => ({
        ...prev,
        client: {
          ...prev.client,
          [name]: newValue,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: newValue }));
    }
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? 0 : Number(value),
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (
      !formData.title ||
      !formData.status ||
      !formData.deadline ||
      !formData.paymentMethod
    ) {
      alert("Semua field proyek harus diisi.");
      return;
    }

    if (!formData.client.name || !formData.client.email) {
      alert("Nama dan email client harus diisi");
      return;
    }

    try {
      const response = await fetch("/api/projects/addFull", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menyimpan proyek");
      }

      alert("Proyek berhasil ditambahkan!");
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-4 sm:my-8 overflow-hidden max-h-[95vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <FiPlus className="text-white text-xl" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">Tambah Proyek Baru</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-200"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[calc(95vh-80px)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 sm:space-y-8">
            {/* Informasi Client */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-100">
              <div className="flex items-center gap-2 mb-4">
                <FiUser className="text-blue-600 text-lg" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">Informasi Client</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FiUser className="text-blue-600" />
                    Nama Client
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.client?.name || ""}
                    onChange={handleChange}
                    placeholder="Masukkan nama client"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FiMail className="text-blue-600" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.client?.email || ""}
                    onChange={handleChange}
                    placeholder="client@email.com"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FiPhone className="text-blue-600" />
                    Telepon
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.client?.phone || ""}
                    onChange={handleChange}
                    placeholder="+62 812 3456 7890"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Detail Proyek */}
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-4 sm:p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <FiBriefcase className="text-blue-600 text-lg" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">Detail Proyek</h3>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FiFileText className="text-blue-600" />
                    Judul Proyek
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Masukkan judul proyek"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <FiTag className="text-blue-600" />
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="ongoing">🔄 Ongoing</option>
                      <option value="selesai">✅ Selesai</option>
                      <option value="batal">❌ Batal</option>
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <FiCalendar className="text-blue-600" />
                      Deadline
                    </label>
                    <input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Pembayaran */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 sm:p-6 border border-green-100">
              <div className="flex items-center gap-2 mb-6">
                <FiDollarSign className="text-green-600 text-lg" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">Informasi Pembayaran</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FiCreditCard className="text-green-600" />
                    Metode Pembayaran
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Pilih Metode</option>
                    <option value="cash">💵 Cash</option>
                    <option value="transfer">🏦 Transfer Bank</option>
                    <option value="qris">📱 QRIS</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FiDollarSign className="text-green-600" />
                    Total Tagihan
                  </label>
                  <input
                    type="number"
                    name="totalBill"
                    value={formData.totalBill}
                    onChange={handleNumberChange}
                    min="0"
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FiCheck className="text-green-600" />
                    Jumlah Dibayar
                  </label>
                  <input
                    type="number"
                    name="paidAmount"
                    value={formData.paidAmount}
                    onChange={handleNumberChange}
                    min="0"
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <span>Status Pembayaran</span>
                  </label>
                  <select
                    name="paid"
                    value={formData.paid}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="belum lunas">🔴 Belum Lunas</option>
                    <option value="lunas">🟢 Lunas</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <FiX className="text-lg" />
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <FiCheck className="text-lg" />
                Simpan Proyek
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}