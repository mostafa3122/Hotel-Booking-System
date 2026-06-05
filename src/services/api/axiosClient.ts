import axios from "axios";

const axiosClient = axios.create({
  baseURL: "API_URL",
});

export default axiosClient;
