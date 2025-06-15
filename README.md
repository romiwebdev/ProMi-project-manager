
# 📁 ProMi - Projects Romi

Manajemen proyek dan klien sederhana berbasis web. Cocok untuk freelancer atau pelaku usaha kecil yang ingin melacak pekerjaan, pembayaran, dan laporan secara efisien.

---

## ✨ Fitur Utama

- 🔐 Login sederhana (tanpa database user)
- 👥 Manajemen Client (tambah, lihat, hapus)
- 📋 Tambah Proyek sekaligus Client
- 💸 Pembayaran: tunai / transfer / QRIS
- 📊 Statistik: status proyek, pendapatan
- 🔍 Filter proyek berdasarkan status & pembayaran
- 📖 History perubahan proyek
- 📆 Laporan Mingguan & Bulanan (siap dikembangkan)

---

## 🛠️ Tech Stack

- **Next.js** (pages-based)
- **MongoDB** via `mongodb` driver
- **Tailwind CSS** via CDN
- **Icon**: React Icons
---

## 🚀 Cara Menjalankan

### 1. Clone Repo
```bash
git clone https://github.com/romiwebdev/ProMi-project-manager.git
cd ProMi-project-manager
````

### 2. Install Dependency

```bash
npm install
```

### 3. Setup Environment

Buat file `.env.local`:

```
MONGODB_URI=your_mongodb_connection_string
```

### 4. Jalankan App

```bash
npm run dev
```

Buka di: [http://localhost:3000](http://localhost:3000)

---

## 📝 Catatan Penggunaan

* Login cukup mengetik apa saja di field password (tidak ada autentikasi kompleks).
* Semua data disimpan di MongoDB: `clients`, `projects`, dan `activityLogs`.
* Fitur laporan mingguan/bulanan dan export PDF bisa dikembangkan lebih lanjut.

---

## 🧑‍💻 Kontribusi

Pull request sangat terbuka! Kamu bisa bantu di:

* Export laporan ke PDF
* Fitur reminder deadline
* Pencarian client/proyek lebih detail
* Auth login berbasis email/password

---

## 📄 Lisensi

MIT License.

---

> Dibuat dengan semangat produktif oleh Romi.

