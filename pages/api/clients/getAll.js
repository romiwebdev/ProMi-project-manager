import clientPromise from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const client = await clientPromise;
  const db = client.db("jobmanager");
  const clients = await db.collection("clients").find({}).sort({ createdAt: -1 }).toArray();

  res.status(200).json(clients);
}
