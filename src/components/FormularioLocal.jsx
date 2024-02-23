import { useEffect, useState } from "react";
import Alerta from "./Alerta";
import useLocal from "../hooks/useLocal";
import clienteAxios from "../config/clienteAxios";

const FormularioLocal = () => {
    const [id, setId] = useState("");
    const [nombre, setNombre] = useState("");
    const [ruc, setRuc] = useState();
    const [descripcion, setDescripcion] = useState("");
    const [metros, setMetros] = useState("");
    const [valorM2, setValorM2] = useState("");
    const [comision, setComision] = useState("");
    const [alerta, setAlerta] = useState({});
    const [ccomercial, setCcomercial] = useState("");
    const [ccomerciales, setCcomerciales] = useState([]);

    const { submitLocal, local } = useLocal();
    console.log(local);

    useEffect(() => {
        if (local.id) {
            setId(local.id);
            setNombre(local.nombre);
            setRuc(local.ruc);
            setDescripcion(local.descripcion);
            setMetros(local.metrosCuadrados);
            setValorM2(local.valorMetros2);
            setComision(local.comision);
            setCcomercial(local.id_Ccomercial);
            return;
        }
        setId("");
        setNombre("");
        setRuc("");
        setDescripcion("");
        setMetros("");
        setValorM2("");
        setComision("");
        setCcomercial("");
    }, [local]);
    useEffect(() => {
        const obtenerCcomerciales = async () => {
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
                const { data } = await clienteAxios("/ccomerciales", config);
                console.log(data.ccomerciales);
                const ccomerciales = data.ccomerciales.map((ccomercial) => (
                    <option
                        key={ccomercial.id}
                        value={ccomercial.id}
                        className="text-gray-800"
                    >
                        {ccomercial.nombre}
                    </option>
                ));
                setCcomerciales(ccomerciales);
            } catch (error) {
                console.log(error.response.data.msg);
            }
        };
        obtenerCcomerciales();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAlerta({});
        if ([nombre, ruc, ccomercial, valorM2, comision, metros].includes("")) {
            return setAlerta({
                msg: "Todos los campos excepto 'DESCRIPCIÓN' son obligatorios",
                error: true,
            });
        }
        // Expresión regular para validar solo números y el número 0
        const regex = /^[0-9\b]+$/;

        // Validar si el valor ingresado cumple con la validación
        if (!regex.test(ruc)) {
            return setAlerta({
                msg: "El ruc debe contener solo números",
                error: true,
            });
        }

        if (ruc.length < 13) {
            return setAlerta({
                msg: "El ruc debe tener 13 digitos",
                error: true,
            });
        }

        const regexDecimales = /^[0-9]+(?:\.[0-9]+)?$/;

        if (!regexDecimales.test(valorM2)) {
            return setAlerta({
                msg: "El vmcminimo debe contener solo números y su valor decimal separado por ' . '",
                error: true,
            });
        }
        let valorM2Float = parseFloat(valorM2);

        if (valorM2Float < 1) {
            return setAlerta({
                msg: "El valor mínimo debe ser mayor 0",
                error: true,
            });
        }

        if (!regexDecimales.test(comision)) {
            return setAlerta({
                msg: "La comisión debe contener solo números y su valor decimal separado por ' . '",
                error: true,
            });
        }
        let comisionFloat = parseFloat(comision);
        if (comisionFloat < 1) {
            return setAlerta({
                msg: "El valor mínimo debe ser mayor 0",
                error: true,
            });
        }

        if (!regexDecimales.test(metros)) {
            return setAlerta({
                msg: "Los metros debe contener solo números y su valor decimal separado por ' . '",
                error: true,
            });
        }
        let metrosFloat = parseFloat(metros);
        if (metrosFloat < 0) {
            return setAlerta({
                msg: "El valor mínimo debe ser mayor a 0",
                error: true,
            });
        }
        const resultado = await submitLocal({
            id,
            nombre,
            ruc,
            descripcion,
            metrosCuadrados: metrosFloat,
            valorMetros2: valorM2Float,
            comision: comisionFloat,
            id_Ccomercial: ccomercial,
        });

        // if (resultado === "ok") {

        // }
    };

    const { msg } = alerta;
    return (
        <div className="block w-full">
            <form
                onSubmit={handleSubmit}
                className="my-2 bg-white shadow rounded-lg px-5 py-3"
            >
                <div className="my-3">
                    <label className="uppercase bg text-gray-700 block text-xl font-black text-center">
                        {id ? "EDITAR LOCAL" : "CREAR LOCAL"}
                    </label>
                </div>
                <div className="my-3">
                    <label
                        htmlFor="nombre"
                        className="uppercase bg text-gray-600 block text-lg font-bold"
                    >
                        Nombre
                    </label>
                    <input
                        id="nombre"
                        type="text"
                        placeholder="Ej. NOE"
                        className="w-full mt-1 p-2 border rounded-lg bg-gray-50 "
                        value={nombre}
                        onChange={(e) => {
                            console.log(e.target.value.toUpperCase());
                            setNombre(e.target.value.toUpperCase());
                        }}
                    />
                </div>
                <div className="my-3">
                    <label
                        htmlFor="ruc"
                        className="uppercase bg text-gray-600 block text-lg font-bold"
                    >
                        RUC
                    </label>
                    <input
                        id="ruc"
                        type="text"
                        placeholder="Ej. 1718910221"
                        className="w-full mt-1 p-2 border rounded-lg bg-gray-50 "
                        maxLength="13"
                        value={ruc}
                        onChange={(e) => {
                            console.log(e.target.value.toUpperCase());
                            setRuc(e.target.value.toUpperCase());
                        }}
                    />
                </div>
                <div className="my-3">
                    <label
                        htmlFor="local2"
                        className="uppercase text-gray-600 block text-xl font-bold"
                    >
                        Escoge tu Centro Comercial
                    </label>
                    <select
                        className={`${
                            ccomercial === "" ? "text-gray-400" : ""
                        } w-full mt-3 p-3 border rounded-lg bg-gray-50 capitalize `}
                        name="departamento"
                        value={ccomercial}
                        onChange={(e) => {
                            console.log(e.target.value);
                            setCcomercial(e.target.value);
                        }}
                    >
                        <option value="" className="text-gray-500">
                            Escoge tu Centro Comercial
                        </option>
                        {ccomerciales}
                    </select>
                </div>
                <div className="my-3">
                    <label
                        htmlFor="descripcion"
                        className="uppercase bg text-gray-600 block text-lg font-bold"
                    >
                        DESCRIPCIÓN
                    </label>
                    <input
                        id="descripcion"
                        type="text"
                        placeholder="Ej. Planta Alta 1 local 130"
                        className="w-full mt-1 p-2 border rounded-lg bg-gray-50 "
                        value={descripcion}
                        onChange={(e) => {
                            console.log(e.target.value.toUpperCase());
                            setDescripcion(e.target.value.toUpperCase());
                        }}
                    />
                </div>
                <div className="my-3">
                    <label
                        htmlFor="metros"
                        className="uppercase bg text-gray-600 block text-lg font-bold"
                    >
                        METROS CUADRADOS
                    </label>
                    <input
                        id="metros"
                        type="text"
                        placeholder="Ej. 30m"
                        className="w-full mt-1 p-2 border rounded-lg bg-gray-50 "
                        value={metros}
                        onChange={(e) => {
                            console.log(e.target.value.toUpperCase());
                            setMetros(e.target.value.toUpperCase());
                        }}
                    />
                </div>
                <div className="my-3">
                    <label
                        htmlFor="valorM2"
                        className="uppercase bg text-gray-600 block text-lg font-bold"
                    >
                        VALOR POR C/M2
                    </label>
                    <input
                        id="valorM2"
                        type="text"
                        placeholder="Ej. $ 17.12"
                        className="w-full mt-1 p-2 border rounded-lg bg-gray-50 "
                        value={valorM2}
                        onChange={(e) => {
                            console.log(e.target.value.toUpperCase());
                            setValorM2(e.target.value.toUpperCase());
                        }}
                    />
                </div>
                <div className="my-3">
                    <label
                        htmlFor="comision"
                        className="uppercase bg text-gray-600 block text-lg font-bold"
                    >
                        COMISIÓN
                    </label>
                    <input
                        id="comision"
                        type="text"
                        placeholder="Ej. 8%"
                        className="w-full mt-1 p-2 border rounded-lg bg-gray-50 "
                        value={comision}
                        onChange={(e) => {
                            console.log(e.target.value.toUpperCase());
                            setComision(e.target.value.toUpperCase());
                        }}
                    />
                </div>
                {msg && <Alerta alerta={alerta} />}
                <input
                    type="submit"
                    value={id ? "Editar Local" : "Crear Local"}
                    className="bg-emerald-700 w-full py-2 text-white font-bold rounded uppercase mb-3 hover:cursor-pointer hover:bg-emerald-900 transition-colors"
                />
            </form>
        </div>
    );
};

export default FormularioLocal;
