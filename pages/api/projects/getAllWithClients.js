import clientPromise from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    const client = await clientPromise;
    const db = client.db("jobmanager");

    const projects = await db.collection("projects")
      .aggregate([
        {
          $lookup: {
            from: "clients",
            localField: "clientId",
            foreignField: "_id",
            as: "client"
          }
        },
        {
          $unwind: {
            path: "$client",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $sort: { createdAt: -1 }
        },
        {
          $project: {
            _id: 1,
            title: 1,
            status: 1,
            deadline: 1,
            paid: 1,
            paymentMethod: 1,
            totalBill: 1,
            paidAmount: 1,
            remaining: 1,
            createdAt: 1,
            "client._id": 1,
            "client.name": 1,
            "client.email": 1,
            "client.phone": 1
          }
        }
      ])
      .toArray();

    // Format response agar konsisten
    const formattedProjects = projects.map(project => ({
      ...project,
      _id: project._id.toString(),
      clientId: project.client ? {
        _id: project.client._id.toString(),
        name: project.client.name,
        email: project.client.email,
        phone: project.client.phone
      } : null,
      deadline: project.deadline.toISOString().split("T")[0], // format YYYY-MM-DD
      createdAt: project.createdAt.toISOString()
    }));

    res.status(200).json(formattedProjects);
  } catch (error) {
    console.error("Error fetching projects with clients:", error);
    res.status(500).json({ message: "Gagal mengambil data proyek", error });
  }
}