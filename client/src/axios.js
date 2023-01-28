import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/",
  withCredentials: true,
});

axiosInstance.interceptors.request.use(async (req) => {
  if (!document.cookie) {
    if (JSON.parse(localStorage.getItem("user")).accessToken) {
      document.cookie = `accessToken = ${
        JSON.parse(localStorage.getItem("user")).accessToken
      }`;
    } else {
      localStorage.removeItem("user");
    }
  }
  return req;
});
