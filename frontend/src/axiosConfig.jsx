import axios from 'axios';
import { API_URL } from "../config";

const axiosInstance = axios.create({
  //baseURL: 'http://localhost:5001', // local
  baseURL: ${API_URL}, // live
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
