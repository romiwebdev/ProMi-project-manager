import clientPromise from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    const client = await clientPromise;
    const db = client.db("jobmanager");

    const projects = await db.collection("projects")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Format response agar konsisten
    const formattedProjects = projects.map(project => ({
      ...project,
      _id: project._id.toString(),
      deadline: project.deadline.toISOString().split("T")[0], // format YYYY-MM-DD
    }));

    res.status(200).json(formattedProjects);
  } catch (error) {
    console.error("Error fetching all projects:", error);
    res.status(500).json({ message: "Gagal mengambil data proyek", error });
  }
}