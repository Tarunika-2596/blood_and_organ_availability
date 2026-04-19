import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || '/api' });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);

export const searchBlood = (params) => API.get('/blood/search', { params });
export const getMyBloodStock = () => API.get('/blood/my-stock');
export const updateBlood = (data) => API.put('/blood/update', data);

export const searchOrgans = (params) => API.get('/organs/search', { params });
export const getMyOrgans = () => API.get('/organs/my-organs');
export const updateOrgan = (data) => API.put('/organs/update', data);

export const getHospitals = () => API.get('/hospitals');
export const getMyHospital = () => API.get('/hospitals/my-hospital');
export const updateMyHospital = (data) => API.put('/hospitals/my-hospital', data);
export const approveHospital = (id) => API.put(`/hospitals/${id}/approve`);
export const disableHospital = (id) => API.put(`/hospitals/${id}/disable`);

export const getAdminHospitals = () => API.get('/admin/hospitals');
export const getAdminLogs = () => API.get('/admin/logs');

export const createRequest = (data) => API.post('/requests/create', data);
export const getMyRequests = () => API.get('/requests/my-requests');
export const getHospitalRequests = () => API.get('/requests/hospital-requests');
