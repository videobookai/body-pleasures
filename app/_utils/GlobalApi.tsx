import axios from 'axios';

const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api",
    timeout: 20000,
    
});


// Register interceptors only when running in the browser (avoid server-side localStorage)
if (typeof window !== 'undefined') {
    // Add request interceptor
    axiosClient.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('authToken');
            if (token) {
                // preserve existing headers and add Authorization
                config.headers = { ...(config.headers as any), Authorization: `Bearer ${token}` };
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Add response interceptor
    axiosClient.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                localStorage.removeItem('authToken');
            }
            return Promise.reject(error);
        }
    );
}

const getCategory = ()=> axiosClient.get('/categories');

const getSliders = ()=> axiosClient.get('/sliders?populate=*').then(resp =>{
return resp.data.data
}) ;

const getCategoryList = ()=> axiosClient.get('/categories?populate=*').then(resp=>{

    return resp.data.data
});

const getAllProducts = ()=> axiosClient.get('/products?populate=*').then(resp=>{

    return resp.data.data
});


export default {
    getCategory,
    getSliders, 
    getCategoryList,
    getAllProducts
};
