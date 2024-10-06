import axios from "axios";

export const BASE_URL = 'http://localhost:8081/';
// Create an axios instance with your custom configuration
const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Điều này sẽ gửi cookie với mỗi request
  
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để xử lý lỗi 401 (Unauthorized)
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Xóa thông tin đăng nhập và chuyển hướng đến trang đăng nhập
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Create an API object to handle HTTP methods
const api = {
  get: (url, config = {}) => instance.get(url, config),
  post: (url, data, config = {}) => instance.post(url, data, config),
  put: (url, data, config = {}) => instance.put(url, data, config),
  delete: (url, config = {}) => instance.delete(url, config),
  postForm: (url, data, config = {}) => instance.post(url, data, {
    ...config,
    headers: {
      ...config.headers,
      'Content-Type': 'multipart/form-data',
    },
  }),
};

export default api;