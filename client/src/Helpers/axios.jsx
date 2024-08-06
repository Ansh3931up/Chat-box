import axios from "axios";

const BASEURL="http://localhost:3117/api/v1";

const axiosInstance=axios.create();

axiosInstance.defaults.baseURL=BASEURL;
axiosInstance.defaults.withCredentials=true;

export default axiosInstance;
