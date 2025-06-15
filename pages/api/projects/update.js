// api/projects/update.js
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method tidak diizinkan" });
  }

  try {
    const {
      id,
      title,
      status,
      deadline,
      paid,
      paymentMethod,
      totalBill,
      paidAmount,
    } = req.body;

    // Validasi field wajib
    if (!title || !status || !deadline || !paymentMethod) {
      return res.status(400).json({ success: false, message: "Semua field proyek harus diisi." });
    }

    const updateData = { 
      title,
      status,
      deadline: new Date(deadline),
      paid: paid || "belum lunas", // Default to "belum lunas" if not provided
      paymentMethod,
      totalBill: Number(totalBill || 0),
      paidAmount: Number(paidAmount || 0),
      remaining: Number(totalBill || 0) - Number(paidAmount || 0),
      updatedAt: new Date()
    };

    const clientDB = await clientPromise;
    const db = clientDB.db("jobmanager");

    const result = await db.collection("projects").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "Proyek tidak ditemukan" });
    }

    return res.status(200).json({ success: true, message: "Proyek berhasil diperbarui" });
  } catch (error) {
    console.error("Error updating project:", error);
    return res.status(500).json({ success: false, message: "Gagal memperbarui proyek", error: error.message });
  }
}