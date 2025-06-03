import axios from 'axios';

const decodeJWT = (jwt) => {
    try {
        const base64Url = jwt.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) =>
            `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`
        ).join(''));
        return JSON.parse(jsonPayload);
    } catch (err) {
        console.error(err);
        return {};
    }
};

const isExpired = (token) => {
    const decodedToken = decodeJWT(token);
    const expirationTime = decodedToken.exp * 1000;
    return Date.now() >= expirationTime;
};

async function logoutUser() {
    localStorage.removeItem('authToken');

    window.location.href = "/auth?tokenExpired=true";
}

const instance = axios.create({
    timeout: 5000,
});

let inactivityTimer;
const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        logoutUser ();
    }, 60000);
};

instance.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('authToken');
    if (!token || isExpired(token)) {
        await logoutUser();
        throw new Error("Ваш токен устарел");
    }

    config.headers.Authorization = `Bearer ${token}`;
    resetInactivityTimer();
    return config;
}, (error) => Promise.reject(error));

instance.interceptors.response.use(
    (response) => {
        resetInactivityTimer();
        return response;
    },
    async (error) => {
        if (error.response?.status === 401) {
            await logoutUser();
        }
        return Promise.reject(error);
    }
);

const addInactivityListeners = () => {
    window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('keydown', resetInactivityTimer);
    window.addEventListener('click', resetInactivityTimer);
    window.addEventListener('scroll', resetInactivityTimer);
};
const removeInactivityListeners = () => {
    window.removeEventListener('mousemove', resetInactivityTimer);
    window.removeEventListener('keydown', resetInactivityTimer);
    window.removeEventListener('click', resetInactivityTimer);
    window.removeEventListener('scroll', resetInactivityTimer);
};

addInactivityListeners();

window.addEventListener('beforeunload', removeInactivityListeners);

export default instance;