#!/usr/bin/env node

const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://banglaserial:we1we2we3@banglaserial.rkn4sgi.mongodb.net/banglaserial?retryWrites=true&w=majority&appName=banglaserial";
const DB_NAME = "banglaserial";

async function cleanEpisodes() {
  let client;
  try {
    console.log('🔍 Connecting to database...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection('episodes');

    const result = await collection.updateMany(
      {},
      { $unset: { title: "", description: "", duration: "", thumbnail: "", serial_title: "" } }
    );

    console.log(`Updated ${result.modifiedCount} episodes.`);
    console.log('\n✅ Database cleaned');
  } catch (error) {
    console.error('❌ Error cleaning database:', error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

cleanEpisodes();