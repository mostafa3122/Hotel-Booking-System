import axiosClient from "../axiosClient";
import { API_ENDPOINTS } from "../../../config/api";

export interface DashboardData {
  rooms: number;
  facilities: number;
  ads: number;
  bookings: {
    pending: number;
    completed: number;
  };
  users: {
    user: number;
    admin: number;
  };
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}

export const getDashboardData = async (): Promise<DashboardResponse> => {
  const response = await axiosClient.get<DashboardResponse>(API_ENDPOINTS.DASHBOARD);
  return response.data;
};
