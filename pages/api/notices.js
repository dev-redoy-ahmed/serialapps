import { MongoClient, ObjectId } from 'mongodb';
import { COLLECTIONS } from '../../lib/constants';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://banglaserial:we1we2we3@banglaserial.rkn4sgi.mongodb.net/banglaserial?retryWrites=true&w=majority&appName=banglaserial";
const DB_NAME = "banglaserial";

export default async function handler(req, res) {
  let client;
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTIONS.NOTICES);

  switch (req.method) {
    case 'GET':
      try {
        const notices = await collection.find({}).toArray();
        res.status(200).json({ success: true, data: notices });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
      break;

    case 'POST':
      try {
        const noticeData = {
          ...req.body,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        const result = await collection.insertOne(noticeData);
        res.status(201).json({ success: true, data: { _id: result.insertedId, ...noticeData } });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
      break;

    case 'PUT':
      try {
        const { _id, ...updateData } = req.body;
        updateData.updatedAt = new Date();
        
        const result = await collection.updateOne(
          { _id: new ObjectId(_id) },
          { $set: updateData }
        );
        
        if (result.matchedCount === 0) {
          return res.status(404).json({ success: false, message: 'Notice not found' });
        }
        
        res.status(200).json({ success: true, message: 'Notice updated successfully' });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.query;
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        
        if (result.deletedCount === 0) {
          return res.status(404).json({ success: false, message: 'Notice not found' });
        }
        
        res.status(200).json({ success: true, message: 'Notice deleted successfully' });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: 'Method not allowed' });
  }
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ success: false, message: 'Database connection failed' });
  } finally {
    if (client) {
      await client.close();
    }
  }
}