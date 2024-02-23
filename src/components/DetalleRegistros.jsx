import React from "react";

const DetalleRegistros = ({ registro }) => {
    console.log(registro);
    const obtenerNombreMes = (numeroMes, anio) => {
        // Crear una fecha con el número del mes (1-indexed)
        const fecha = new Date(anio, numeroMes - 1, 1);

        // Obtener el nombre del mes en formato completo
        const nombreMesCompleto = fecha.toLocaleString("es-ES", {
            month: "long",
        });
        // Obtener el nombre del mes en formato abreviado
        // const nombreMesAbreviado = fecha.toLocaleString("es-ES", {
        //     month: "short",
        // });
        return nombreMesCompleto.toLocaleUpperCase();
    };

    return (
        <>
            <tr className="text-center w-full">
                <td colspan="7" className="p-2 bg-slate-100 text-emerald-700">
                    " Valores usados a la fecha del registro {'->'}  Metros Cuadrados:{" "}
                    <span className="font-bold">
                        $ {parseFloat(registro.metrosCuadradosRegistro)}{" "}
                    </span>
                    Valor por C/M2:
                    <span className="font-bold">
                        {" "}
                        $ {parseFloat(registro.valorMetros2Registro)}{" "}
                    </span>
                    Comisión:
                    <span className="font-bold">
                        {" "}
                        {parseFloat(registro.comisionRegistro)} %{" "}
                    </span>
                    "
                </td>
            </tr>
            <tr className="text-center">
                {/* REVISAR NULOS DE  */}
                <td className="py-3 px-4 border-b">
                    {obtenerNombreMes(registro.mes, registro.anio)}
                </td>
                <td className="py-3 px-4 border-b">
                    $ {registro.totalSinImpuestos}
                </td>
                <td className="py-3 px-4 border-b">$ {registro.vmcMinimo}</td>
                <td className="py-3 px-4 border-b">
                    {parseFloat(registro.comisionRegistro)} %
                </td>
                <td className="py-3 px-4 border-b">$ {registro.sobreventas}</td>
                <td className="py-3 px-4 border-b">
                    $ {registro.diferenciaFacturar}
                </td>
                <td className="py-3 px-4 border-b">$ {registro.valorM2}</td>
            </tr>
        </>
    );
};

export default DetalleRegistros;
