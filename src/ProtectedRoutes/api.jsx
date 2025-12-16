
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://project.pisofterp.com/realestate/api/v1', 
  headers: { 'Content-Type': 'application/json' },
});

export default api;


// export const backendUrl = "https://project.pisofterp.com/realestate/api/v1"
export const backendUrl = "http://localhost:8002/realEstate/api/v1"