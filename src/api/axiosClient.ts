import axios from 'axios';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor để thêm token xác thực vào mỗi request
axiosClient.interceptors.request.use(async (config) => {
    // Giả sử bạn lưu token trong localStorage sau khi đăng nhập
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor để xử lý response trả về
axiosClient.interceptors.response.use(
    (response) => {
        // API của bạn có vẻ như luôn trả về dữ liệu trong thuộc tính "value"
        if (response && response.data && typeof response.data === 'object' && 'value' in response.data) {
            return response.data.value;
        }
        return response.data;
    },
    (error) => {
        // Xử lý lỗi tập trung (nếu cần)
        return Promise.reject(error);
    }
);

export default axiosClient;