import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://banglaserial:we1we2we3@banglaserial.rkn4sgi.mongodb.net/banglaserial?retryWrites=true&w=majority&appName=banglaserial";
const DB_NAME = "banglaserial";

export default async function handler(req, res) {
  let client;
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection('serials');

    switch (req.method) {
      case 'GET':
        try {
          const serials = await collection.find({}).toArray();
          
          // Map database fields to frontend expected fields
          const serialsWithMappedFields = serials.map(serial => ({
            ...serial,
            name: serial.title || serial.name,
            image: serial.image || ''
          }));
          
          res.status(200).json({ success: true, data: serialsWithMappedFields });
        } catch (error) {
          console.error('Error fetching serials:', error);
          res.status(500).json({ success: false, message: error.message });
        }
        break;

      case 'POST':
        try {
          const { name, image, is_active = true } = req.body;
          
          if (!name) {
            return res.status(400).json({ success: false, message: 'Name is required' });
          }

          const newSerial = {
            title: name,
            image: image || '',
            is_active,
            createdAt: new Date(),
            updatedAt: new Date()
          };

          const result = await collection.insertOne(newSerial);
          const createdSerial = await collection.findOne({ _id: result.insertedId });
          
          res.status(201).json({ success: true, data: createdSerial });
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
        break;

      case 'PUT':
        try {
          const { _id, name, image, is_active } = req.body;
          
          if (!_id || !name) {
            return res.status(400).json({ success: false, message: 'ID and Name are required' });
          }

          const updateData = {
            title: name,
            image: image || '',
            is_active: is_active !== undefined ? is_active : true,
            updatedAt: new Date()
          };

          const result = await collection.updateOne(
            { _id: new ObjectId(_id) },
            { $set: updateData }
          );

          if (result.matchedCount === 0) {
            return res.status(404).json({ success: false, message: 'Serial not found' });
          }

          const updatedSerial = await collection.findOne({ _id: new ObjectId(_id) });
          res.status(200).json({ success: true, data: updatedSerial });
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
        break;

      case 'DELETE':
        try {
          const { id } = req.query;
          
          if (!id) {
            return res.status(400).json({ success: false, message: 'Serial ID is required' });
          }

          const result = await collection.deleteOne({ _id: new ObjectId(id) });
          
          if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: 'Serial not found' });
          }

          res.status(200).json({ success: true, message: 'Serial deleted successfully' });
        } catch (error) {
          console.error('Error deleting serial:', error);
          res.status(500).json({ success: false, message: error.message });
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
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