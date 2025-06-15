import clientPromise from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("jobmanager");

    const notes = await db.collection("notes")
      .find({})
      .sort({ updatedAt: -1 })
      .toArray();

    const formattedNotes = notes.map(note => ({
      ...note,
      _id: note._id.toString(),
      projectId: note.projectId?.toString() || null,
      createdAt: note.createdAt.toISOString(),
      updatedAt: note.updatedAt.toISOString(),
    }));

    return res.status(200).json(formattedNotes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    return res.status(500).json({ message: "Failed to fetch notes", error: error.message });
  }
}