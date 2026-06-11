import axiosClient from "../axiosClient";
import { API_ENDPOINTS } from "../../../config/api";

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ApiResponse {
  message?: string;
  token?: string;
  data?: {
    token?: string;
    user?: {
      role?: string;
      [key: string]: any;
    };
  };
}

export interface ChangePasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const loginUser = async (data: LoginFormData): Promise<ApiResponse> => {
  const response = await axiosClient.post<ApiResponse>(API_ENDPOINTS.LOGIN, data);
  return response.data;
};

export const changePassword = async (data: ChangePasswordFormData): Promise<ApiResponse> => {
  const response = await axiosClient.post<ApiResponse>(API_ENDPOINTS.CHANGE_PASSWORD, data);
  return response.data;
};
