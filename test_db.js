const mongoose = require('mongoose');
const Workspace = require('./server/models/Workspace');
require('dotenv').config({ path: './client/.env.local' }); // Try to get MongoURI

const fs = require('fs');
// Mongo URI might be in server/.env or client/.env.local
// Let's assume it's in process.env or hardcoded for test if needed
// But I'll try to read it from server/.env
const envFile = fs.readFileSync('./server/.env', 'utf8');
const mongoUri = envFile.split('\n').find(l => l.startsWith('MONGODB_URI=')).split('=')[1].trim();

console.log('URI:', mongoUri);

mongoose.connect(mongoUri)
    .then(async () => {
        console.log('Connected');
        try {
            const workspace = await Workspace.findOne();
            console.log('Workspace:', workspace);
        } catch (e) {
            console.error(e);
        } finally {
            mongoose.disconnect();
        }
    })
    .catch(err => console.error(err));
