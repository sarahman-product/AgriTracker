import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://agritacker-sarahman.aws-ap-south-1.turso.io/api/v1';

const createApi = async (): Promise<AxiosInstance> => {
  const token = await AsyncStorage.getItem('auth_token');
  
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        await AsyncStorage.removeItem('auth_token');
        await AsyncStorage.removeItem('auth_user');
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const api = {
  get: async <T>(url: string, params?: any): Promise<T> => {
    const instance = await createApi();
    const response = await instance.get(url, { params });
    return response.data;
  },

  post: async <T>(url: string, data?: any): Promise<T> => {
    const instance = await createApi();
    const response = await instance.post(url, data);
    return response.data;
  },

  put: async <T>(url: string, data?: any): Promise<T> => {
    const instance = await createApi();
    const response = await instance.put(url, data);
    return response.data;
  },

  delete: async <T>(url: string): Promise<T> => {
    const instance = await createApi();
    const response = await instance.delete(url);
    return response.data;
  },
};

// API endpoints
export const authApi = {
  requestOtp: (mobile: string) => api.post('/auth/request-otp', { mobile }),
  verifyOtp: (mobile: string, otp: string) => api.post('/auth/verify-otp', { mobile, otp }),
  getProfile: () => api.get('/auth/me'),
};

export const programsApi = {
  getAssigned: () => api.get('/programs/assigned'),
  getConfig: (id: string) => api.get(`/programs/${id}/config`),
  getAll: () => api.get('/programs'),
};

export const farmersApi = {
  getAll: (programId?: string) => api.get('/farmers', { programId }),
  getById: (id: string) => api.get(`/farmers/${id}`),
  create: (data: any) => api.post('/farmers', data),
  search: (query: string) => api.get('/farmers/search', { query }),
};

export const farmsApi = {
  getByFarmer: (farmerId: string) => api.get('/farms', { farmerId }),
  create: (data: any) => api.post('/farms', data),
};

export const enrollmentsApi = {
  getByFarmer: (farmerId: string) => api.get('/crop-enrollments', { farmerId }),
  create: (data: any) => api.post('/crop-enrollments', data),
};

export const surveysApi = {
  getInstances: (status?: string) => api.get('/survey-instances', { status }),
  submitResponse: (data: any) => api.post('/survey-responses', data),
};

export const dashboardApi = {
  getAgent: () => api.get('/analytics/dashboard/agent'),
  getProgram: (programId: string) => api.get(`/analytics/dashboard/program/${programId}`),
};

export default api;