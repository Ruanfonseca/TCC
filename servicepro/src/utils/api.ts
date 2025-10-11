import axios, { AxiosError, AxiosRequestConfig } from "axios";
import authService from "@/services/authService";

const API_BASE_URL = "http://localhost:8080/api";

// Configurar instância do axios
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token em todas as requisições
axiosInstance.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      authService.logout();
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// API wrapper para facilitar uso
export const api = {
  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.get<T>(endpoint, config);
    return response.data;
  },

  async post<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig,
    fullResponse = false
  ): Promise<any> {
    const response = await axiosInstance.post<T>(endpoint, data, config);
    return fullResponse ? response : response.data;
  },
  async put<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await axiosInstance.put<T>(endpoint, data, config);
    return response.data;
  },

  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.delete<T>(endpoint, config);
    return response.data;
  },

  async patch<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await axiosInstance.patch<T>(endpoint, data, config);
    return response.data;
  },
};
