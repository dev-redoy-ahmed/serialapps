import { connectToDatabase } from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('ads');

    switch (req.method) {
      case 'GET':
        try {
          const ads = await collection.find({}).toArray();
          res.status(200).json(ads);
        } catch (error) {
          console.error('Error fetching ads:', error);
          res.status(500).json({ error: 'Failed to fetch ads' });
        }
        break;

      case 'PUT':
        try {
          const { 
            id,
            interstitial_ad_id, 
            banner_ad_id, 
            native_ad_id, 
            app_open_ad_id, 
            reward_ad_id, 
            is_ads_enabled 
          } = req.body;

          if (!id) {
            return res.status(400).json({ error: 'Ad ID is required' });
          }

          const updateData = {
            interstitial_ad_id: interstitial_ad_id || '',
            banner_ad_id: banner_ad_id || '',
            native_ad_id: native_ad_id || '',
            app_open_ad_id: app_open_ad_id || '',
            reward_ad_id: reward_ad_id || '',
            is_ads_enabled: is_ads_enabled !== undefined ? is_ads_enabled : false,
            updatedAt: new Date()
          };

          const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
          );

          if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Ad not found' });
          }

          const updatedAd = await collection.findOne({ _id: new ObjectId(id) });
          res.status(200).json(updatedAd);
        } catch (error) {
          console.error('Error updating ad:', error);
          res.status(500).json({ error: 'Failed to update ad' });
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
}