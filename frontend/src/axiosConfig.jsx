import axios from 'axios';
const API_URL = "http://54.79.136.187:5001";
//import { API_URL } from "../config";

const axiosInstance = axios.create({
  //baseURL: 'http://localhost:5001', // local
  baseURL: `${API_URL}`,
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
