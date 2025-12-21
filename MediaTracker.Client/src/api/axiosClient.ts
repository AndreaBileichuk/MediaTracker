import axios from "axios";

const axiosClient = axios.create({
    baseURL: "https://localhost:7283",
    headers: {
        "Content-Type": "application/json",
    }
})

export default axiosClient;