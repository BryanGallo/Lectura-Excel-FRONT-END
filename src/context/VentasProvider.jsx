import { useState, useEffect, createContext } from "react";
import clienteAxios from "../config/clienteAxios.jsx";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const VentasContext = createContext();

const VentasProvider = ({ children }) => {
    const [locales, setLocales] = useState([]);
    const [local, setLocal] = useState({});
    const [registros, setRegistros] = useState({});
    const [validando, setValidando] = useState(false);

    const navigate = useNavigate();

    const obtenerLocal = async (id) => {
        setValidando(true);
        console.log(validando);
        console.log(id);
        try {
            // const token = localStorage.getItem("token");
            // if (!token) {
            //     return;
            // }
            // const config = {
            //     headers: {
            //         "Content-Type": "application/json",
            //         Authorization: `Bearer ${token}`,
            //     },
            // };
            const { data } = await clienteAxios(`/locales/local/${id}`);
            console.log(data);
            setLocal(data);
            console.log(validando);
        } catch (error) {
            console.log(error);
        } finally {
            console.log(validando);
            setValidando(false);
        }
    };

    const registrarValores = async (valores) => {
        console.log(valores);
        const { local, mes, anio, total, totalSinImpuestos } = valores;
        const mesNumero = parseInt(mes);
        const anioNumero = parseInt(anio);
        let resultado;
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return;
            }
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await clienteAxios.post(
                "/registros/calculos",
                {
                    local,
                    mesNumero,
                    anioNumero,
                    total,
                    totalSinImpuestos,
                },
                config
            );
            console.log(data);
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: `${data.msg}`,
                showConfirmButton: false,
                timer: 2000,
            });
            resultado = "ok";
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: "error",
                title: `${error.response.data.message}`,
            });
        }
        return resultado;
    };

    const obtenerRegistros = async (id) => {
        console.log(id);
        try {
            // const token = localStorage.getItem("token");
            // if (!token) {
            //     return;
            // }
            // const config = {
            //     headers: {
            //         "Content-Type": "application/json",
            //         Authorization: `Bearer ${token}`,
            //     },
            // };
            const { data } = await clienteAxios(`/registros/${id}`);
            console.log(data);
            setRegistros(data);
        } catch (error) {
            console.log(error.response);
        }
    };

    const cerrarSesionVentas = async () => {
        setLocales([]);
        setLocal({});
        setRegistros({});
    };

    return (
        <VentasContext.Provider
            value={{
                locales,
                setLocales,
                obtenerLocal,
                validando,
                local,
                obtenerRegistros,
                registros,
                registrarValores,
                cerrarSesionVentas,
            }}
        >
            {children}
        </VentasContext.Provider>
    );
};
export { VentasProvider };
export default VentasContext;
