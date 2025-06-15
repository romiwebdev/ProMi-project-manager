// utils/fetchClientList.js
export default async function fetchClientList() {
    const res = await fetch("/api/clients/getAll");
    if (!res.ok) throw new Error("Gagal mengambil daftar client");
    return res.json();
  }