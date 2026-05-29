import axios from 'axios';


const api = axios.create({

  baseURL: "http://54.79.136.187:5001",
  headers: { 'Content-Type': 'application/json' },
});

export default api;


