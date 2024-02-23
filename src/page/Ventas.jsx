import { useState, useEffect } from "react";
import Alerta from "../components/Alerta";
import { meses } from "../helpers/meses.js";
import { anios } from "../helpers/anios.js";
import useVentas from "../hooks/useVentas.jsx";
import * as XLSX from "xlsx";
import Papa from "papaparse";

const Ventas = () => {
    const [local, setLocal] = useState("");
    const [ruc, setRuc] = useState("");
    const [mes, setMes] = useState("");
    const [anio, setAnio] = useState("");
    const [archivo, setArchivo] = useState('');
    const [alerta, setAlerta] = useState({});
    const [total, setTotal] = useState(null);
    const [totalSinImpuestos, setTotalSinImpuestos] = useState(null);

    const { locales, setLocales, registrarValores } = useVentas();

    const handleUpload = (event) => {
        setArchivo(event.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAlerta({});
        if (local === "") {
            return setAlerta({
                msg: "Debe Escoger un local",
                error: true,
            });
        }
        if (mes === "") {
            return setAlerta({
                msg: "Selecciona el mes que corresponde al reporte",
                error: true,
            });
        }
        if (anio === "") {
            return setAlerta({
                msg: "Selecciona el año que corresponde al reporte",
                error: true,
            });
        }

        if (!archivo) {
            return setAlerta({
                msg: "Por favor, carga un archivo",
                error: true,
            });
        }
        // Aquí puedes realizar la lógica para leer el archivo
        if (archivo.name.endsWith(".xls") || archivo.name.endsWith(".xlsx")) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const content = e.target.result;
                const workbook = XLSX.read(content, { type: "binary" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const data = XLSX.utils.sheet_to_json(worksheet);
                console.log("Datos leídos desde Excel:", data);

                // Verificar la estructura esperada
                if (
                    data[0] &&
                    "Store" in data[0] &&
                    "RUC" in data[0] &&
                    "Total" in data[0] &&
                    "Mall"
                ) {
                    setAlerta({});
                } else {
                    return setAlerta({
                        msg: "La estructura del archivo no es la esperada.",
                        error: true,
                    });
                }

                // Aquí puedes realizar la lógica para procesar los datos
                if (data[0].RUC !== ruc) {
                    return setAlerta({
                        msg: "El archivo no pertence al local Seleccionado",
                        error: true,
                    });
                }
                // if (data[0]['Fecha de Inicio'] ===0) {
                // }
                let total = data[0].Total;
                let totalRedondeado = parseFloat(total.toFixed(2));
                let totalSinImpuestos = data[0]["Total sin Impuestos"];
                let totalSinImpuestosRedondeado = parseFloat(
                    totalSinImpuestos.toFixed(2)
                );
                setTotal(totalRedondeado);
                setTotalSinImpuestos(totalSinImpuestosRedondeado);
                // Aquí puedes realizar la lógica para procesar los datos
                const respuesta = await registrarValores({
                    local,
                    mes,
                    anio,
                    total,
                    totalSinImpuestos,
                    ruc,
                });
                if (respuesta === "ok") {
                    setLocal("");
                    setMes("");
                    setAnio("");
                    setArchivo(null);
                    setTotal(null);
                    setTotalSinImpuestos(null);
                }
            };
            reader.readAsBinaryString(archivo);
        } else if (archivo.name.endsWith(".csv")) {
            Papa.parse(archivo, {
                header: true,
                complete: (result) => {
                    const data = result.data;
                    if (
                        data[0] &&
                        "Store" in data[0] &&
                        "RUC" in data[0] &&
                        "Total" in data[0] &&
                        "Mall"
                    ) {
                        setAlerta({});
                    } else {
                        setAlerta({
                            msg: "La estructura del archivo no es la esperada.",
                            error: true,
                        });
                        return;
                    }
                },
            });
        }
        // Aquí puedes realizar la lógica para procesar los datos
    };

    const { msg } = alerta;
    return (
        <div className="block md:w-3/5 mx-auto sm:3/4 sm:w-full">
            <h2 className="text-emerald-600 font-black text-4xl max-sm:text-3xl text-center capitalize my-3">
                Carga tu archivo Excel
            </h2>
            <form
                className="bg-white shadow-md rounded-lg py-5 px-5 mt-5 "
                onSubmit={handleSubmit}
            >
                <div id="local" className="my-5">
                    <label
                        htmlFor="local"
                        className="uppercase text-gray-600 block text-md font-bold"
                    >
                        Escoge el local
                    </label>
                    <select
                        className={`${
                            local === "" ? "text-gray-400" : ""
                        } w-full mt-3 p-3 border rounded-lg bg-gray-50 capitalize `}
                        name={ruc}
                        value={local}
                        onChange={(e) => {
                            setLocal(e.target.value);
                            setRuc(
                                e.target.options[
                                    e.target.selectedIndex
                                ].getAttribute("name")
                            );
                        }}
                    >
                        <option value="" className="text-gray-500">
                            Escoge el local
                        </option>
                        {locales.map((local) => (
                            <option
                                key={local.id}
                                value={`${local.id}`}
                                name={`${local.ruc}`}
                            >
                                {local.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div id="mes" className="my-5">
                    <label
                        htmlFor="mes"
                        className="uppercase text-gray-600 block text-md font-bold"
                    >
                        Mes
                    </label>
                    <select
                        className={`${
                            mes === "" ? "text-gray-400" : ""
                        } w-full mt-3 p-3 border rounded-lg bg-gray-50 capitalize `}
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
                </div>
                <div id="anio" className="my-5">
                    <label
                        htmlFor="anio"
                        className="uppercase text-gray-600 block text-md font-bold"
                    >
                        AÑO
                    </label>
                    <select
                        className={`${
                            anio === "" ? "text-gray-400" : ""
                        } w-full mt-3 p-3 border rounded-lg bg-gray-50 capitalize `}
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
                <div className="mb-4">
                    <label class="block text-center">
                        <input
                            type="file"
                            accept=".xls,.xlsx, .csv"
                            onChange={handleUpload}
                            name="excel"
                            className="text-md text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-md file:font-semibold
                                file:bg-violet-50 file:text-sky-700
                                hover:file:bg-violet-100 file:hover:cursor-pointer text-center"
                        />
                    </label>
                </div>
                {msg && <Alerta alerta={alerta} />}
                {/* {cargando && <Spinner />} */}
                <input
                    type="submit"
                    className="bg-emerald-700 w-full py-3 text-white font-bold rounded uppercase mb-3 mt-3 text-sm hover:cursor-pointer hover:bg-emerald-900 transition-colors"
                    value="Cargar Información"
                />
            </form>
        </div>
    );
};

export default Ventas;
