const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'banglaserial';

async function cleanEpisodes() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const episodesCollection = db.collection('episodes');

    const result = await episodesCollection.updateMany(
      {},
      { $unset: { createdAt: '', updatedAt: '', views: '' } }
    );

    console.log(`Updated ${result.modifiedCount} episodes`);
  } catch (error) {
    console.error('Error cleaning episodes:', error);
  } finally {
    await client.close();
  }
}

cleanEpisodes();