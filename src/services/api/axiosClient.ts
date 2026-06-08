import axios from "axios";
import { toast } from "react-toastify";

const axiosClient = axios.create({
  baseURL: "https://upskilling-egypt.com:3000/api/v0/",
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error?.response?.status === 401 && localStorage.getItem("token")) {
      toast.error(
        error?.response?.data?.message || "Session expired. Please login again."
      );
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
