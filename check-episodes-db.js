const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'banglaserial';

async function checkEpisodes() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const episodes = await db.collection('episodes').find({}).toArray();
    console.log('Episodes:');
    episodes.forEach(ep => {
      console.log(ep);
    });
  } catch (error) {
    console.error('Error checking episodes:', error);
  } finally {
    await client.close();
  }
}

checkEpisodes();