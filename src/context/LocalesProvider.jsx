import { useState, createContext } from "react";
import clienteAxios from "../config/clienteAxios";
import Swal from "sweetalert2";
import useVentas from "../hooks/useVentas";

const LocalesContext = createContext();

const LocalesProvider = ({ children }) => {
    const [local, setLocal] = useState({});
    const [modal, setModal] = useState(false);

    const { setLocales } = useVentas();

    const submitLocal = async (local) => {
        if (local.id) {
            await editarLocal(local);
        } else {
            const submit = await nuevoLocal(local);
            return submit;
        }
    };

    const nuevoLocal = async (local) => {
        console.log(local);
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
                "locales/local/nuevo",
                local,
                config
            );
            console.log(data);
            await actualizarLocal();
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: `${data.msg}`,
                showConfirmButton: false,
                timer: 1500,
            });
            resultado = "ok";
            setTimeout(() => {
                setModal(false);
            }, 1500);
        } catch (error) {
            console.log(error);
            console.log(error.response.data.msg);
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: `${error.response.data.msg}`,
                showConfirmButton: false,
                timer: 1500,
            });
            resultado = "error";
        }
        return resultado;
    };

    const actualizarLocal = async () => {
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
            const { data } = await clienteAxios("/locales", config);
            console.log(data);
            setLocales(data);
        } catch (error) {
            console.log(error.response);
        }
    };

    const editarLocal = async (local) => {
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
            const { data } = await clienteAxios.put(
                "locales/local/editar",
                local,
                config
            );
            console.log(data);
            await actualizarLocal();
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: `${data.msg}`,
                showConfirmButton: false,
                timer: 1500,
            });
            setTimeout(() => {
                setModal(false);
            }, 1500);
        } catch (error) {
            console.log(error);
            console.log(error.response.data.msg);
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: `${error.response.data.msg}`,
                showConfirmButton: false,
                timer: 1500,
            });
        }
    };

    const handleModalLocal = () => {
        setLocal({});
        setModal(!modal);
    };
    const handleModalEditarLocal = (local) => {
        setLocal(local);
        setModal(!modal);
    };

    const cerrasSesionLocales = async () => {
        setLocal({});
    }

    return (
        <LocalesContext.Provider
            value={{
                submitLocal,
                modal,
                handleModalLocal,
                handleModalEditarLocal,
                local,
                cerrasSesionLocales
            }}
        >
            {children}
        </LocalesContext.Provider>
    );
};
export { LocalesProvider };

export default LocalesContext;
