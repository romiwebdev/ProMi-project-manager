import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import {
  FolderOpen,
  Users,
  CheckCircle,
  XCircle,
  Wallet,
  TrendingUp,
  BarChart3,
  PieChart,
  Calendar,
  Star
} from 'lucide-react';

// Register Chart.js components
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function StatsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalClients: 0,
    paidCount: 0,
    unpaidCount: 0,
    totalIncome: 0,
    statusCounts: {
      ongoing: 0,
      done: 0,
      canceled: 0
    }
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn !== "true") router.push("/");

    fetch("/api/stats/summary")
      .then((res) => res.json())
      .then(data => {
        setStats(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching stats:", err);
        setIsLoading(false);
      });
  }, []);

  // Format totalIncome for display
  const formatIncome = (amount) => {
    if (amount >= 1000000000) {
      return `Rp${(amount / 1000000000).toFixed(1)}M`;
    }
    if (amount >= 1000000) {
      return `Rp${(amount / 1000000).toFixed(1)}jt`;
    }
    return `Rp${amount.toLocaleString('id-ID')}`;
  };

  const formattedIncome = formatIncome(stats.totalIncome);
  const fullIncome = `Rp${stats.totalIncome.toLocaleString('id-ID')}`;

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-blue-800 font-medium">Memuat statistik...</p>
          </div>
        </div>
      </Layout>
    );
  }


  function StatCard({ title, value, icon: Icon, color, gradient, isLarge = false }) {
    return (
      <div className={`group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${isLarge ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
        <div className="relative p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`bg-gradient-to-br ${gradient} rounded-xl p-3 shadow-lg`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div className={`w-2 h-2 bg-gradient-to-br ${gradient} rounded-full animate-pulse`}></div>
          </div>
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
            {title}
          </h3>
          <p className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            {value}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                  Dashboard Analytics
                </h1>
                <p className="text-blue-100 mt-2 text-sm sm:text-base">
                  Statistik Proyek & Pembayaran Real-time
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">
            <StatCard
              title="Total Proyek"
              value={stats.totalProjects}
              icon={FolderOpen}
              color="blue"
              gradient="from-blue-500 to-blue-600"
            />
            <StatCard
              title="Total Client"
              value={stats.totalClients}
              icon={Users}
              color="indigo"
              gradient="from-indigo-500 to-indigo-600"
            />
            <StatCard
              title="Sudah Lunas"
              value={stats.paidCount}
              icon={CheckCircle}
              color="emerald"
              gradient="from-emerald-500 to-emerald-600"
            />
            <StatCard
              title="Belum Lunas"
              value={stats.unpaidCount}
              icon={XCircle}
              color="rose"
              gradient="from-rose-500 to-rose-600"
            />
            <StatCard
              title="Total Penghasilan"
              value={
                <>
                  {formattedIncome}
                  <span className="block text-xs sm:text-sm font-normal text-gray-500 mt-1">
                    ({fullIncome})
                  </span>
                </>
              }
              icon={Wallet}
              color="purple"
              gradient="from-purple-500 to-purple-600"
              isLarge
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
            <StatusPieChart statusCounts={stats.statusCounts} />
            <PaymentBarChart paid={stats.paidCount} unpaid={stats.unpaidCount} />
          </div>

          {/* Additional Insights */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InsightCard
              icon={TrendingUp}
              title="Success Rate"
              value={`${Math.round((stats.paidCount / stats.totalProjects) * 100)}%`}
              description="Proyek yang berhasil dibayar"
              color="emerald"
            />
            <InsightCard
              icon={Calendar}
              title="Project Status"
              value={`${stats.statusCounts.ongoing}`}
              description="Proyek sedang berjalan"
              color="blue"
            />
            <InsightCard
              icon={Star}
              title="Completion Rate"
              value={`${Math.round((stats.statusCounts.done / stats.totalProjects) * 100)}%`}
              description="Proyek yang selesai"
              color="purple"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

// --- Komponen Pendukung ---

function StatCard({ title, value, icon: Icon, color, gradient, isLarge = false }) {
  return (
    <div className={`group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${isLarge ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`bg-gradient-to-br ${gradient} rounded-xl p-3 shadow-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className={`w-2 h-2 bg-gradient-to-br ${gradient} rounded-full animate-pulse`}></div>
        </div>
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
          {title}
        </h3>
        <p className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
          {value}
        </p>
      </div>
    </div>
  );
}

function StatusPieChart({ statusCounts }) {
  const data = {
    labels: Object.keys(statusCounts).map(k => {
      const labels = {
        ongoing: 'Berlangsung',
        done: 'Selesai',
        canceled: 'Dibatalkan'
      };
      return labels[k] || k.charAt(0).toUpperCase() + k.slice(1);
    }),
    datasets: [{
      label: "Jumlah Proyek",
      data: Object.values(statusCounts),
      backgroundColor: [
        "rgba(59, 130, 246, 0.8)",
        "rgba(16, 185, 129, 0.8)",
        "rgba(239, 68, 68, 0.8)"
      ],
      borderColor: [
        "rgb(59, 130, 246)",
        "rgb(16, 185, 129)",
        "rgb(239, 68, 68)"
      ],
      borderWidth: 2,
      hoverBackgroundColor: [
        "rgba(59, 130, 246, 0.9)",
        "rgba(16, 185, 129, 0.9)",
        "rgba(239, 68, 68, 0.9)"
      ]
    }]
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 h-[400px] sm:h-[450px] flex flex-col">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-2">
          <PieChart className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">Status Proyek</h2>
      </div>
      <div className="flex-grow">
        <Pie
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  padding: 20,
                  usePointStyle: true,
                  font: {
                    size: 12,
                    weight: '500'
                  }
                }
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                cornerRadius: 8,
                padding: 12
              }
            },
          }}
        />
      </div>
    </div>
  );
}

function PaymentBarChart({ paid, unpaid }) {
  const data = {
    labels: ["Lunas", "Belum Lunas"],
    datasets: [{
      label: "Jumlah Proyek",
      data: [paid, unpaid],
      backgroundColor: [
        "rgba(16, 185, 129, 0.8)",
        "rgba(239, 68, 68, 0.8)"
      ],
      borderColor: [
        "rgb(16, 185, 129)",
        "rgb(239, 68, 68)"
      ],
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false,
    }]
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 h-[400px] sm:h-[450px] flex flex-col">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-2">
          <BarChart3 className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">Status Pembayaran</h2>
      </div>
      <div className="flex-grow">
        <Bar
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                cornerRadius: 8,
                padding: 12
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                  font: {
                    weight: '500'
                  }
                }
              },
              x: {
                grid: {
                  display: false
                },
                ticks: {
                  font: {
                    weight: '500'
                  }
                }
              }
            }
          }}
        />
      </div>
    </div>
  );
}

function InsightCard({ icon: Icon, title, value, description, color }) {
  const gradients = {
    emerald: 'from-emerald-500 to-emerald-600',
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600'
  };

  return (
    <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6">
      <div className="flex items-center space-x-4">
        <div className={`bg-gradient-to-br ${gradients[color]} rounded-xl p-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            {title}
          </h3>
          <p className={`text-2xl font-bold bg-gradient-to-r ${gradients[color]} bg-clip-text text-transparent`}>
            {value}
          </p>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
}