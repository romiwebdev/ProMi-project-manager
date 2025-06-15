import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method tidak diizinkan" });

  const {
    title,
    status,
    deadline,
    paid,
    paymentMethod,
    totalBill,
    paidAmount,
    client // objek client langsung dikirim dari form
  } = req.body;

  // Validasi data wajib
  if (!title || !status || !deadline || !paymentMethod) {
    return res.status(400).json({ message: "Semua field proyek harus diisi." });
  }

  if (!client || !client.name || !client.email) {
    return res.status(400).json({ message: "Nama dan email client harus diisi." });
  }

  try {
    const dbClient = await clientPromise;
    const db = dbClient.db("jobmanager");

    // 1. Tambahkan client baru ke koleksi 'clients'
    const newClientResult = await db.collection("clients").insertOne({
      name: client.name,
      email: client.email,
      phone: client.phone || "",
      createdAt: new Date(),
    });

    const clientId = newClientResult.insertedId;

    // 2. Tambahkan proyek baru ke koleksi 'projects'
    const projectResult = await db.collection("projects").insertOne({
      title,
      status, // ongoing / selesai / batal
      deadline: new Date(deadline),
      paid, // lunas / belum lunas
      paymentMethod, // cash / transfer / qris
      totalBill: Number(totalBill),
      paidAmount: Number(paidAmount),
      remaining: Number(totalBill) - Number(paidAmount),
      clientId,
      createdAt: new Date(),
    });

    return res.status(200).json({
      message: "Proyek dan client berhasil ditambahkan",
      projectId: projectResult.insertedId,
      clientId,
    });
  } catch (error) {
    console.error("Error saat menyimpan data:", error);
    return res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
  }
}