import axios from 'axios';
import { Platform } from 'react-native';

const api = axios.create({
    baseURL: Platform.OS === 'web' 
        ? 'http://localhost:5039/api' 
        : 'http://192.168.1.12:5039/api', 
    timeout: 10000,
});

export default api;