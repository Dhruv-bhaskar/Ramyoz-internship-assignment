// pages/api/notes/[id].js
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const { id } = req.query;

  // Validate ObjectId
  if (!id || !ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, error: "Invalid ID format" });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("notes");

    // GET - Fetch a single note
    if (req.method === "GET") {
      const note = await collection.findOne({ _id: new ObjectId(id) });

      if (!note) {
        return res
          .status(404)
          .json({ success: false, error: "Note not found" });
      }

      return res.status(200).json({ success: true, data: note });
    }

    // PUT - Update a note
    else if (req.method === "PUT") {
      const { title, content } = req.body;

      if (!title || !content) {
        return res.status(400).json({
          success: false,
          error: "Title and content are required",
        });
      }

      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { title, content } },
        { returnDocument: "after" }
      );

      if (!result) {
        return res
          .status(404)
          .json({ success: false, error: "Note not found" });
      }

      return res.status(200).json({ success: true, data: result.value });
    }

    // DELETE - Delete a note
    else if (req.method === "DELETE") {
      const result = await collection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return res
          .status(404)
          .json({ success: false, error: "Note not found" });
      }

      return res.status(200).json({ success: true, message: "Note deleted" });
    } else {
      return res
        .status(405)
        .json({ success: false, error: "Method not allowed" });
    }
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
