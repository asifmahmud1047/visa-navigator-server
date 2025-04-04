// Simple test script to verify server functionality
const axios = require('axios');

const baseUrl = 'http://localhost:5002';

async function testServer() {
  try {
    console.log('Testing root endpoint...');
    const root = await axios.get(baseUrl);
    console.log('✅ Root endpoint works:', root.data);
  } catch (error) {
    console.error('❌ Root endpoint failed:', error.message);
  }

  try {
    console.log('\nTesting visas endpoint...');
    const visas = await axios.get(`${baseUrl}/api/visas`);
    console.log('✅ Visas endpoint works, found', visas.data.length, 'visas');
  } catch (error) {
    console.error('❌ Visas endpoint failed:', error.message);
  }
}

testServer(); 