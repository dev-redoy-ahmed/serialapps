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
          
          // Get channel information for each serial
          const channelsCollection = db.collection('channels');
          const serialsWithChannels = await Promise.all(
            serials.map(async (serial) => {
              if (serial.channel_id) {
                try {
                  const channel = await channelsCollection.findOne({ 
                    _id: serial.channel_id 
                  });
                  return { 
                    ...serial, 
                    channel,
                    // Map database fields to frontend expected fields
                    name: serial.title,
                    channelId: serial.channel_id,
                    imageUrl: serial.image
                  };
                } catch (error) {
                  console.error('Error fetching channel for serial:', serial._id, error);
                  return { 
                    ...serial,
                    name: serial.title,
                    channelId: serial.channel_id,
                    imageUrl: serial.image
                  };
                }
              }
              return { 
                ...serial,
                name: serial.title,
                channelId: serial.channel_id,
                imageUrl: serial.image
              };
            })
          );
          
          res.status(200).json({ success: true, data: serialsWithChannels });
        } catch (error) {
          console.error('Error fetching serials:', error);
          res.status(500).json({ success: false, message: error.message });
        }
        break;

      case 'POST':
        try {
          const { name, description, channelId, imageUrl, status = 'active' } = req.body;
          
          if (!name || !channelId) {
            return res.status(400).json({ success: false, message: 'Name and Channel ID are required' });
          }

          const newSerial = {
            title: name, // Map to database field
            description: description || '',
            channel_id: channelId, // Map to database field
            image: imageUrl || '', // Map to database field
            status,
            views: 0,
            createdAt: new Date(),
            updatedAt: new Date()
          };

          const result = await collection.insertOne(newSerial);
          
          // Get the created serial with channel info
          const createdSerial = await collection.findOne({ _id: result.insertedId });
          const channelsCollection = db.collection('channels');
          let channel = null;
          try {
            channel = await channelsCollection.findOne({ 
              _id: channelId 
            });
          } catch (error) {
            console.error('Error fetching channel:', error);
          }
          
          res.status(201).json({ 
            success: true, 
            data: { 
              ...createdSerial, 
              channel,
              name: createdSerial.title,
              channelId: createdSerial.channel_id,
              imageUrl: createdSerial.image
            } 
          });
        } catch (error) {
          console.error('Error creating serial:', error);
          res.status(500).json({ success: false, message: error.message });
        }
        break;

      case 'PUT':
        try {
          const { id, name, description, channelId, imageUrl, status } = req.body;
          
          if (!id || !name || !channelId) {
            return res.status(400).json({ success: false, message: 'ID, Name and Channel ID are required' });
          }

          const updateData = {
            title: name, // Map to database field
            description: description || '',
            channel_id: channelId, // Map to database field
            image: imageUrl || '', // Map to database field
            status: status || 'active',
            updatedAt: new Date()
          };

          const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
          );

          if (result.matchedCount === 0) {
            return res.status(404).json({ success: false, message: 'Serial not found' });
          }

          // Get the updated serial with channel info
          const updatedSerial = await collection.findOne({ _id: new ObjectId(id) });
          const channelsCollection = db.collection('channels');
          let channel = null;
          try {
            channel = await channelsCollection.findOne({ 
              _id: channelId 
            });
          } catch (error) {
            console.error('Error fetching channel:', error);
          }
          
          res.status(200).json({ 
            success: true, 
            data: { 
              ...updatedSerial, 
              channel,
              name: updatedSerial.title,
              channelId: updatedSerial.channel_id,
              imageUrl: updatedSerial.image
            } 
          });
        } catch (error) {
          console.error('Error updating serial:', error);
          res.status(500).json({ success: false, message: error.message });
        }
        break;

      case 'DELETE':
        try {
          const { id } = req.body;
          
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