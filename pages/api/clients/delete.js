import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "DELETE") return res.status(405).end();

  const { id } = req.query;
  const client = await clientPromise;
  const db = client.db("jobmanager");

  try {
    // 1. Hapus semua project yang dimiliki client ini terlebih dahulu
    await db.collection("projects").deleteMany({ clientId: new ObjectId(id) });

    // 2. Hapus client itu sendiri
    await db.collection("clients").deleteOne({ _id: new ObjectId(id) });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}