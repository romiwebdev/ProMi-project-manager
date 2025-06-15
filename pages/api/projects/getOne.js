import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const { id } = req.query;

  try {
    const client = await clientPromise;
    const db = client.db("jobmanager");
    const project = await db.collection("projects").findOne({
      _id: new ObjectId(id),
    });

    if (!project) {
      return res.status(404).json({ message: "Proyek tidak ditemukan" });
    }

    // Format response agar konsisten
    const formattedProject = {
      ...project,
      _id: project._id.toString(),
      deadline: project.deadline.toISOString().split("T")[0],
    };

    res.status(200).json(formattedProject);
  } catch (error) {
    console.error("Error fetching one project:", error);
    res.status(500).json({ message: "Gagal mengambil detail proyek", error });
  }
}