import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { title, content, projectId, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const client = await clientPromise;
    const db = client.db("jobmanager");

    const note = {
      title,
      content,
      projectId: projectId ? new ObjectId(projectId) : null,
      tags: tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("notes").insertOne(note);

    return res.status(201).json({
      message: "Note created successfully",
      noteId: result.insertedId,
    });
  } catch (error) {
    console.error("Error creating note:", error);
    return res.status(500).json({ message: "Failed to create note", error: error.message });
  }
}