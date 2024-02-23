import { useEffect } from "react";
import Local from "../components/Local";
import clienteAxios from "../config/clienteAxios.jsx";
import useVentas from "../hooks/useVentas";
import useLocal from "../hooks/useLocal";
import ModalFormularioLocal from "../components/ModalFormularioLocal";

const Locales = () => {
    const { locales, setLocales } = useVentas();
    const { handleModalLocal } = useLocal();
    useEffect(() => {
        const locales = async () => {
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
        locales();
    }, []);

    return (
        <div className="block md:w-3/5 mx-auto sm:3/4 sm:w-full">
            <h2 className="text-emerald-600 font-black text-4xl max-sm:text-4xl text-center capitalize my-3">
                Locales
            </h2>
            <ModalFormularioLocal />
            <button
                className="flex w-full justify-center text-emerald-500 bg-white rounded-md transition-all duration-300 ease-in-out hover:bg-emerald-900 p-4 mb-3 "
                onClick={handleModalLocal}
                // to={`/capacitaciones/editar/${params.id}`}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                    />
                </svg>
                <span className="uppercase font-bold text-emerald-500">
                    Nuevo Local
                </span>
            </button>
            <div className="w-90 max-h-96 mx-auto mt-0 overflow-scroll">
                <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-200 text-lg sticky top-0 z-10 ">
                        <tr>
                            <th className="py-3 px-4 font-semibold text-gray-700">
                                LOCAL
                            </th>
                            <th className="py-3 px-4 font-semibold text-gray-700">
                                RUC
                            </th>
                            <th className="py-3 px-4 font-semibold text-gray-700">
                                CENTRO COMERCIAL
                            </th>
                            <th className="py-3 px-4 font-semibold text-gray-700"></th>
                            <th className="py-3 px-4 font-semibold text-gray-700"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {locales.length === 0 ? (
                            <tr>
                                <th className="text-center text-gray-600 uppercase font-bold">
                                    No existen locales
                                </th>
                            </tr>
                        ) : (
                            locales.map((local) => (
                                <Local key={local.id} local={local} />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Locales;
