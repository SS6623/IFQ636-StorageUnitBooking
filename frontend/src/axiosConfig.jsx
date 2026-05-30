import axios from 'axios';


const api = axios.create({

  baseURL: "http://13.210.124.59:5001",
  headers: { 'Content-Type': 'application/json' },
});

export default api;


