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
    const collection = db.collection(COLLECTIONS.CHANNELS);

  switch (req.method) {
    case 'GET':
      try {
        const channels = await collection.find({}).toArray();
        res.status(200).json({ success: true, data: channels });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
      break;

    case 'POST':
      try {
        const { name, logo_url, is_active = true } = req.body;
        
        if (!name) {
          return res.status(400).json({ success: false, message: 'Name is required' });
        }

        const newChannel = {
          name,
          logo_url: logo_url || '',
          is_active,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const result = await collection.insertOne(newChannel);
        const createdChannel = await collection.findOne({ _id: result.insertedId });
        
        res.status(201).json({ success: true, data: createdChannel });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
      break;

    case 'PUT':
      try {
        const { _id, name, logo_url, is_active } = req.body;
        
        if (!_id || !name) {
          return res.status(400).json({ success: false, message: 'ID and Name are required' });
        }

        const updateData = {
          name,
          logo_url: logo_url || '',
          is_active: is_active !== undefined ? is_active : true,
          updatedAt: new Date()
        };

        const result = await collection.updateOne(
          { _id: new ObjectId(_id) },
          { $set: updateData }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ success: false, message: 'Channel not found' });
        }

        const updatedChannel = await collection.findOne({ _id: new ObjectId(_id) });
        res.status(200).json({ success: true, data: updatedChannel });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.query;
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        
        if (result.deletedCount === 0) {
          return res.status(404).json({ success: false, message: 'Channel not found' });
        }
        
        res.status(200).json({ success: true, message: 'Channel deleted successfully' });
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