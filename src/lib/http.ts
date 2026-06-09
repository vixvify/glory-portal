import axios, { AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse } from "axios";
import { ApiResponse } from "@/infra/interface/response";

const http: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 40000,
});

interface StandardResponse<T> {
  data: T;
  status: number;
  statusCode?: string;
  error?: string;
  message?: string;
}

const handleRequest = async <T>(
  requestFn: () => Promise<AxiosResponse<StandardResponse<T>>>
): Promise<ApiResponse<T>> => {
  try {
    const response = await requestFn();
    return {
      data: response.data.data,
      status: response.data.status,
      statusCode: response.data?.statusCode || "SUCCESS",
    };
  } catch (error) {
    const axiosError = error as AxiosError<StandardResponse<T>>;
    const errorData = axiosError.response?.data;

    throw new Error(
      errorData?.error ||
        errorData?.message ||
        axiosError.message ||
        "An unexpected error occurred",
    );
  }
};

export const httpClient = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    handleRequest<T>(() => http.get(url, config)),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    handleRequest<T>(() => http.post(url, data, config)),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    handleRequest<T>(() => http.put(url, data, config)),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    handleRequest<T>(() => http.delete(url, config)),
};

export default httpClient;
