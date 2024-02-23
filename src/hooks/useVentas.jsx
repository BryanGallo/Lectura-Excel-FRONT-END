import { useContext } from "react";
import VentasContext from "../context/VentasProvider";

const useVentas = () => {
    return useContext(VentasContext);
};

export default useVentas;
