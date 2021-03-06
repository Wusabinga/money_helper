import axios, { AxiosInstance } from 'axios';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const instance: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json'
    // Authorization: cookies.get('loginState'),
  },
  // mode: 'cors',
  params: { id: cookies.get('id') }
});

instance.interceptors.request.use((config) => {
  config.headers.authorization = cookies.get('loginState');
  config.params = { ...config.params, id: cookies.get('id') };
  return config;
});

export default instance;
