import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ success: false, message: "Method tidak diizinkan" });
  }

  try {
    const { id } = req.query;
    const data = req.body;
    delete data._id;

    const client = await clientPromise;
    const db = client.db("jobmanager");

    await db.collection("clients").updateOne(
      { _id: new ObjectId(id) },
      { $set: data }
    );

    return res.status(200).json({ success: true, message: "Berhasil diperbarui" });
  } catch (error) {
    console.error("Error updating client:", error);
    return res.status(500).json({ success: false, message: "Gagal memperbarui client" });
  }
}