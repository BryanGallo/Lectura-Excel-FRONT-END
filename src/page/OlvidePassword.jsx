import { useState } from "react";
import { Link } from "react-router-dom";
import Alerta from "../components/Alerta";
import Spinner from "../components/Spinner";
// import clienteAxios from "../config/clienteAxios";

const OlvidePassword = () => {
    const [email, setEmail] = useState("");
    const [alerta, setAlerta] = useState({});
    const [cargando, setCargando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if ([email].includes("")) {
            return setAlerta({ msg: "El correo es obligatorio", error: true });
        }
        setAlerta({});
        try {
            setCargando(true);
            const { data } = await clienteAxios.post(
                `/usuarios/olvide-password`,
                {
                    email,
                }
            );
            setEmail("");
            setTimeout(() => {
                setCargando(false);
                setAlerta({ msg: data.msg });
            }, 500);
        } catch (error) {
            setTimeout(() => {
                setCargando(false);
                setAlerta({ msg: error.response.data.msg, error: true });
            }, 500);
        }
    };

    const { msg } = alerta;

    return (
        <div className="flex justify-center items-center max-md:flex-col">
            <h1 className="w-6/12 max-md:w-11/12 text-emerald-600 font-black text-6xl max-sm:text-4xl text-center capitalize">
                Recupera tu acceso a{" "}
                <span className="text-emerald-600">Sobreventas</span>
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
                    <input
                        type="submit"
                        value="Enviar Instrucciones"
                        className="bg-emerald-700 w-full py-3 text-white font-bold rounded uppercase mb-5 hover:cursor-pointer hover:bg-emerald-900 transition-colors"
                    />
                    {msg && <Alerta alerta={alerta} />}
                    {cargando && <Spinner />}
                </form>
                <nav className="lg:flex lg:justify-center">
                    <Link
                        to="/"
                        className="block text-center my-5 text-slate-500 uppercase text-sm hover:text-sky-700"
                    >
                        Tienes una cuenta? Inicia Sesión
                    </Link>
                </nav>
            </div>
        </div>
    );
};

export default OlvidePassword;
