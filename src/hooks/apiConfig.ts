export const API_BASE_URL = "http://localhost:8082/api/v1";

// Production environment
// export const API_BASE_URL = "https://checklist-api-8j62.onrender.com/api/v1/"; PROD

// Dev environment
// export const API_BASE_URL = "https://checklist-api-1-zwpj.onrender.com/api/v1/";

import axios from "axios";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});
