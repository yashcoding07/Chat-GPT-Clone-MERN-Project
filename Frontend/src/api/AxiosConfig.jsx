import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://chat-gpt-clone-mern-project.onrender.com/api",
});

export default axiosInstance;
