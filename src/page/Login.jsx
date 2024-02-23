import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alerta from "../components/Alerta";
import Spinner from "../components/Spinner";
import clienteAxios from "../config/clienteAxios";
import useAuth from "../hooks/useAuth";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [alerta, setAlerta] = useState({});
    const [cargando, setCargando] = useState(false);
    const { auth, setAuth, validando } = useAuth();
    const navigate = useNavigate();

    // console.log(validando);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if ([email, password].includes("")) {
            return setAlerta({
                msg: "Todos los campos son obligatorios",
                error: true,
            });
        }
        setAlerta({});
        try {
            setCargando(true);
            const { data } = await clienteAxios.post(`/usuarios/login`, {
                email,
                password,
            });
            setEmail("");
            setPassword("");
            localStorage.setItem("token", data.token);
            setAuth(data);
            setTimeout(() => {
                setCargando(false);
                navigate("/ventas");
            }, 500);
        } catch (error) {
            console.log(error);
            setTimeout(() => {
                setCargando(false);
                setAlerta({ msg: error.response.data.msg, error: true });
            }, 500);
        }
    };
    const { msg } = alerta;
    return (
        <div className="flex justify-center items-center max-md:flex-col">
            <h1 className="w-6/12 max-md:w-11/12 text-emerald-600 font-black text-6xl max-sm:text-4xl  text-center capitalize">
                Iniciar Sesión{" "}
                <span className="text-emerald-600 text-center"></span>
            </h1>
            <div className="w-6/12 max-md:w-11/12 m-5">
                <form
                    onSubmit={handleSubmit}
                    className="w-full my-10 bg-white shadow rounded-lg px-10 py-4"
                >
                    <div className="my-5">
                        <label
                            htmlFor="email"
                            className="uppercase text-gray-600 block text-xl font-bold"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            placeholder="Email de Registro"
                            className="w-full mt-3 p-3 border rounded-lg bg-gray-50"
                            onChange={(e) => {
                                setEmail(e.target.value.toLocaleLowerCase());
                            }}
                        />
                    </div>
                    <div className="my-5">
                        <label
                            htmlFor="password"
                            className="uppercase text-gray-600 block text-xl font-bold"
                        >
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            placeholder="Contraseña"
                            className="w-full mt-3 p-3 border rounded-lg bg-gray-50"
                            onChange={(e) => {
                                setPassword(e.target.value.toLocaleLowerCase());
                            }}
                        />
                    </div>
                    <input
                        type="submit"
                        value="Iniciar Sesión"
                        className="bg-emerald-700 w-full py-3 text-white font-bold rounded uppercase mb-5 hover:cursor-pointer hover:bg-emerald-900 transition-colors"
                    />
                    {msg && <Alerta alerta={alerta} />}
                    {cargando && <Spinner />}
                </form>
                <nav className="lg:flex lg:justify-center">
                    <Link
                        to="/olvide-password"
                        className="block text-center my-1 text-slate-500 hover:text-sky-700 uppercase text-sm"
                    >
                        Olvide mi Contraseña
                    </Link>
                </nav>
            </div>
        </div>
    );
};

export default Login;
