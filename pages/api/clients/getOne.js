// pages/api/clients/getOne.js
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const { id } = req.query;
  const dbClient = await clientPromise;
  const db = dbClient.db("jobmanager");

  const client = await db.collection("clients").findOne({
    _id: new ObjectId(id),
  });

  if (!client) {
    return res.status(404).json({ error: "Client tidak ditemukan" });
  }

  res.status(200).json(client);
}