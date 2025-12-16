
import axios from 'axios';

const api = axios.create({
  headers: { 'Content-Type': 'application/json' },
});

export default api;


export const backendUrl = "https://project.pisofterp.com/realestate/api/v1"