import { MongoClient } from 'mongodb';
import { COLLECTIONS } from '../../lib/constants';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://banglaserial:we1we2we3@banglaserial.rkn4sgi.mongodb.net/banglaserial?retryWrites=true&w=majority&appName=banglaserial";
const DB_NAME = "banglaserial";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  let client;
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    
    // Fetch all data from existing collections only
    const [
      channels,
      premiumPurchases,
      admobAds,
      episodes,
      notices,
      serials,
      appUpdates
    ] = await Promise.all([
      db.collection(COLLECTIONS.CHANNELS).find({}).toArray(),
      db.collection(COLLECTIONS.PREMIUM_PURCHASES).find({}).toArray(),
      db.collection(COLLECTIONS.ADMOB_ADS).find({}).toArray(),
      db.collection(COLLECTIONS.EPISODES).find({}).toArray(),
      db.collection(COLLECTIONS.NOTICES).find({}).toArray(),
      db.collection(COLLECTIONS.SERIALS).find({}).toArray(),
      db.collection(COLLECTIONS.APP_UPDATES).find({}).toArray()
    ]);

    // Get collection stats
    const stats = {
      channels: channels.length,
      premiumPurchases: premiumPurchases.length,
      admobAds: admobAds.length,
      episodes: episodes.length,
      notices: notices.length,
      serials: serials.length,
      appUpdates: appUpdates.length,
      totalDocuments: channels.length + premiumPurchases.length + admobAds.length +
                     episodes.length + notices.length + serials.length + appUpdates.length
    };

    const response = {
      success: true,
      data: {
        channels,
        premiumPurchases,
        admobAds,
        episodes,
        notices,
        serials,
        appUpdates
      },
      stats,
      timestamp: new Date().toISOString()
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch data',
      error: error.message 
    });
  } finally {
    if (client) {
      await client.close();
    }
  }
}