import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

// Attach JWT token to every request
API.interceptors.request.use(config => {
  const token = localStorage.getItem('studyhub_token');
  if (token && token !== 'demo-token') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    return data; // { token, user: { id, name, email, role } }
  },
  register: async (name, email, password) => {
    const { data } = await API.post('/auth/register', { name, email, password });
    return data;
  },
  getProfile: async () => {
    const { data } = await API.get('/auth/profile');
    return data;
  },
};

export const notesService = {
  upload: async (file) => {
    const form = new FormData();
    form.append('file', file);
    const { data } = await API.post('/notes/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },
  getAll: async () => {
    const { data } = await API.get('/notes');
    return data;
  },
  delete: async (id) => {
    await API.delete(`/notes/${id}`);
  },
};

export const progressService = {
  get: async () => {
    const { data } = await API.get('/progress');
    return data;
  },
  update: async (subject, score) => {
    const { data } = await API.post('/progress', { subject, score });
    return data;
  },
};

export const chatService = {
  getHistory: async () => {
    const { data } = await API.get('/chat/history');
    return data;
  },
  save: async (message, role) => {
    await API.post('/chat/save', { message, role });
  },
};

export default API;
