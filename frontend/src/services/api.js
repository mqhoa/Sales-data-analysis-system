import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 1. Lỗi kết nối (Network Error / Server không phản hồi)
    if (!error.response) {
      console.error('[Network Error] Kiểm tra kết nối mạng hoặc trạng thái Server:', error.message);
      
      // Hướng dẫn dev khắc phục lỗi nếu chưa bật Backend (Chỉ hiển thị khi dev nội bộ)
      if (error.message.includes('ECONNREFUSED')) {
        console.warn(`[Fix] Backend chưa chạy. Vui lòng chạy lệnh: cd backend && npm run dev (Cấu hình hiện tại: ${error.config?.baseURL})`);
      }
    } 
    // 2. Lỗi phản hồi từ Server (API trả về status code 4xx, 5xx)
    else {
      const status = error.response.status;
      const url = error.config?.url;
      const method = error.config?.method?.toUpperCase();

      console.error(`[API Error] ${status} | ${method} ${url}`, error.response.data);
      
      // Xử lý khi Token hết hạn hoặc không hợp lệ (401 Unauthorized)
      if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Điều hướng về trang chủ/login sau 1 giây để trải nghiệm người dùng mượt mà hơn
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;