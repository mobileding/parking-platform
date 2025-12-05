// Example of the new client initialization (adjust path and variable names as necessary)
import { createClient } from 'redis';

// Use the full REDIS_URL from your .env.local file
const client = createClient({
  url: process.env.REDIS_URL 
});

client.on('error', (err) => console.log('Redis Client Error', err));

// Connect the client immediately
client.connect(); 

export const redis = client;