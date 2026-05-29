import axios from 'axios';
//const API_URL = "http://54.79.136.187:5001";
//import { API_URL } from "../config";

const api = axios.create({
  //baseURL: `${API_URL}`,
  //baseURL: process.env.REACT_APP_API_URL,
  baseURL: "http://54.79.136.187:5001",
  headers: { 'Content-Type': 'application/json' },
});

export default api;

/*
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

export default api;
*/
