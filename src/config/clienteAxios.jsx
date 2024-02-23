import axios from "axios";

const clienteAxios = axios.create({
    //base va a ser la ulr base
    baseURL: `${import.meta.env.VITE_BACKEND_URL}`,
});

export default clienteAxios;
