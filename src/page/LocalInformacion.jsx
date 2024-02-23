import { useState, useEffect } from "react";
import useVentas from "../hooks/useVentas";
import { useParams } from "react-router-dom";
import DetalleRegistros from "../components/DetalleRegistros";
// import { meses } from "../helpers/meses.js";
import { anios } from "../helpers/anios.js";
import Alerta from "../components/Alerta";
import clienteAxios from "../config/clienteAxios.jsx";

const LocalInformacion = () => {
    const { id } = useParams();
    const [mes, setMes] = useState("");
    const [anio, setAnio] = useState("");
    const [alerta, setAlerta] = useState({});

    const { obtenerLocal, local, obtenerRegistros, registros, validando } =
        useVentas();
    console.log(local);
    useEffect(() => {
        obtenerLocal(id);
        obtenerRegistros(id);
    }, []);
    const {
        nombre,
        ruc,
        descripcion,
        metrosCuadrados,
        comision,
        valorMetros2,
        centrocomercial,
    } = local;
    console.log(registros);
    console.log(centrocomercial);
    const nombreCentroComercial = centrocomercial ? centrocomercial.nombre : "";

    console.log(nombreCentroComercial);

    const handleDescargarExcel = async (e) => {
        // if (mes === "") {
        //     return setAlerta({
        //         msg: "Selecciona el mes que corresponde al reporte",
        //         error: true,
        //     });
        // }
        if (anio === "") {
            return setAlerta({
                msg: "Selecciona el año que corresponde al reporte",
                error: true,
            });
        }

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
                "/registros/excel",
                { id, anio },
                {
                    responseType: "blob",
                    ...config, // Incluir el objeto de configuración
                }
            );

            console.log(data);

            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "archivo.xlsx");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error al descargar el archivo:", error);
        }
    };

    const { msg } = alerta;
    return validando ? (
        <p className="text-white">Cargando...</p>
    ) : (
        <>
            <div className="max-w-2xl mx-auto bg-white p-8 mt-4 border rounded-md shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-center">
                    Detalles del Local (Actualizado)
                </h2>
                <div>
                    <p className="text-gray-500 text-md">
                        {" "}
                        <span className="font-bold">RUC:</span> {ruc}
                    </p>
                    <p className="text-gray-500 text-md">
                        {" "}
                        <span className="font-bold">Nombre:</span> {nombre}
                    </p>
                    <p className="text-gray-500 text-md">
                        {" "}
                        <span className="font-bold">
                            Centro Comercial:
                        </span>{" "}
                        {nombreCentroComercial}
                    </p>
                    <p className="text-gray-500 text-md">
                        <span className="font-bold">
                            Descripción: {descripcion || "N/A"}
                        </span>
                    </p>
                    <p className="text-gray-500 text-md">
                        <span className="font-bold">Metros Cuadrados:</span>{" "}
                        {metrosCuadrados}
                    </p>
                    <p className="text-gray-500 text-md">
                        <span className="font-bold">Valor por C/M2:</span> ${" "}
                        {valorMetros2}
                    </p>
                    <p className="text-gray-500 text-md">
                        <span className="font-bold">Comisión:</span>{" "}
                        {parseFloat(comision)} %
                    </p>
                </div>
            </div>
            <div className="max-w-xl flex justify-around mx-auto bg-white p-2 mt-2 border rounded-md shadow-md">
                {/* <div className="flex items-center my-5">
                    <label
                        htmlFor="mes"
                        className="uppercase text-gray-600 block text-md font-bold mr-2"
                    >
                        Mes
                    </label>
                    <select
                        className={`${
                            mes === "" ? "text-gray-400" : ""
                        } w-full mt-3 p-3 border rounded-lg bg-gray-50 capitalize`}
                        name="mes"
                        value={mes}
                        onChange={(e) => {
                            console.log(e.target.value);
                            setMes(e.target.value);
                        }}
                    >
                        <option value="" className="text-gray-500">
                            Mes del Reporte
                        </option>
                        {meses.map((mes) => (
                            <option key={mes.id} value={`${mes.id}`}>
                                {mes.nombre}
                            </option>
                        ))}
                    </select>
                </div> */}
                <div id="anio" className="flex items-center my-5">
                    <label
                        htmlFor="anio"
                        className="uppercase text-gray-600 block text-md font-bold mr-2 mt-3 p-3"
                    >
                        AÑO
                    </label>
                    <select
                        className={`${
                            anio === "" ? "text-gray-400" : ""
                        } w-full mt-3 p-3 border rounded-lg bg-gray-50 capitalize`}
                        name="anio"
                        value={anio}
                        onChange={(e) => {
                            console.log(e.target.value);
                            setAnio(e.target.value);
                        }}
                    >
                        <option value="" className="text-gray-500">
                            Año del Reporte
                        </option>
                        {anios.map((anio) => (
                            <option key={anio.id} value={`${anio.id}`}>
                                {anio.año}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center my-5">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center"
                        onClick={() => {
                            handleDescargarExcel(id, mes, anio);
                        }}
                    >
                        Descargar Reporte
                    </button>
                </div>
            </div>
            {msg && <Alerta alerta={alerta} />}

            <div className="max-w-80 mx-auto bg-white p-8 mt-4 border rounded-md shadow-md">
                <div>
                    {registros.length > 0 ? (
                        registros.map((registro) => (
                            <div className="mb-3" key={registro.anio}>
                                <p className="text-xl font-bold">
                                    * {registro.anio}
                                </p>
                                <details className="p-3">
                                    <summary>Valores</summary>
                                    <div className="w-90 max-h-96 mx-auto mt-1 overflow-scroll">
                                        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                                            <thead className="bg-gray-200 text-md sticky top-0 z-10 ">
                                                <tr>
                                                    <th className="py-3 px-4 font-semibold text-gray-700">
                                                        MES
                                                    </th>
                                                    <th className="py-3 px-4 font-semibold text-gray-700">
                                                        VENTAS
                                                    </th>
                                                    <th className="py-3 px-4 font-semibold text-gray-700">
                                                        VMC MINIMO
                                                    </th>
                                                    <th className="py-3 px-4 font-semibold text-gray-700">
                                                        COMISION
                                                    </th>
                                                    <th className="py-3 px-4 font-semibold text-gray-700">
                                                        SOBREVENTAS
                                                    </th>
                                                    <th className="py-3 px-4 font-semibold text-gray-700">
                                                        DIFERENCIA A FACTURAR
                                                    </th>
                                                    <th className="py-3 px-4 font-semibold text-gray-700">
                                                        VALOR M2
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {registros.length === 0 ? (
                                                    <tr>
                                                        <th className="text-center text-gray-600 uppercase font-bold">
                                                            No existen Registros
                                                        </th>
                                                    </tr>
                                                ) : (
                                                    registro.registros.map(
                                                        (regi) => {
                                                            return (
                                                                <DetalleRegistros
                                                                    key={
                                                                        regi.id
                                                                    }
                                                                    registro={
                                                                        regi
                                                                    }
                                                                />
                                                            );
                                                        }
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </details>
                            </div>
                        ))
                    ) : (
                        <p>No existe Informacion del local</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default LocalInformacion;
