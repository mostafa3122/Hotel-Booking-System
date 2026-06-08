import axiosClient from "../axiosClient";

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ApiResponse {
  message?: string;
  token?: string;
  data?: {
    token?: string;
  };
}

export interface ChangePasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const loginUser = async (data: LoginFormData): Promise<ApiResponse> => {
  const response = await axiosClient.post<ApiResponse>("portal/users/login", data);
  return response.data;
};

export const changePassword = async (data: ChangePasswordFormData): Promise<ApiResponse> => {
  const response = await axiosClient.post<ApiResponse>("portal/users/change-password", data);
  return response.data;
};
