#!/usr/bin/env node

console.log('🔍 Starting application diagnostics...\n');

// Check environment variables
console.log('📋 Environment Variables:');
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
console.log(`PORT: ${process.env.PORT || 'not set'}`);
console.log(`MONGODB_URI: ${process.env.MONGODB_URI ? 'set' : 'not set'}`);
console.log('');

// Check if we can connect to MongoDB
async function checkMongoDB() {
  try {
    const { MongoClient } = require('mongodb');
    const uri = process.env.MONGODB_URI || "mongodb+srv://banglaserial:we1we2we3@banglaserial.rkn4sgi.mongodb.net/banglaserial?retryWrites=true&w=majority&appName=banglaserial";
    
    console.log('🔌 Testing MongoDB connection...');
    const client = new MongoClient(uri);
    await client.connect();
    await client.db().admin().ping();
    await client.close();
    console.log('✅ MongoDB connection successful');
  } catch (error) {
    console.log('❌ MongoDB connection failed:', error.message);
  }
}

// Check if Next.js can start
async function checkNextJS() {
  try {
    console.log('\n🚀 Testing Next.js server...');
    const http = require('http');
    const url = require('url');
    
    // Simple test server
    const server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'OK', timestamp: new Date().toISOString() }));
    });
    
    const port = process.env.PORT || 3000;
    server.listen(port, '0.0.0.0', () => {
      console.log(`✅ Test server running on port ${port}`);
      server.close();
    });
    
  } catch (error) {
    console.log('❌ Server startup failed:', error.message);
  }
}

async function runDiagnostics() {
  await checkMongoDB();
  await checkNextJS();
  console.log('\n🏁 Diagnostics complete');
}

runDiagnostics().catch(console.error);
