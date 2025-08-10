#!/usr/bin/env node

const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://banglaserial:we1we2we3@banglaserial.rkn4sgi.mongodb.net/banglaserial?retryWrites=true&w=majority&appName=banglaserial";
const DB_NAME = "banglaserial";

async function checkDatabaseData() {
  let client;
  try {
    console.log('🔍 Connecting to database...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DB_NAME);

    // Check channels collection
    console.log('\n📺 CHANNELS DATA:');
    const channelsCollection = db.collection('channels');
    const channels = await channelsCollection.find({}).toArray();
    console.log(`Found ${channels.length} channels:`);
    channels.forEach((channel, index) => {
      console.log(`${index + 1}. Name: ${channel.name || 'N/A'}`);
      console.log(`   Logo URL: ${channel.logo_url || 'N/A'}`);
      console.log(`   Active: ${channel.is_active || 'N/A'}`);
      console.log(`   Created: ${channel.createdAt || 'N/A'}`);
      console.log(`   Updated: ${channel.updatedAt || 'N/A'}`);
      console.log('   ---');
    });

    // Check serials collection
    console.log('\n🎬 SERIALS DATA:');
    const serialsCollection = db.collection('serials');
    const serials = await serialsCollection.find({}).toArray();
    console.log(`Found ${serials.length} serials:`);
    serials.forEach((serial, index) => {
      console.log(`${index + 1}. Name: ${serial.title || serial.name || 'N/A'}`);
      console.log(`   Image: ${serial.image || 'N/A'}`);
      console.log(`   Active: ${serial.is_active || 'N/A'}`);
      console.log(`   Created: ${serial.createdAt || 'N/A'}`);
      console.log(`   Updated: ${serial.updatedAt || 'N/A'}`);
      console.log('   ---');
    });

    console.log('\n✅ Database check complete');
  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

checkDatabaseData();