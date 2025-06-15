// Enhanced projects/delete.js dengan transaction
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "DELETE") return res.status(405).end();

  const { id } = req.query;
  const client = await clientPromise;
  const session = client.startSession();

  try {
    await session.withTransaction(async () => {
      const db = client.db("jobmanager");

      // 1. Dapatkan project yang akan dihapus
      const project = await db.collection("projects").findOne(
        { _id: new ObjectId(id) },
        { session }
      );
      
      if (!project) {
        throw new Error("Project not found");
      }

      // 2. Hapus project
      await db.collection("projects").deleteOne(
        { _id: new ObjectId(id) },
        { session }
      );

      // 3. Periksa apakah client masih memiliki project lain
      const otherProjects = await db.collection("projects").countDocuments(
        { clientId: project.clientId },
        { session }
      );

      // 4. Jika tidak ada project lain, hapus client
      if (otherProjects === 0) {
        await db.collection("clients").deleteOne(
          { _id: new ObjectId(project.clientId) },
          { session }
        );
      }
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ 
      error: error.message || "Internal server error" 
    });
  } finally {
    await session.endSession();
  }
}