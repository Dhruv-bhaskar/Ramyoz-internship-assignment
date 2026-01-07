// pages/api/notes/index.js
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  const collection = db.collection('notes');

  // GET - Fetch all notes
  if (req.method === 'GET') {
    try {
      const notes = await collection
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      
      res.status(200).json({ success: true, data: notes });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
  
  // POST - Create a new note
  else if (req.method === 'POST') {
    try {
      const { title, content } = req.body;
      
      if (!title || !content) {
        return res.status(400).json({ 
          success: false, 
          error: 'Title and content are required' 
        });
      }

      const note = {
        title,
        content,
        createdAt: new Date(),
      };

      const result = await collection.insertOne(note);
      const newNote = await collection.findOne({ _id: result.insertedId });
      
      res.status(201).json({ success: true, data: newNote });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
  
  else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}