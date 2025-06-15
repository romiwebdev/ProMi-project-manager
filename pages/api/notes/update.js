import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { id } = req.query;
    const { title, content, projectId, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const client = await clientPromise;
    const db = client.db("jobmanager");

    const updateData = {
      title,
      content,
      projectId: projectId ? new ObjectId(projectId) : null,
      tags: tags || [],
      updatedAt: new Date(),
    };

    const result = await db.collection("notes").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Note not found" });
    }

    return res.status(200).json({ message: "Note updated successfully" });
  } catch (error) {
    console.error("Error updating note:", error);
    return res.status(500).json({ message: "Failed to update note", error: error.message });
  }
}