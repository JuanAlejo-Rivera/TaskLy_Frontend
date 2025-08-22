import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL

})

//se envia antes de la peticion
//se activa cuando se hace una peticion que requiera token
api.interceptors.request.use(config => {
    const token = localStorage.getItem('AUTH_TOKEN')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
})

export default api;