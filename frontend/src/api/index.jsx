import axios from 'axios';
import { toast } from 'react-toastify';

const checkAuthToken = () => {
    const token = localStorage.getItem('authToken');
    return !!token && !isExpired(token);
};

const isExpired = (token) => {
    const decodedToken = decodeJWT(token);
    const expirationTime = decodedToken.exp * 1000;
    return Date.now() >= expirationTime;
};

const decodeJWT = (jwt) => {
    try {
        const base64Url = jwt.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (err) {
        return {};
    }
};

const instance = axios.create({});

instance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('authToken');
        if (checkAuthToken()) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

instance.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401 || !checkAuthToken()) {
            localStorage.removeItem('authToken');
            toast.error('Срок действия вашего токена истек.', {
                position: "top-center",
                autoClose: 5000,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            window.location.href = "/auth";
        }
        return Promise.reject(error);
    }
);

export default instance;