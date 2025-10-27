import axios from "axios";
import { getToken } from "./storageService";

const BASE_URL =
    (process.env.EXPO_PUBLIC_API_BASE ||
        process.env.EXPO_PUBLIC_API_URL ||
        process.env.EXPO_PUBLIC_BACKEND_URL ||
        ""
    ).replace(/\/$/, "") || "https://loopus.nguyenhoangan.site";

export const api = axios.create({
    baseURL: BASE_URL,
    // headers: {
    //     Accept: "application/json",
    // },
    timeout: 60000,
});

api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }

    // If sending FormData, remove Content-Type so axios/RN can inject boundary
    const isFormData =
        typeof FormData !== "undefined" &&
        (config.data instanceof FormData ||
            (config.data && typeof config.data.append === "function"));

    // if (isFormData && config.headers) {
    //     delete config.headers["Content-Type"];
    //     delete config.headers["content-type"];
    // }

    return config;
});

api.interceptors.response.use(
    (res) => res,
    (error) => {
        const url = `${error.config?.baseURL || ""}${error.config?.url || ""}`;
        const headers = error.config?.headers;
        console.log("HTTP error:", {
            url,
            status: error.response?.status,
            data: error.response?.data,
            headers,
        });
        return Promise.reject(error);
    }
);

export default api;