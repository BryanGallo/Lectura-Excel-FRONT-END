import { useState, useEffect, createContext } from "react";
import clienteAxios from "../config/clienteAxios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [validando, setValidando] = useState(true);

    useEffect(() => {
        const autenticarUsuario = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setValidando(false);
                return;
            }

            //* para ventanas privadas requeremos la autorizacion y el bearer token
            //* asi que enviamos la configuracion de autorizacion
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };

            try {
                const { data } = await clienteAxios("/usuarios/perfil", config);
                setAuth(data.usuario);
                // navigate('/capacitaciones')
            } catch (error) {
                setAuth({});
                console.log(error.response.data.msg);
            } finally {
                setValidando(false);
            }
        };
        autenticarUsuario();
    }, []);

    const cerrarSesionAuth = async () => {
        setAuth({});
    };
    return (
        <>
            <AuthContext.Provider
                value={{ auth, setAuth, validando, cerrarSesionAuth }}
            >
                {children}
            </AuthContext.Provider>
        </>
    );
};

export { AuthProvider };
export default AuthContext;
