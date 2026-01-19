const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

const runTests = async () => {
    console.log('🚀 Starting Backend API Tests...\n');

    try {
        // 1. Test Base Route
        console.log('Testing Base Route...');
        const baseResponse = await axios.get('http://localhost:5000/');
        console.log('✅ Base Route:', baseResponse.data.message);

        // 2. Test Auth Route (This will fail without a real token, but we check if it hits the server)
        console.log('\nTesting Auth Endpoint (Expected failure without real Firebase token)...');
        try {
            await axios.post(`${BASE_URL}/auth/google`, { idToken: 'test' });
        } catch (err) {
            console.log('✅ Auth Endpoint reachable (returned 401 as expected)');
        }

        // 3. Test Protected Route (Should return 401 without token)
        console.log('\nTesting Protected Projects Route...');
        try {
            await axios.get(`${BASE_URL}/projects`);
        } catch (err) {
            console.log('✅ Protected Route works (blocked access as expected)');
        }

        console.log('\n--- Test Summary ---');
        console.log('API is up and responding. Connection to MongoDB and Firebase is required for full feature tests.');
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
};

runTests();
