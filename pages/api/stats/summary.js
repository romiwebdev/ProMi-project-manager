import clientPromise from "@/lib/db";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("jobmanager");

  const projects = await db.collection("projects").find().toArray();
  const clientsCount = await db.collection("clients").countDocuments();

  const paidCount = projects.filter(p => p.paid === "lunas").length;
  const unpaidCount = projects.filter(p => p.paid === "belum lunas").length;
  
  // Calculate total income from paid projects
  const totalIncome = projects
    .filter(p => p.paid === "lunas")
    .reduce((sum, p) => sum + (p.paidAmount || 0), 0);

  const statusCounts = {
    ongoing: projects.filter(p => p.status === "ongoing").length,
    done: projects.filter(p => p.status === "done").length,
    canceled: projects.filter(p => p.status === "canceled").length
  };

  res.status(200).json({
    totalProjects: projects.length,
    totalClients: clientsCount,
    paidCount,
    unpaidCount,
    totalIncome,
    statusCounts
  });
}