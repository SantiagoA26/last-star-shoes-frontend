
import axios, { AxiosInstance } from "axios";
import { Platform } from "react-native";

const baseURL: string = Platform.OS === "web"
  ? "http://localhost:5039/api"
  : "http://192.168.1.12:5039/api";


const api: AxiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;