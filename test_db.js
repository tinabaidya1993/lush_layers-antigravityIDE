const mongoose = require('mongoose');
const dns = require('dns');

// Set public Google/Cloudflare DNS to bypass local Windows DNS SRV blocking
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.error("Failed to set DNS servers:", e);
}

const MONGODB_URI = "mongodb+srv://tinabaidya1993_db_user:eHwVixiFcpcrJ6rQ@cluster0.8vnrvna.mongodb.net/lush_layer_db?retryWrites=true&w=majority&appName=Cluster0";

async function testConn() {
  console.log("Attempting connection to MongoDB Atlas with Google DNS (8.8.8.8)...");
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("CONNECTED_TO_MONGODB_SUCCESSFULLY!");

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections in DB:", collections.map(c => c.name));

    process.exit(0);
  } catch (err) {
    console.error("MONGODB_CONNECTION_FAILED:", err.message);
    process.exit(1);
  }
}

testConn();
