/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig, AxiosResponse, Method } from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface IApiSuccess<T> {
    data: T;
    error: undefined;
}

interface IApiError {
    data: undefined;
    error: string;
}

export type ApiResponse<T> = IApiSuccess<T> | IApiError;

export async function apiClient<T>(
    method: Method,
    url: string,
    data?: any,
    token?: string,
    config: AxiosRequestConfig = {}
): Promise<T> {
    const fullUrl = `${BASE_URL}${url}`;
    const requestConfig: AxiosRequestConfig = { ...config };

    if (token) {
        requestConfig.headers = {
            ...requestConfig.headers,
            Authorization: `Bearer ${token}`
        };
    }

    const isFormData = data instanceof FormData;
    if (!isFormData) {
        requestConfig.headers = {
            'Content-Type': 'application/json',
            ...requestConfig.headers,
        };
    }

    try {
        const response: AxiosResponse<T> = await axios.request<T>({
            method,
            url: fullUrl,
            data,
            ...requestConfig,
        });

        return response.data;

    } catch (err: any) {
        let errorMessage: string = "An unexpected error occurred.";

        if (axios.isAxiosError(err) && err.response) {
            const { detail, title } = err.response.data;
            
            // detail is usually the human-readable specific error
            errorMessage = detail || title || `Server Error: ${err.response.status}`;
            
        } else if (axios.isAxiosError(err)) {
            errorMessage = err.message || "Network Error: Could not reach server.";
        } else if (err instanceof Error) {
            errorMessage = err.message;
        }

        throw new Error(errorMessage);
    }
}