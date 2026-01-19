import axios from 'axios';
import { Platform } from 'react-native';

// Configuration for different environments
const DEV_MACHINE_IP = '192.168.1.118'; // Automatically detected IP

const BASE_URL = Platform.select({
    android: `http://${DEV_MACHINE_IP}:5000`, // Physical Android Device & Emulator (via LAN IP)
    // android: 'http://10.0.2.2:5000', // Emulator specific (fallback)
    ios: `http://${DEV_MACHINE_IP}:5000`, // Physical iOS Device
    default: `http://${DEV_MACHINE_IP}:5000` // Web & Physical Android (often falls here)
});

console.log('🚀 API Service Configured with URL:', BASE_URL);

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export default api;
