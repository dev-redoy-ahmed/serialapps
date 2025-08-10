#!/usr/bin/env node

const { MongoClient } = require('mongodb');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://banglaserial:we1we2we3@banglaserial.rkn4sgi.mongodb.net/banglaserial?retryWrites=true&w=majority&appName=banglaserial";
const DB_NAME = "banglaserial";

async function updateImagePaths() {
  let client;
  try {
    console.log('🔍 Connecting to database...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DB_NAME);

    // Update channels
    const channelsCollection = db.collection('channels');
    const channels = await channelsCollection.find({}).toArray();
    for (const channel of channels) {
      if (channel.logo_url && channel.logo_url.startsWith('/assets/images/channel/')) {
        const newPath = channel.logo_url.replace('/assets/images/channel/', '/assets/images/');
        await channelsCollection.updateOne({ _id: channel._id }, { $set: { logo_url: newPath } });
        console.log(`Updated channel ${channel.name}: ${channel.logo_url} -> ${newPath}`);
      }
    }

    // Update serials
    const serialsCollection = db.collection('serials');
    const serials = await serialsCollection.find({}).toArray();
    for (const serial of serials) {
      if (serial.image && serial.image.startsWith('/assets/images/serial/')) {
        const newPath = serial.image.replace('/assets/images/serial/', '/assets/images/');
        await serialsCollection.updateOne({ _id: serial._id }, { $set: { image: newPath } });
        console.log(`Updated serial ${serial.title || serial.name}: ${serial.image} -> ${newPath}`);
      }
    }

    console.log('\n✅ Database paths updated');
  } catch (error) {
    console.error('❌ Error updating database:', error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

updateImagePaths();