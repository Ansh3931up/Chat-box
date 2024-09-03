import axios from "axios";

const BASEURL="https://chat-box-8p3h.onrender.com/api/v1";

const axiosInstance=axios.create();

axiosInstance.defaults.baseURL=BASEURL;
axiosInstance.defaults.withCredentials=true;

export default axiosInstance;
