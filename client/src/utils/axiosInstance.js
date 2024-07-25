import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: process.env.API_URL || "https://webnovelapi-y5hewbdc4a-nw.a.run.app",
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Get the auth token from local storage or any other storage mechanism
        const access = JSON.parse(localStorage.getItem("access"));

        // If the token exists, add it to the headers
        if (access) {
            config.headers["Authorization"] = `Bearer ${access.token}`;
        }

        return config;
    },
    (error) => {
        // Handle the error
        return Promise.reject(error);
    }
);

export default axiosInstance;
